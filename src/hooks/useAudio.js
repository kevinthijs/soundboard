import { useState, useCallback, useRef } from 'react'

// Module-level reference to the active Audio element (at most one at a time)
let activeAudio = null

function cancelActive() {
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.src = ''
    activeAudio = null
  }
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
    cancelActive()

    sessionRef.current += 1
    const mySession = sessionRef.current

    const src = command.audio?.[lang]
    const text = command.label[lang]

    setPlayingId(command.id)

    // Guard: if a newer play() has run before this callback fires, do nothing
    const onEnd = () => {
      if (sessionRef.current !== mySession) return
      activeAudio = null
      setPlayingId(null)
    }

    if (src) {
      const audio = new Audio(src)
      activeAudio = audio

      audio.play()
        .then(() => {
          if (sessionRef.current !== mySession) return
          audio.addEventListener('ended', onEnd, { once: true })
          audio.addEventListener('error', onEnd, { once: true })
        })
        .catch(() => {
          if (sessionRef.current !== mySession) return
          activeAudio = null
          speakTTS(text, ttsLang, onEnd)
        })
    } else {
      speakTTS(text, ttsLang, onEnd)
    }
  }, [])

  return { play, playingId }
}
