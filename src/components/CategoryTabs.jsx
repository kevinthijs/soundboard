const ACCENT = {
  favorieten: { active: 'border-yellow-500 text-yellow-700 bg-yellow-50', inactive: 'border-transparent text-zinc-600' },
  alles: { active: 'border-zinc-700 text-zinc-900 bg-white', inactive: 'border-transparent text-zinc-600' },
  veiligheid: { active: 'border-red-700 text-red-800 bg-red-50', inactive: 'border-transparent text-zinc-600' },
  richting: { active: 'border-amber-500 text-amber-700 bg-amber-50', inactive: 'border-transparent text-zinc-600' },
  manoeuvre: { active: 'border-red-600 text-red-700 bg-red-50', inactive: 'border-transparent text-zinc-600' },
  radio: { active: 'border-amber-600 text-amber-800 bg-amber-50', inactive: 'border-transparent text-zinc-600' },
}

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <nav className="shrink-0 bg-white/95 border-b border-amber-300/90 flex overflow-x-auto">
      {categories.map((cat) => {
        const accent = ACCENT[cat.id] ?? ACCENT.alles
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={[
              'shrink-0 px-4 py-3.5 text-sm font-extrabold tracking-wide uppercase border-b-[3px] transition-all duration-150 touch-manipulation select-none whitespace-nowrap',
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
