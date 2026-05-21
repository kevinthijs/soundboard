import { useState, useCallback, useRef } from 'react'

// Single persistent element — iOS requires a reusable audio element rather
// than a new Audio() per tap. Detached objects are unreliable on WebKit.
const audioEl = document.createElement('audio')
audioEl.setAttribute('playsinline', '')

let ttsUnlocked = false

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

function speakTTS(text, ttsLang, onEnd) {
  if (!('speechSynthesis' in window)) {
    onEnd()
    return
  }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = ttsLang
  utterance.rate = 0.88
  utterance.pitch = 1
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
    const text = command.label[lang]

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
          speakTTS(text, ttsLang, onEnd)
        })
    } else {
      speakTTS(text, ttsLang, onEnd)
    }
  }, [])

  return { play, playingId }
}
