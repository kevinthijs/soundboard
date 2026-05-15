const CATEGORY_CLASS = {
  veiligheid: 'btn-veiligheid',
  richting:   'btn-richting',
  manoeuvre:  'btn-manoeuvre',
}

export default function CommandButton({ command, lang, play, isPlaying }) {
  const catClass = CATEGORY_CLASS[command.category] ?? 'btn-veiligheid'

  return (
    <button
      onClick={() => play(command)}
      className={[
        'relative border-2 rounded-xl p-3 min-h-[96px]',
        'flex flex-col items-center justify-center gap-1',
        'text-center transition-transform duration-100',
        'active:scale-95 touch-manipulation select-none',
        'cursor-pointer',
        catClass,
        isPlaying ? 'is-playing' : '',
      ].join(' ')}
      aria-pressed={isPlaying}
      aria-label={`${command.label.nl} — ${command.label[lang]}`}
    >
      {/* Dutch reference label (small, for the guide) */}
      <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest leading-none">
        {command.label.nl}
      </span>
      {/* Translation in chosen language (large, prominent) */}
      <span className="text-white font-bold leading-tight" style={{ fontSize: 'clamp(13px, 3.5vw, 18px)' }}>
        {command.label[lang]}
      </span>
    </button>
  )
}
