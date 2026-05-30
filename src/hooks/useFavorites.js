import { useState, useCallback } from 'react'

const KEY = 'soundboard_favorites'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  const toggle = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { favorites, toggle }
}
