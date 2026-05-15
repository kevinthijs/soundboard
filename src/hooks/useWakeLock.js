import { useEffect } from 'react'

export function useWakeLock() {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return

    let lock = null

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
      } catch {}
    }

    acquire()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      lock?.release()
    }
  }, [])
}
