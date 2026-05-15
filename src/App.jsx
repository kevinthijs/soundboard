import { useState, useCallback } from 'react'
import data from './commands.json'
import LanguageBar from './components/LanguageBar.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import CommandButton from './components/CommandButton.jsx'
import { useAudio } from './hooks/useAudio.js'
import { useWakeLock } from './hooks/useWakeLock.js'
import { sortCommands } from './utils/sortCommands.js'

export default function App() {
  const [lang, setLang] = useState('pl')
  const [category, setCategory] = useState('veiligheid')
  const { play, playingId } = useAudio()
  useWakeLock()

  const ttsLang = data.languages.find((l) => l.code === lang)?.ttsLang ?? 'en-GB'

  const visibleCommands =
    category === 'alles'
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
      <CategoryTabs categories={data.categories} active={category} onChange={setCategory} />

      <main className="grid-scroll safe-bottom">
        <div className="cmd-grid grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleCommands.map((cmd) => (
            <CommandButton
              key={cmd.id}
              command={cmd}
              lang={lang}
              play={handlePlay}
              isPlaying={playingId === cmd.id}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
