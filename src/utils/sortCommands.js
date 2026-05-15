export function sortCommands(commands) {
  return commands.toSorted((a, b) => {
    // Within same category sort by priority; across categories sort by category order then priority
    const catOrder = { veiligheid: 0, richting: 1, manoeuvre: 2 }
    const catDiff = (catOrder[a.category] ?? 99) - (catOrder[b.category] ?? 99)
    if (catDiff !== 0) return catDiff
    return (a.priority ?? 99) - (b.priority ?? 99)
  })
}
