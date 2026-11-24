import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useProducts } from '../data/useProducts'
import type { Product, ProductCategory } from '../data/types'

/**
 * Transicao entre rotas: dois tracos SVG que "desenham" o ecra e depois descobrem a pagina nova.
 * Adaptada de "Page Transitions / 5 / SVG-Page-transition-main" (Componentes_Web_App), com GSAP e o useNavigate do React Router.
 * A cor depende da aba de destino. Desliga com prefers-reduced-motion (navega direto).
 */
type Tab = 'brand' | ProductCategory

const COLORS: Record<Tab, [string, string]> = {
  brand: ['#14131E', '#F2B63F'],
  infantil: ['#8FD0E8', '#F4896B'],
  planners: ['#A7D7C5', '#4E8B78'],
  templates: ['#C3B3EE', '#6E44FF'],
}

const DURATION = 0.7

/** Aba a que um caminho pertence; produtos herdam a categoria do produto. */
function tabOf(pathname: string, products: Product[]): Tab {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/infantil') return 'infantil'
  if (p === '/planners') return 'planners'
  if (p === '/templates') return 'templates'
  const m = p.match(/^\/produtos\/([^/]+)$/)
  if (m) {
    const slug = decodeURIComponent(m[1])
    return products.find((x) => x.slug === slug)?.category ?? 'brand'
  }
  return 'brand'
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useProducts()
  const overlayRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const busy = useRef(false)
  const [active, setActive] = useState(false)
  const loc = useRef(location)
  loc.current = location
  const products = useRef<Product[]>([])
  products.current = state.status === 'ready' ? state.data : []

  const paths = useCallback(() => Array.from(svgRef.current?.querySelectorAll('path') ?? []), [])

  useEffect(() => {
    paths().forEach((path) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = String(length)
      path.style.strokeDashoffset = String(length)
    })
  }, [paths])

  const leave = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: () => resolve() })
        paths().forEach((path) => {
          tl.to(path, { strokeDashoffset: 0, attr: { 'stroke-width': 700 }, duration: DURATION, ease: 'power1.inOut' }, 0)
        })
      }),
    [paths],
  )

  const enter = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: () => resolve() })
        paths().forEach((path) => {
          const length = path.getTotalLength()
          tl.to(
            path,
            {
              strokeDashoffset: -length,
              attr: { 'stroke-width': 200 },
              duration: DURATION,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.set(path, { strokeDashoffset: length })
              },
            },
            0,
          )
        })
      }),
    [paths],
  )

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
      const [c1, c2] = COLORS[tabOf(url.pathname, products.current)]
      overlayRef.current?.style.setProperty('--transition-stroke-1', c1)
      overlayRef.current?.style.setProperty('--transition-stroke-2', c2)
      setActive(true)
      try {
        await leave()
        navigate(url.pathname + url.search + url.hash)
        await new Promise((r) => setTimeout(r, 120))
        await enter()
      } finally {
        setActive(false)
        busy.current = false
      }
    }
    // captura: corre antes do onClick dos <Link> do React Router
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate, leave, enter])

  return (
    <>
      <div ref={overlayRef} aria-hidden="true" data-active={active} className="pt-svg">
        <svg ref={svgRef} viewBox="0 0 2453 2535" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
            stroke="var(--transition-stroke-1)"
            strokeWidth="200"
            strokeLinecap="round"
          />
          <path
            d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
            stroke="var(--transition-stroke-2)"
            strokeWidth="200"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {children}
    </>
  )
}
