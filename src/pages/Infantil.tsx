import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { AGES, THEMES } from '../data/infantil'
import type { AgeRange, InfantilTheme } from '../data/types'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import { coverOf } from '../lib/format'
import ProductCard from '../components/ProductCard'
import EmailCapture from '../components/EmailCapture'
import Torn from '../components/Torn'
import { ErrorPanel, LoadingGrid } from '../components/StateViews'

const AGE_FILTERS = [{ id: 'all' as const, label: { pt: 'Todas', en: 'All' } }, ...AGES]
const THEME_PATHS: Partial<Record<InfantilTheme, string>> = {
  artes: '/infantil/artes',
}

function Cloud({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 36" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M12 30a8 8 0 0 1 1-16 11 11 0 0 1 21-2 9 9 0 0 1 12 9 7 7 0 0 1-1 9z" fill="#fff" stroke="#14131e" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function Pencil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 20" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M4 10l12-7h62v14H16z" fill="#F2B63F" stroke="#14131e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 10l12-7v14z" fill="#faf8f3" stroke="#14131e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M78 3h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8z" fill="#F4896B" stroke="#14131e" strokeWidth="2" />
    </svg>
  )
}

/** Aba Infantil: identidade propria (cores e formas lúdicas) sobre a mesma estética de papel. So livros infantis. */
export default function Infantil() {
  const { t, pick, lang } = useI18n()
  useTitle(t('title.kids'))
  const { state, reload } = useProducts()
  const [age, setAge] = useState<AgeRange | 'all'>('all')
  const ref = useReveal<HTMLDivElement>([state.status, age])

  const kidsProducts = useMemo(() => {
    if (state.status !== 'ready') return []
    return state.data.filter((p) => p.category === 'infantil' && (age === 'all' || !p.ageRange || p.ageRange.includes(age)))
  }, [state, age])
  const themes = useMemo(
    () => THEMES.map((th) => ({ ...th, shown: th.topics.filter((tp) => age === 'all' || tp.ages.includes(age)) })).filter((th) => th.shown.length > 0),
    [age],
  )
  const allKids = useMemo(() => (state.status === 'ready' ? state.data.filter((p) => p.category === 'infantil') : []), [state])
  const statusText = t('kids.count').replace('{books}', String(kidsProducts.length)).replace('{themes}', String(themes.length))
    .replace('{topics}', String(themes.reduce((n, th) => n + th.shown.length, 0)))
    .replace('{age}', pick(AGE_FILTERS.find((a) => a.id === age)!.label))
  const hero = state.status === 'ready' ? state.data.find((p) => p.category === 'infantil') : undefined
  const heroCover = hero ? coverOf(hero, lang) : undefined

  return (
    <div ref={ref} className="kids">
      <section className="kids-hero relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="kid-blob drift absolute -left-12 top-8 h-40 w-40 bg-sky/50" />
          <span className="kid-blob drift absolute -right-10 bottom-16 h-44 w-44 bg-lilac/50" style={{ ['--fd' as string]: '-4s' }} />
          <span className="kid-star spin-slow absolute left-[46%] top-6 h-6 w-6 bg-coral" />
          <span className="kid-star twinkle absolute bottom-24 left-[6%] h-8 w-8 bg-amber" />
          <span className="kid-star twinkle absolute right-[9%] top-24 h-5 w-5 bg-sky" style={{ ['--fd' as string]: '-1.2s' }} />
          <Cloud className="bob absolute right-[22%] top-5 hidden w-20 sm:block" />
          <Pencil className="bob absolute bottom-10 left-[38%] hidden w-24 md:block" />
        </div>
        <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="kid-eyebrow rise">{t('kids.eyebrow')}</p>
            <h1 className="rise mt-4 text-5xl sm:text-6xl" style={{ ['--d' as string]: '100ms' }}>
              {t('kids.title.a')} <span className="kid-mark">{t('kids.title.b')}</span>
            </h1>
            <p className="rise mt-5 max-w-lg text-lg text-ink-2" style={{ ['--d' as string]: '200ms' }}>
              {t('kids.lead')}
            </p>
            <div className="rise mt-7 flex flex-wrap gap-3" style={{ ['--d' as string]: '300ms' }}>
              <a href="#temas" className="btn btn-amber btn-kid">
                {t('kids.cta.themes')}
              </a>
              <a href="#livros" className="btn btn-ghost btn-kid">
                {t('kids.cta.books')}
              </a>
            </div>
          </div>
          <div className="rise relative mx-auto w-full max-w-[18rem] md:max-w-none" style={{ ['--d' as string]: '250ms' }}>
            <span aria-hidden="true" className="kid-blob drift absolute -inset-4 bg-sky/60" />
            <span aria-hidden="true" className="kid-star twinkle absolute -right-2 -top-3 h-12 w-12 bg-amber" />
            <span aria-hidden="true" className="bob absolute -bottom-3 -left-3 h-10 w-10 rounded-full bg-coral" />
            {hero && heroCover && (
              <Link to={`/produtos/${hero.slug}`} className="kid-sticker relative block rotate-[3deg]" aria-label={pick(hero.name)}>
                <img src={heroCover.src} alt={pick(heroCover.alt)} width={900} height={1200} fetchPriority="high" className="block w-full" />
              </Link>
            )}
          </div>
        </div>
        <div className="relative text-paper">
          <Torn />
        </div>
      </section>

      <section id="temas" className="container-x relative scroll-mt-24 pt-14" aria-labelledby="temas-h">
        <div aria-hidden="true" className="pointer-events-none absolute right-6 top-10 hidden opacity-50 sm:block">
          <Cloud className="bob w-16" />
          <span className="kid-star twinkle absolute -left-8 top-8 h-6 w-6 bg-coral" />
        </div>
        <p className="kid-eyebrow">{t('kids.themes.eyebrow')}</p>
        <h2 id="temas-h" className="mt-3 text-3xl sm:text-4xl">
          {t('kids.themes.title')}
        </h2>
        <p className="mt-3 max-w-xl text-muted">{t('kids.themes.lead')}</p>

        <div className="kid-ages mt-8">
          <h3 id="idade-h" className="text-xl font-semibold sm:text-2xl">
            {t('kids.age.title')}
          </h3>
          <p className="mt-1 text-sm text-muted">{t('kids.age.hint')}</p>
          <div role="group" aria-labelledby="idade-h" className="mt-4 flex flex-wrap gap-3">
            {AGE_FILTERS.map((a) => (
              <button key={a.id} type="button" aria-pressed={age === a.id} onClick={() => setAge(a.id)} className="kid-pill">
                {pick(a.label)}
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">
          {state.status === 'ready' ? statusText : ''}
        </p>

        <ul className="kid-themes mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2" data-n={themes.length}>
          {themes.map((th, i) => {
            const categoryPath = THEME_PATHS[th.id]
            const liveProduct = allKids.find((p) => p.theme === th.id)
            const live = Boolean(categoryPath || liveProduct)
            const targetPath = categoryPath ?? (liveProduct ? `/produtos/${liveProduct.slug}` : null)
            const body = (
              <>
                <div className="kid-card-head">
                  <span className="kid-glyph" aria-hidden="true">
                    {th.glyph}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-2xl">{pick(th.name)}</h3>
                    <span className={`kid-tag mt-2 inline-block ${live ? 'kid-tag-live' : ''}`}>{live ? t('kids.tag.live') : t('soon.badge')}</span>
                  </div>
                </div>
                <p className="mt-4 text-ink-2">{pick(th.blurb)}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {th.shown.map((tp) => (
                    <li key={tp.label.pt} className="kid-topic">
                      {pick(tp.label)}
                    </li>
                  ))}
                </ul>
                <span className={`kid-card-foot ${live ? 'kid-go' : ''}`}>
                  {live ? (
                    <>
                      {categoryPath ? t('kids.card.explore').replace('{theme}', pick(th.name)) : t('kids.card.go')}
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </>
                  ) : (
                    t('kids.card.soon')
                  )}
                </span>
              </>
            )
            const style = { ['--d' as string]: `${(i % 3) * 80}ms` }
            return (
              <li key={th.id} data-reveal style={style}>
                {targetPath ? (
                  <Link to={targetPath} className={`kid-card kid-live tone-${th.tone}`}>
                    {body}
                  </Link>
                ) : (
                  <div className={`kid-card tone-${th.tone}`}>{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section id="livros" className="container-x scroll-mt-24 pt-20" aria-busy={state.status === 'loading'}>
        <h2 className="text-3xl sm:text-4xl">{t('kids.books')}</h2>
        <div className="mt-8">
          {state.status === 'loading' && <LoadingGrid />}
          {state.status === 'error' && <ErrorPanel onRetry={reload} />}
          {state.status === 'ready' && kidsProducts.length > 0 && (
            <div className={`grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 ${kidsProducts.length === 1 ? 'max-w-3xl' : 'lg:grid-cols-3'}`}>
              {kidsProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 90} />
              ))}
            </div>
          )}
          {state.status === 'ready' && kidsProducts.length === 0 && (
            <div className="kid-panel p-8 text-center">
              <p className="text-xl font-semibold">{t('kids.empty.title')}</p>
              <p className="mx-auto mt-2 max-w-md text-muted">{t('kids.empty.text')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="container-x pb-24 pt-20 md:pb-32">
        <div data-reveal className="kid-panel p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">{t('kids.notify.title')}</h2>
          <p className="mb-6 mt-3 max-w-xl text-muted">{t('kids.notify.text')}</p>
          <EmailCapture topic="Noesis Craft Infantil" kids />
        </div>
      </section>
    </div>
  )
}
