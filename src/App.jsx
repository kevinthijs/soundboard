import { useState, useCallback } from 'react'
import data from './commands.json'
import LanguageBar from './components/LanguageBar.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import CommandButton from './components/CommandButton.jsx'
import { useAudio } from './hooks/useAudio.js'
import { useWakeLock } from './hooks/useWakeLock.js'
import { useFavorites } from './hooks/useFavorites.js'
import { sortCommands } from './utils/sortCommands.js'

const FAVORITES_TAB = { id: 'favorieten', label: '⭐ Favorieten' }
const ALL_CATEGORIES = [FAVORITES_TAB, ...data.categories]

export default function App() {
  const [lang, setLang] = useState('pl')
  const [category, setCategory] = useState('veiligheid')
  const { play, playingId } = useAudio()
  const { favorites, toggle } = useFavorites()
  useWakeLock()

  const ttsLang = data.languages.find((l) => l.code === lang)?.ttsLang ?? 'en-GB'

  const visibleCommands =
    category === 'favorieten'
      ? sortCommands(data.commands.filter((c) => favorites.includes(c.id)))
      : category === 'alles'
      ? sortCommands(data.commands)
      : sortCommands(data.commands.filter((c) => c.category === category))

  const handlePlay = useCallback(
    (command) => {
      play(command, lang, ttsLang)
    },
    [play, lang, ttsLang]
  )

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>
      <LanguageBar languages={data.languages} active={lang} onChange={setLang} />
      <CategoryTabs categories={ALL_CATEGORIES} active={category} onChange={setCategory} />

      <main className="grid-scroll safe-bottom">
        {category === 'favorieten' && visibleCommands.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center opacity-50">
            <span className="text-5xl">⭐</span>
            <p className="font-bold text-lg text-zinc-700">Nog geen favorieten</p>
            <p className="text-sm text-zinc-500">Houd een knop lang ingedrukt om hem hier toe te voegen.</p>
          </div>
        ) : (
          <div className="cmd-grid grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleCommands.map((cmd) => (
              <CommandButton
                key={cmd.id}
                command={cmd}
                lang={lang}
                play={handlePlay}
                isPlaying={playingId === cmd.id}
                isFavorite={favorites.includes(cmd.id)}
                onLongPress={toggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
