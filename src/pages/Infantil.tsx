import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { AGES, THEMES } from '../data/infantil'
import type { AgeRange } from '../data/types'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import { coverOf } from '../lib/format'
import ProductCard from '../components/ProductCard'
import EmailCapture from '../components/EmailCapture'
import Torn from '../components/Torn'
import { ErrorPanel, LoadingGrid } from '../components/StateViews'

const AGE_FILTERS = [{ id: 'all' as const, label: { pt: 'Todas', en: 'All' } }, ...AGES]

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
  const hero = state.status === 'ready' ? state.data.find((p) => p.category === 'infantil') : undefined
  const heroCover = hero ? coverOf(hero, lang) : undefined

  return (
    <div ref={ref} className="kids">
      <section className="kids-hero">
        <div className="container-x grid items-center gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="kid-eyebrow rise">{t('kids.eyebrow')}</p>
            <h1 className="rise mt-4 text-5xl sm:text-6xl" style={{ ['--d' as string]: '100ms' }}>
              {t('kids.title.a')} <span className="kid-mark">{t('kids.title.b')}</span>
            </h1>
            <p className="rise mt-5 max-w-lg text-lg text-ink-2" style={{ ['--d' as string]: '200ms' }}>
              {t('kids.lead')}
            </p>
            <div className="rise mt-7 flex flex-wrap gap-3" style={{ ['--d' as string]: '300ms' }}>
              <a href="#livros" className="btn btn-amber btn-kid">
                {t('kids.cta.books')}
              </a>
              <a href="#temas" className="btn btn-ghost btn-kid">
                {t('kids.cta.themes')}
              </a>
            </div>
          </div>
          <div className="rise relative mx-auto w-full max-w-[18rem] md:max-w-none" style={{ ['--d' as string]: '250ms' }}>
            <span aria-hidden="true" className="kid-blob absolute -inset-4 bg-sky/60" />
            <span aria-hidden="true" className="kid-star absolute -right-2 -top-3 h-12 w-12 bg-amber" />
            <span aria-hidden="true" className="absolute -bottom-3 -left-3 h-10 w-10 rounded-full bg-coral" />
            {hero && heroCover && (
              <Link to={`/produtos/${hero.slug}`} className="kid-sticker relative block rotate-[3deg]" aria-label={pick(hero.name)}>
                <img src={heroCover.src} alt={pick(heroCover.alt)} width={900} height={1200} fetchPriority="high" className="block w-full" />
              </Link>
            )}
          </div>
        </div>
        <div className="text-paper">
          <Torn />
        </div>
      </section>

      <section className="container-x pt-6" aria-labelledby="idade-h">
        <h2 id="idade-h" className="text-2xl sm:text-3xl">
          {t('kids.age.title')}
        </h2>
        <div role="group" aria-labelledby="idade-h" className="mt-5 flex flex-wrap gap-3">
          {AGE_FILTERS.map((a) => (
            <button key={a.id} type="button" aria-pressed={age === a.id} onClick={() => setAge(a.id)} className="kid-pill">
              {pick(a.label)}
            </button>
          ))}
        </div>
      </section>

      <section id="livros" className="container-x scroll-mt-24 pt-14" aria-busy={state.status === 'loading'}>
        <h2 className="text-3xl sm:text-4xl">{t('kids.books')}</h2>
        <p className="sr-only" role="status">
          {state.status === 'ready' ? statusText : ''}
        </p>
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

      <section id="temas" className="container-x scroll-mt-24 pt-20" aria-labelledby="temas-h">
        <p className="kid-eyebrow">{t('kids.themes.eyebrow')}</p>
        <h2 id="temas-h" className="mt-3 text-3xl sm:text-4xl">
          {t('kids.themes.title')}
        </h2>
        <p className="mt-3 max-w-xl text-muted">{t('kids.themes.lead')}</p>
        <ul className="kid-themes mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((th, i) => {
            const liveProduct = allKids.find((p) => p.theme === th.id)
            const live = Boolean(liveProduct)
            const body = (
              <>
                <span className="kid-glyph" aria-hidden="true">
                  {th.glyph}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl">{pick(th.name)}</h3>
                  <span className={`kid-tag ${live ? 'kid-tag-live' : ''}`}>{live ? t('kids.tag.live') : t('soon.badge')}</span>
                </div>
                <p className="mt-2 text-ink-2">{pick(th.blurb)}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {th.shown.map((tp) => (
                    <li key={tp.label.pt} className="kid-topic">
                      {pick(tp.label)}
                    </li>
                  ))}
                </ul>
              </>
            )
            const style = { ['--d' as string]: `${(i % 3) * 80}ms` }
            return (
              <li key={th.id} data-reveal style={style} className="h-full">
                {liveProduct ? (
                  <Link to={`/produtos/${liveProduct.slug}`} className={`kid-card kid-live tone-${th.tone}`}>
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
