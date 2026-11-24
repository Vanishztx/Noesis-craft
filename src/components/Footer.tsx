import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import Torn from './Torn'

const STORE_URL = import.meta.env.VITE_STORE_URL as string | undefined

function Seal() {
  const { t } = useI18n()
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={t('footer.seal')} className="h-28 w-28 text-amber">
      <g className="seal-spin" style={{ transformOrigin: '60px 60px' }}>
        <defs>
          <path id="seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text fill="currentColor" fontSize="10.5" fontWeight="600" letterSpacing="3.2">
          <textPath href="#seal-ring">NOESIS · CABO VERDE · NOESIS · CABO VERDE ·</textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="60" cy="60" r="7" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="on-ink relative mt-8 text-white">
      <div className="text-ink">
        <Torn />
      </div>
      <div className="relative -mt-px bg-ink">
        <div className="container-x grid gap-12 pb-12 pt-6 md:grid-cols-[1.5fr_1fr_auto] md:items-end md:pb-16">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logos/reversed.svg" alt="" className="h-12 w-12" width={48} height={48} />
              <span className="text-2xl font-semibold tracking-tight">noesis craft</span>
            </div>
            <p className="mt-5 max-w-xs leading-relaxed text-white/75">{t('footer.tag')}</p>
            <p className="mt-2 max-w-xs text-sm text-white/60">{t('footer.made')}</p>
          </div>
          <nav aria-label={t('nav.footer')}>
            <p className="eyebrow">{t('footer.shop')}</p>
            <ul className="mt-3">
              <li>
                <Link to="/produtos" className="pencil-link inline-block py-2.5">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/infantil" className="pencil-link inline-block py-2.5">
                  {t('nav.kids')}
                </Link>
              </li>
              <li>
                <Link to="/planners" className="pencil-link inline-block py-2.5">
                  {t('nav.planners')} · {t('soon.badge')}
                </Link>
              </li>
              <li>
                <Link to="/templates" className="pencil-link inline-block py-2.5">
                  {t('nav.templates')} · {t('soon.badge')}
                </Link>
              </li>
              <li>
                <a href="/#sobre" className="pencil-link inline-block py-2.5">
                  {t('nav.about')}
                </a>
              </li>
              {STORE_URL && (
                <li>
                  <a href={STORE_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t('footer.store')} (${t('newtab')})`} className="pencil-link inline-block py-2.5">
                    {t('footer.store')}
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
            <Seal />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex min-h-11 items-center gap-2 border-2 border-white/60 px-4 text-sm font-semibold transition-colors hover:bg-white hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 16V3M3 9l6-6 6 6" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t('footer.top')}
            </button>
          </div>
        </div>
        <div className="border-t border-white/15">
          <p className="container-x py-5 text-xs text-white/70">
            © {new Date().getFullYear()} noesis craft · NOESIS. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
