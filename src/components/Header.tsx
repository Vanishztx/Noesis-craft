import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import LangSwitch from './LangSwitch'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Header() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const wasOpen = useRef(false)

  const close = useCallback(() => setOpen(false), [])
  useEffect(() => close(), [pathname, close])

  // Comportamento ao rolar: compacta ao sair do topo, esconde ao descer, volta ao subir
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const run = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 12)
      const dy = y - last
      if (y < 160) setHidden(false)
      else if (dy > 8) setHidden(true)
      else if (dy < -8) setHidden(false)
      if (Math.abs(dy) > 8) last = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Menu movel: bloqueia o scroll, Esc fecha, foco preso, foco devolvido ao botao
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      document.body.style.overflow = 'hidden'
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      const id = window.setTimeout(() => first?.focus(), 80)
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          setOpen(false)
          return
        }
        if (e.key !== 'Tab' || !rootRef.current) return
        const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement)
        if (!items.length) return
        const a = items[0]
        const b = items[items.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          b.focus()
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault()
          a.focus()
        }
      }
      const mq = window.matchMedia('(min-width: 768px)')
      const onMq = () => mq.matches && setOpen(false)
      document.addEventListener('keydown', onKey)
      mq.addEventListener('change', onMq)
      return () => {
        window.clearTimeout(id)
        document.body.style.overflow = ''
        document.removeEventListener('keydown', onKey)
        mq.removeEventListener('change', onMq)
      }
    }
    if (wasOpen.current) {
      wasOpen.current = false
      // Devolve o foco ao botao se ficou perdido (ex.: Esc); numa navegacao o foco vai para o conteudo
      const ae = document.activeElement
      if (!ae || ae === document.body || panelRef.current?.contains(ae)) btnRef.current?.focus()
    }
  }, [open])

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/produtos', label: t('nav.products'), end: false },
    { to: '/infantil', label: t('nav.kids'), end: false },
    { to: '/planners', label: t('nav.planners'), end: false, soon: true },
    { to: '/templates', label: t('nav.templates'), end: false, soon: true },
  ]
  const hide = hidden && !open

  return (
    <div ref={rootRef}>
      <header
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ease-soft ${
          hide ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled || open ? 'border-line bg-paper/90 backdrop-blur' : 'border-transparent bg-transparent'}`}
      >
        <div className={`container-x flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-16 md:h-20'}`}>
          <Link to="/" aria-label="noesis craft" className="group flex shrink-0 items-center gap-2.5">
            <img src="/logos/master.svg" alt="" className="h-10 w-10 shrink-0 transition-transform duration-500 ease-soft group-hover:-rotate-6 md:h-11 md:w-11" width={44} height={44} />
            <span className="hidden text-lg font-semibold tracking-tight text-ink min-[340px]:inline md:text-xl" aria-hidden="true">
              noesis craft
            </span>
          </Link>

          <nav aria-label={t('nav.main')} className="hidden items-center gap-4 md:flex lg:gap-6">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="nav-link pencil-link">
                {l.label}
                {l.soon && <span className="nav-soon">{t('soon.badge')}</span>}
              </NavLink>
            ))}
            <a href="/#sobre" className="nav-link pencil-link">
              {t('nav.about')}
            </a>
            <LangSwitch />
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <LangSwitch />
            <button
              ref={btnRef}
              type="button"
              className="grid h-11 w-11 place-items-center border-2 border-ink bg-paper"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t('nav.menu.close') : t('nav.menu.open')}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3.5 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : ''}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-nav" ref={panelRef} aria-label={t('nav.main')} data-open={open} inert={!open} className="menu-panel md:hidden">
        <ul className="container-x flex flex-col pt-6">
          {[...links, { to: '/#sobre', label: t('nav.about'), end: false, soon: false }].map((l, i) => {
            const num = String(i + 1).padStart(2, '0')
            return (
              <li key={l.to} className="menu-item border-b border-ink/15" style={{ ['--i' as string]: i }}>
                {l.to.includes('#') ? (
                  <a href={l.to} onClick={close} className="flex items-baseline gap-4 py-5 text-3xl font-semibold text-ink">
                    <span className="text-xs font-semibold text-craft-text">{num}</span>
                    {l.label}
                  </a>
                ) : (
                  <NavLink to={l.to} end={l.end} onClick={close} className="flex items-baseline gap-4 py-5 text-3xl font-semibold text-ink">
                    {({ isActive }) => (
                      <>
                        <span className="text-xs font-semibold text-craft-text">{num}</span>
                        <span className={isActive ? 'mark' : ''} style={isActive ? { animation: 'none' } : undefined}>
                          {l.label}
                        </span>
                        {l.soon && <span className="nav-soon">{t('soon.badge')}</span>}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            )
          })}
        </ul>
        <p className="menu-item container-x mt-auto pb-8 text-sm text-muted" style={{ ['--i' as string]: links.length + 1 }}>
          {t('footer.tag')}
        </p>
      </nav>
    </div>
  )
}
