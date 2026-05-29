const CATEGORY_CLASS = {
  veiligheid: 'btn-veiligheid',
  richting: 'btn-richting',
  manoeuvre: 'btn-manoeuvre',
  radio: 'btn-radio',
}

export default function CommandButton({ command, lang, play, isPlaying }) {
  const catClass = CATEGORY_CLASS[command.category] ?? 'btn-veiligheid'
  const localized = command.label?.[lang] ?? command.label?.en ?? command.label?.nl ?? ''

  return (
    <button
      onClick={() => play(command)}
      className={[
        'relative border-[3px] rounded-xl p-3.5 min-h-[102px] sm:min-h-[110px]',
        'flex flex-col items-center justify-center gap-1.5',
        'text-center transition-transform duration-100',
        'active:scale-95 touch-manipulation select-none',
        'cursor-pointer',
        catClass,
        isPlaying ? 'is-playing' : '',
      ].join(' ')}
      aria-pressed={isPlaying}
      aria-label={`${command.label.nl} — ${localized}`}
    >
      <span className="text-zinc-600 text-[11px] sm:text-xs font-bold uppercase tracking-widest leading-none">
        {command.label.nl}
      </span>
      <span className="text-zinc-900 font-extrabold leading-tight" style={{ fontSize: 'clamp(14px, 3.8vw, 20px)' }}>
        {localized}
      </span>
    </button>
  )
}
