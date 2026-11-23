/** Borda de papel rasgado. Pinta-se com currentColor; "flip" vira-a para baixo. */
function jag(seed: number) {
  let s = seed
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  const pts: string[] = []
  const w = 1200
  const step = 24
  for (let x = 0; x <= w; x += step) pts.push(`${x} ${(5 + rnd() * 13).toFixed(1)}`)
  return `M0 24 L${pts.join(' L')} L${w} 24 Z`
}
const D = jag(7)

export default function Torn({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-4 w-full md:h-6 ${className}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d={D} fill="currentColor" />
    </svg>
  )
}
