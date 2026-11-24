import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { AGES, THEMES } from '../data/infantil'
import type { AgeRange } from '../data/types'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'
import EmailCapture from '../components/EmailCapture'
import Torn from '../components/Torn'
import { ErrorPanel, LoadingGrid } from '../components/StateViews'

const AGE_FILTERS = [{ id: 'all' as const, label: { pt: 'Todas', en: 'All' } }, ...AGES]
const ARTES_THEME = THEMES.find((th) => th.id === 'artes')!

/** Categoria Infantil: Artes (/infantil/artes). */
export default function InfantilArtes() {
  const { t, pick } = useI18n()
  useTitle(t('title.kids.arts'))
  const { state, reload } = useProducts()
  const [age, setAge] = useState<AgeRange | 'all'>('all')
  const ref = useReveal<HTMLDivElement>([state.status, age])

  const artesProducts = useMemo(() => {
    if (state.status !== 'ready') return []
    return state.data.filter(
      (p) =>
        p.category === 'infantil' &&
        p.theme === 'artes' &&
        (age === 'all' || !p.ageRange || p.ageRange.includes(age)),
    )
  }, [state, age])

  const shownTopics = useMemo(
    () => ARTES_THEME.topics.filter((tp) => age === 'all' || tp.ages.includes(age)),
    [age],
  )

  const statusText = t('kids.arts.count')
    .replace('{books}', String(artesProducts.length))
    .replace('{topics}', String(shownTopics.length))
    .replace('{age}', pick(AGE_FILTERS.find((a) => a.id === age)!.label))

  return (
    <div ref={ref} className="kids">
      <section className="kids-hero relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="kid-blob drift absolute -left-14 top-6 h-40 w-40 bg-sky/50" />
          <span className="kid-blob drift absolute -right-10 bottom-12 h-44 w-44 bg-coral/25" style={{ ['--fd' as string]: '-4s' }} />
          <span className="kid-star spin-slow absolute right-[18%] top-8 h-7 w-7 bg-amber" />
          <span className="kid-star twinkle absolute bottom-20 left-[8%] h-6 w-6 bg-coral" />
          <span className="kid-star twinkle absolute right-[8%] bottom-24 h-5 w-5 bg-sky" style={{ ['--fd' as string]: '-1.4s' }} />
        </div>

        <div className="container-x relative pb-14 pt-8 md:pb-20 md:pt-12">
          <nav aria-label={t('breadcrumb.label')} className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-ink-2">
              <li>
                <Link to="/" className="pencil-link inline-flex min-h-11 items-center py-2 text-ink">
                  {t('nav.home')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted">
                /
              </li>
              <li>
                <Link to="/infantil" className="pencil-link inline-flex min-h-11 items-center py-2 text-ink">
                  {t('nav.kids')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted">
                /
              </li>
              <li>
                <span aria-current="page" className="inline-flex min-h-11 items-center py-2 font-bold text-ink">
                  {pick(ARTES_THEME.name)}
                </span>
              </li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="rise flex flex-wrap items-center gap-3">
              <span className="kid-eyebrow">{t('kids.arts.eyebrow')}</span>
              <span className="kid-tag kid-tag-live">{t('kids.tag.live')}</span>
            </div>

            <div className="rise mt-5 flex items-center gap-4" style={{ ['--d' as string]: '100ms' }}>
              <span
                aria-hidden="true"
                className="kid-glyph !mb-0 shrink-0 border-2 border-ink"
                style={{ ['--glyph' as string]: 'var(--color-amber)' }}
              >
                {ARTES_THEME.glyph}
              </span>
              <h1 className="text-5xl sm:text-6xl">
                <span className="kid-mark">{pick(ARTES_THEME.name)}</span>
              </h1>
            </div>

            <p className="rise mt-5 max-w-xl text-lg leading-relaxed text-ink-2" style={{ ['--d' as string]: '200ms' }}>
              {t('kids.arts.lead')}
            </p>
          </div>
        </div>

        <div className="relative text-paper">
          <Torn />
        </div>
      </section>

      <section className="container-x pt-12" aria-labelledby="artes-idade-h">
        <div className="kid-ages">
          <h2 id="artes-idade-h" className="text-xl font-semibold sm:text-2xl">
            {t('kids.age.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('kids.age.hint')}</p>
          <div role="group" aria-labelledby="artes-idade-h" className="mt-4 flex flex-wrap gap-3">
            {AGE_FILTERS.map((a) => (
              <button key={a.id} type="button" aria-pressed={age === a.id} onClick={() => setAge(a.id)} className="kid-pill">
                {pick(a.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{t('kids.arts.topics.title')}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {shownTopics.map((tp) => (
              <li key={tp.label.pt} className="kid-topic">
                {pick(tp.label)}
              </li>
            ))}
          </ul>
        </div>

        <p className="sr-only" role="status">
          {state.status === 'ready' ? statusText : ''}
        </p>
      </section>

      <section id="livros" className="container-x scroll-mt-24 pt-12" aria-labelledby="artes-livros-h" aria-busy={state.status === 'loading'}>
        <h2 id="artes-livros-h" className="text-3xl sm:text-4xl">
          {t('kids.arts.books.title')}
        </h2>
        <div className="mt-8">
          {state.status === 'loading' && <LoadingGrid />}
          {state.status === 'error' && <ErrorPanel onRetry={reload} />}
          {state.status === 'ready' && artesProducts.length === 1 && (
            <div className="max-w-4xl">
              <ProductCard product={artesProducts[0]} wide />
            </div>
          )}
          {state.status === 'ready' && artesProducts.length > 1 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {artesProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 90} />
              ))}
            </div>
          )}
          {state.status === 'ready' && artesProducts.length === 0 && (
            <div className="kid-panel p-8 text-center">
              <p className="text-xl font-semibold">{t('kids.arts.empty.title')}</p>
              <p className="mx-auto mt-2 max-w-md text-muted">{t('kids.arts.empty.text')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="container-x pb-24 pt-16 md:pb-32 md:pt-20">
        <div data-reveal className="kid-panel p-6 sm:p-10">
          <span className="kid-tag">{t('soon.badge')}</span>
          <h2 className="mt-4 text-2xl sm:text-3xl">{t('kids.arts.more.title')}</h2>
          <p className="mb-6 mt-3 max-w-xl text-muted">{t('kids.arts.more.text')}</p>
          <EmailCapture topic="Noesis Craft Infantil · Artes" kids />
        </div>
      </section>
    </div>
  )
}
