import { useState, useCallback, useRef } from 'react'

// Single persistent element — iOS requires a reusable audio element rather
// than a new Audio() per tap. Detached objects are unreliable on WebKit.
const audioEl = document.createElement('audio')
audioEl.setAttribute('playsinline', '')

let ttsUnlocked = false

// Tuned for short, high-intelligibility radio-style instructions.
const TTS_PRESETS = {
  pl: { rate: 0.86, pitch: 0.94 },
  de: { rate: 0.84, pitch: 0.93 },
  ro: { rate: 0.87, pitch: 0.95 },
  uk: { rate: 0.84, pitch: 0.93 },
  es: { rate: 0.88, pitch: 0.95 },
  it: { rate: 0.87, pitch: 0.95 },
  fr: { rate: 0.86, pitch: 0.95 },
  en: { rate: 0.86, pitch: 0.94 },
}

function normalizeTTSText(text) {
  const clean = String(text ?? '')
    .replace(/[\/|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!clean) return ''

  // Add a short ending pause for clearer phrase separation on radio playback.
  return /[.!?]$/.test(clean) ? clean : `${clean}.`
}

function pickBestVoice(ttsLang) {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const lang = ttsLang.toLowerCase()
  const base = lang.split('-')[0]

  const byExact = voices.find((v) => v.lang?.toLowerCase() === lang)
  if (byExact) return byExact

  const byBase = voices.find((v) => v.lang?.toLowerCase().startsWith(`${base}-`))
  if (byBase) return byBase

  return voices.find((v) => v.default) ?? voices[0]
}

// Must be called synchronously inside the user gesture handler.
// Speaks a silent utterance to unlock speechSynthesis on iOS, so that
// subsequent async calls (e.g. from a .catch()) are still allowed.
function unlockTTS() {
  if (ttsUnlocked || !('speechSynthesis' in window)) return
  const silent = new SpeechSynthesisUtterance('')
  silent.volume = 0
  window.speechSynthesis.speak(silent)
  ttsUnlocked = true
}

function cancelActive() {
  audioEl.pause()
  audioEl.removeAttribute('src')
  window.speechSynthesis?.cancel()
}

function speakTTS(text, langCode, ttsLang, onEnd) {
  if (!('speechSynthesis' in window)) {
    onEnd()
    return
  }

  const utterance = new SpeechSynthesisUtterance(normalizeTTSText(text))
  const preset = TTS_PRESETS[langCode] ?? { rate: 0.86, pitch: 0.94 }
  const voice = pickBestVoice(ttsLang)

  utterance.lang = ttsLang
  if (voice) utterance.voice = voice
  utterance.rate = preset.rate
  utterance.pitch = preset.pitch
  utterance.volume = 1
  utterance.onend = onEnd
  utterance.onerror = onEnd

  window.speechSynthesis.speak(utterance)
}

export function useAudio() {
  const [playingId, setPlayingId] = useState(null)
  // Incremented each time play() is called; stale callbacks check against it
  const sessionRef = useRef(0)

  const play = useCallback((command, lang, ttsLang) => {
    navigator.vibrate?.(40)
    unlockTTS()  // must run synchronously within the gesture
    cancelActive()

    sessionRef.current += 1
    const mySession = sessionRef.current

    const src = command.audio?.[lang]
    const text = command.label?.[lang] ?? command.label?.en ?? command.label?.nl ?? ''

    setPlayingId(command.id)

    // Guard: if a newer play() has run before this callback fires, do nothing
    const onEnd = () => {
      if (sessionRef.current !== mySession) return
      setPlayingId(null)
    }

    if (src) {
      audioEl.src = src
      audioEl.currentTime = 0

      audioEl.play()
        .then(() => {
          if (sessionRef.current !== mySession) { audioEl.pause(); return }
          audioEl.addEventListener('ended', onEnd, { once: true })
          audioEl.addEventListener('error', onEnd, { once: true })
        })
        .catch(() => {
          if (sessionRef.current !== mySession) return
          speakTTS(text, lang, ttsLang, onEnd)
        })
    } else {
      speakTTS(text, lang, ttsLang, onEnd)
    }
  }, [])

  return { play, playingId }
}
