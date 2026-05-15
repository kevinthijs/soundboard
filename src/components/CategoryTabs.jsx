const ACCENT = {
  alles:      { active: 'border-slate-400 text-slate-200',  inactive: 'border-transparent text-slate-500' },
  veiligheid: { active: 'border-red-500 text-red-400',      inactive: 'border-transparent text-slate-500' },
  richting:   { active: 'border-blue-500 text-blue-400',    inactive: 'border-transparent text-slate-500' },
  manoeuvre:  { active: 'border-amber-500 text-amber-400',  inactive: 'border-transparent text-slate-500' },
}

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <nav className="shrink-0 bg-slate-900/80 border-b border-slate-700/60 flex overflow-x-auto">
      {categories.map((cat) => {
        const accent = ACCENT[cat.id] ?? ACCENT.alles
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={[
              'shrink-0 px-4 py-3 text-sm font-bold tracking-wide uppercase border-b-2 transition-all duration-150 touch-manipulation select-none whitespace-nowrap',
              isActive ? accent.active : accent.inactive,
            ].join(' ')}
          >
            {cat.label}
          </button>
        )
      })}
    </nav>
  )
}
