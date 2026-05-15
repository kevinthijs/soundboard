export default function LanguageBar({ languages, active, onChange }) {
  return (
    <header className="safe-top shrink-0 bg-slate-900 border-b border-slate-700/60">
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto">
        <span className="shrink-0 text-slate-500 text-xs font-semibold uppercase tracking-widest mr-1 select-none">
          Taal
        </span>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={[
              'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 touch-manipulation select-none',
              active === lang.code
                ? 'bg-slate-100 text-slate-900 shadow-sm'
                : 'bg-slate-800 text-slate-300 active:bg-slate-700',
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
