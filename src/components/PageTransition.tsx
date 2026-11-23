import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Transicao entre rotas: quadrados de papel que cobrem o ecra em ordem aleatoria e depois descobrem a pagina nova.
 * Adaptada de "Page Transitions / 12 / block-reveal-page-transition" (Componentes_Web_App), sem GSAP:
 * usa a Web Animations API e o useNavigate do React Router. Desliga com prefers-reduced-motion.
 */
const BLOCK = 72

export default function PageTransition({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const gridRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const [size, setSize] = useState({ cols: 0, rows: 0 })
  const [active, setActive] = useState(false)
  const loc = useRef(location)
  loc.current = location

  useEffect(() => {
    const measure = () => setSize({ cols: Math.ceil(window.innerWidth / BLOCK), rows: Math.ceil(window.innerHeight / BLOCK) })
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const run = useCallback((dir: 'in' | 'out') => {
    const el = gridRef.current
    if (!el) return Promise.resolve()
    const on = dir === 'in'
    const anims = (Array.from(el.children) as HTMLElement[]).map((b) =>
      b.animate(
        [
          { opacity: on ? 0 : 1, transform: `scale(${on ? 0.7 : 1})` },
          { opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 0.7})` },
        ],
        { duration: 150, delay: Math.random() * 240, fill: 'both', easing: 'ease-in-out' },
      ),
    )
    return Promise.all(anims.map((a) => a.finished.catch(() => undefined))).then(() => undefined)
  }, [])

  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === loc.current.pathname) {
        // mesma pagina: ancoras seguem o comportamento nativo; link sem ancora so volta ao topo
        if (!url.hash) {
          e.preventDefault()
          e.stopPropagation()
          window.scrollTo({ top: 0 })
        }
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      e.preventDefault()
      e.stopPropagation()
      if (busy.current) return
      busy.current = true
      setActive(true)
      await run('in')
      navigate(url.pathname + url.search + url.hash)
      await new Promise((r) => setTimeout(r, 140))
      await run('out')
      gridRef.current?.getAnimations({ subtree: true }).forEach((an) => an.cancel())
      setActive(false)
      busy.current = false
    }
    // captura: corre antes do onClick dos <Link> do React Router
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate, run])

  const count = size.cols * size.rows
  return (
    <>
      <div
        ref={gridRef}
        aria-hidden="true"
        data-active={active}
        className="pt-grid"
        style={{ gridTemplateColumns: `repeat(${size.cols}, ${BLOCK}px)`, gridAutoRows: `${BLOCK}px` }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="pt-block" data-tone={i % 29 === 0 ? 'a' : i % 3 === 0 ? '2' : undefined} />
        ))}
      </div>
      {children}
    </>
  )
}
