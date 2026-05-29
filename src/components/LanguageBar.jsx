export default function LanguageBar({ languages, active, onChange }) {
  return (
    <header className="safe-top shrink-0 bg-white/95 border-b-2 border-red-700/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto">
        <span className="shrink-0 text-red-800 text-xs font-bold uppercase tracking-widest mr-1 select-none">
          Taal
        </span>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={[
              'shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-bold transition-all duration-150 touch-manipulation select-none',
              active === lang.code
                ? 'bg-red-700 border-red-800 text-white shadow-sm'
                : 'bg-white border-amber-400 text-zinc-800 active:bg-amber-100',
            ].join(' ')}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="uppercase tracking-wide text-xs font-bold">{lang.code}</span>
          </button>
        ))}
      </div>
    </header>
  )
}
