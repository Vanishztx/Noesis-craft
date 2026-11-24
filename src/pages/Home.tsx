import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { SOON, THEMES } from '../data/infantil'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'
import Torn from '../components/Torn'
import { ErrorPanel } from '../components/StateViews'

function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/** Composicao editorial da marca: folhas nas cores das tres abas, simbolo da NOESIS e recortes de papel. */
function BrandArt() {
  const { t } = useI18n()
  return (
    <div
      role="img"
      aria-label={t('hero.art')}
      className="rise brand-art relative mx-auto w-full max-w-[24rem] sm:max-w-[28rem] lg:max-w-none"
      style={{ ['--d' as string]: '250ms' }}
    >
      <div className="relative aspect-[5/6] w-full" aria-hidden="true">
        <span className="drift absolute inset-[6%] rounded-full bg-amber/20" style={{ ['--fd' as string]: '0s' }} />
        <span
          className="bob absolute left-[1%] top-[60%] h-[14%] w-[14%] bg-craft"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)', ['--r' as string]: '0deg', ['--fd' as string]: '-2s' }}
        />
        <span className="twinkle absolute right-[5%] top-[4%] h-[5%] w-[5%] rounded-full bg-ink" />

        <span className="art-sheet bob art-sky" style={{ ['--r' as string]: '-9deg', ['--fd' as string]: '-1s' }}>
          <span className="art-label">{t('nav.kids')}</span>
          <svg viewBox="0 0 60 36" className="mt-3 w-3/4" fill="none">
            <path d="M12 30a8 8 0 0 1 1-16 11 11 0 0 1 21-2 9 9 0 0 1 12 9 7 7 0 0 1-1 9z" fill="#fff" stroke="#14131e" strokeWidth="2" />
          </svg>
          <span className="kid-star twinkle absolute -right-3 -top-3 h-9 w-9 bg-coral" />
        </span>
        <span className="art-sheet bob art-mint" style={{ ['--r' as string]: '7deg', ['--fd' as string]: '-3.5s' }}>
          <span className="art-label">{t('nav.planners')}</span>
          <span className="mt-3 block space-y-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-3 w-3 border-2 border-ink" />
                <span className="h-1.5 flex-1 bg-ink/20" style={{ maxWidth: `${90 - i * 18}%` }} />
              </span>
            ))}
          </span>
        </span>
        <span className="art-sheet bob art-lilac" style={{ ['--r' as string]: '-4deg', ['--fd' as string]: '-5s' }}>
          <span className="art-label">{t('nav.templates')}</span>
          <span className="mt-3 grid grid-cols-3 gap-1.5">
            <span className="col-span-3 h-4 bg-violet" />
            <span className="h-7 bg-ink/15" />
            <span className="col-span-2 h-7 bg-ink/10" />
          </span>
        </span>
        <span className="art-sheet bob art-logo" style={{ ['--r' as string]: '2deg', ['--fd' as string]: '-2.5s' }}>
          <img src="/logos/master.svg" alt="" width={256} height={256} fetchPriority="high" className="block h-full w-full object-contain" />
          <span className="tape -top-3 left-1/2 -ml-11 rotate-[-4deg]" />
        </span>
        <span
          className="bob absolute bottom-[2%] right-[4%] z-10 h-[3.2%] w-[34%] bg-amber"
          style={{ clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', ['--r' as string]: '-18deg', rotate: '-18deg', ['--fd' as string]: '-1.5s' }}
        />
      </div>
    </div>
  )
}

function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative">
      <div className="container-x grid items-center gap-12 pb-20 pt-8 md:pb-28 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-32">
        <div>
          <p className="eyebrow rise">{t('hero.eyebrow')}</p>
          <h1 className="mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.4rem]">
            <span className="rise block" style={{ ['--d' as string]: '100ms' }}>
              {t('hero.title.a')}
            </span>
            <span className="rise block" style={{ ['--d' as string]: '220ms' }}>
              <span className="mark">{t('hero.title.b')}</span>
            </span>
            <span className="rise block" style={{ ['--d' as string]: '340ms' }}>
              {t('hero.title.c')}
            </span>
          </h1>
          <p className="rise mt-7 max-w-md text-lg leading-relaxed text-muted" style={{ ['--d' as string]: '460ms' }}>
            {t('hero.lead')}
          </p>
          <div className="rise mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center" style={{ ['--d' as string]: '580ms' }}>
            <a href="#catalogo" className="btn btn-amber w-full sm:w-auto">
              {t('hero.cta')} <Arrow />
            </a>
            <a href="#sobre" className="pencil-link inline-flex min-h-11 items-center text-sm font-semibold">
              {t('hero.cta2')}
            </a>
          </div>
          <ul className="rise mt-10 flex flex-wrap gap-2" style={{ ['--d' as string]: '700ms' }}>
            {(['hero.chip.1', 'hero.chip.2', 'hero.chip.3'] as const).map((k) => (
              <li key={k} className="chip chip-quiet normal-case tracking-normal">
                {t(k)}
              </li>
            ))}
          </ul>
        </div>
        <BrandArt />
      </div>
    </section>
  )
}

type Tab = 'infantil' | 'planners' | 'templates'
const TAB_PATH: Record<Tab, string> = { infantil: '/infantil', planners: '/planners', templates: '/templates' }

/** Folha de papel "em breve": mock inclinado com linhas, para abas ainda sem produtos. */
function PreviewSheet({ label, kind, i }: { label: string; kind: 'planners' | 'templates'; i: number }) {
  const { t } = useI18n()
  const rot = [-1.8, 1.4, -1][i % 3]
  return (
    <li className="cat-preview sheet bob p-5" style={{ ['--r' as string]: `${rot}deg`, ['--fd' as string]: `${-i * 1.7}s`, rotate: `${rot}deg` }}>
      <span className="tape -top-3 left-6 rotate-[-4deg]" aria-hidden="true" style={{ background: 'var(--row-accent)' }} />
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold leading-tight">{label}</h4>
        <span className="chip shrink-0">{t('soon.badge')}</span>
      </div>
      <div className="mt-5 space-y-2.5" aria-hidden="true">
        {kind === 'planners' ? (
          [0, 1, 2, 3].map((n) => (
            <span key={n} className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 shrink-0 border-2 border-ink" />
              <span className="h-1.5 bg-ink/15" style={{ width: `${88 - n * 14}%` }} />
            </span>
          ))
        ) : (
          <>
            <span className="block h-5" style={{ background: 'var(--row-accent)' }} />
            <span className="grid grid-cols-3 gap-2">
              <span className="h-10 bg-ink/10" />
              <span className="col-span-2 h-10 bg-ink/15" />
            </span>
            <span className="block h-1.5 w-3/4 bg-ink/15" />
          </>
        )}
      </div>
    </li>
  )
}

function CatalogRow({ tab, delay }: { tab: Tab; delay: number }) {
  const { t, pick } = useI18n()
  const { state, reload } = useProducts()
  const info = tab === 'infantil' ? null : SOON[tab]
  const name = tab === 'infantil' ? t('nav.kids') : tab === 'planners' ? t('nav.planners') : t('nav.templates')
  const lead = tab === 'infantil' ? t('cat.kids.lead') : pick(info!.lead)
  const more = tab === 'infantil' ? t('cat.more.kids') : tab === 'planners' ? t('cat.more.planners') : t('cat.more.templates')

  const items = useMemo(() => {
    if (state.status !== 'ready') return []
    return state.data
      .filter((p) => p.category === tab)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
  }, [state, tab])
  const live = items.length > 0
  const themesNext = tab === 'infantil' ? THEMES.filter((th) => !(state.status === 'ready' && state.data.some((p) => p.theme === th.id))) : []

  const aside = (
    <aside className="cat-aside sheet bob h-full p-6" style={{ ['--r' as string]: '0.8deg', rotate: '0.8deg' }}>
      <span className="kid-star twinkle absolute -right-3 -top-3 h-9 w-9 bg-amber" aria-hidden="true" />
      <h4 className="text-lg font-semibold">{t('cat.next.title')}</h4>
      <ul className="mt-4 flex flex-wrap gap-2">
        {themesNext.map((th) => (
          <li key={th.id} className="kid-topic">
            {pick(th.name)}
          </li>
        ))}
      </ul>
    </aside>
  )

  return (
    <article className={`cat-row cat-${tab}`} aria-labelledby={`cat-${tab}-h`} data-reveal style={{ ['--d' as string]: `${delay}ms` }}>
      <div>
        <p className="flex items-center gap-3">
          <span className={`kid-tag ${live ? 'kid-tag-live' : ''}`}>{live ? t('kids.tag.live') : t('soon.badge')}</span>
          {live && <span className="text-xs font-semibold uppercase tracking-widest text-muted">{t('cat.latest')}</span>}
        </p>
        <h3 id={`cat-${tab}-h`} className="mt-3 text-3xl sm:text-4xl">
          {name}
        </h3>
        <p className="mt-2 max-w-xl text-ink-2">{lead}</p>
      </div>

      <div className="mt-8">
        {state.status === 'loading' && (
          <div role={tab === 'infantil' ? 'status' : undefined} aria-hidden={tab === 'infantil' ? undefined : true} className="grid gap-6 sm:grid-cols-3">
            {tab === 'infantil' && <span className="sr-only">{t('state.loading')}</span>}
            {[0, 1, 2].map((n) => (
              <div key={n} className="skeleton h-44 sm:h-56" aria-hidden="true" />
            ))}
          </div>
        )}
        {state.status === 'error' && tab === 'infantil' && <ErrorPanel onRetry={reload} />}
        {state.status === 'error' && tab !== 'infantil' && <p className="text-muted">{t('state.error.text')}</p>}

        {state.status === 'ready' && live && items.length === 1 && (
          <div className={`grid items-stretch gap-6 ${tab === 'infantil' ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]' : ''}`}>
            <ProductCard product={items[0]} wide />
            {tab === 'infantil' && aside}
          </div>
        )}
        {state.status === 'ready' && live && items.length === 2 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} />
            ))}
            {tab === 'infantil' && <div className="sm:col-span-2 lg:col-span-1">{aside}</div>}
          </div>
        )}
        {state.status === 'ready' && items.length >= 3 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} />
            ))}
          </div>
        )}
        {state.status === 'ready' && !live && info && (
          <div>
            <ul className={`grid gap-6 ${info.items.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {info.items.map((it, i) => (
                <PreviewSheet key={it.pt} label={pick(it)} kind={tab === 'planners' ? 'planners' : 'templates'} i={i} />
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-2">{t('cat.soon.note')}</p>
          </div>
        )}
        {state.status === 'ready' && !live && !info && (
          <div className="kid-panel p-8 text-center">
            <p className="text-xl font-semibold">{t('kids.empty.title')}</p>
          </div>
        )}
      </div>

      <div className="mt-9 flex justify-center">
        <Link to={TAB_PATH[tab]} className="btn w-full sm:w-auto">
          {more} <Arrow />
        </Link>
      </div>
    </article>
  )
}

/** Catalogo: uma linha por aba (Infantil, Planners, Templates), uma abaixo da outra, com os ultimos publicados. */
function Catalog() {
  const { t } = useI18n()
  const { state } = useProducts()
  const ref = useReveal<HTMLElement>([state.status])
  return (
    <section ref={ref} id="catalogo" className="relative scroll-mt-24 bg-paper-2 pb-24 md:pb-32">
      <div className="absolute inset-x-0 top-0 text-paper">
        <Torn flip />
      </div>
      <div className="container-x pt-16 md:pt-24">
        <div data-reveal>
          <p className="eyebrow">{t('cat.eyebrow')}</p>
          <h2 className="mt-4 max-w-xl text-3xl sm:text-4xl">{t('cat.title')}</h2>
          <p className="mt-3 max-w-xl text-muted">{t('cat.lead')}</p>
        </div>
        <div className="mt-12 flex flex-col gap-10 md:gap-14">
          {(['infantil', 'planners', 'templates'] as const).map((tab, i) => (
            <CatalogRow key={tab} tab={tab} delay={i * 60} />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 text-paper">
        <Torn />
      </div>
    </section>
  )
}

function How() {
  const { t } = useI18n()
  const ref = useReveal<HTMLElement>()
  const steps = [
    { n: '01', t: t('how.1.t'), d: t('how.1.d') },
    { n: '02', t: t('how.2.t'), d: t('how.2.d') },
    { n: '03', t: t('how.3.t'), d: t('how.3.d') },
  ]
  return (
    <section ref={ref} className="container-x py-24 md:py-32">
      <div data-reveal>
        <p className="eyebrow">{t('how.eyebrow')}</p>
        <h2 className="mt-4 max-w-xl text-3xl sm:text-4xl">{t('how.title')}</h2>
      </div>
      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.n}
            data-reveal
            style={{ ['--d' as string]: `${i * 120}ms`, rotate: `${[-0.6, 0.5, -0.4][i]}deg` }}
            className="sheet fold p-7 md:p-8"
          >
            <span className="text-5xl font-semibold leading-none text-transparent [-webkit-text-stroke:2px_var(--color-ink)]" aria-hidden="true">
              {s.n}
            </span>
            <h3 className="mt-6 text-2xl">{s.t}</h3>
            <p className="mt-3 leading-relaxed text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function About() {
  const { t } = useI18n()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id="sobre" className="relative scroll-mt-24 bg-paper-2 py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 text-paper">
        <Torn flip />
      </div>
      <div className="container-x grid items-center gap-14 md:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="relative mx-auto aspect-square w-full max-w-xs" aria-hidden="true">
          <div className="sheet absolute inset-0 -rotate-3" />
          <div className="sheet absolute inset-0 rotate-2" />
          <div className="absolute inset-6 bg-ink" style={{ clipPath: 'polygon(0 0, 30% 0, 100% 70%, 100% 100%, 70% 100%, 0 30%)' }} />
          <div className="absolute bottom-6 left-6 h-12 w-12 bg-craft" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
          <div className="absolute right-12 top-12 h-6 w-6 rounded-full bg-amber" />
          <span className="tape -top-3 left-1/2 -ml-11 rotate-[-5deg]" />
        </div>
        <div data-reveal style={{ ['--d' as string]: '120ms' }}>
          <p className="eyebrow">{t('about.eyebrow')}</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">{t('about.title')}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t('about.p1')}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{t('about.p2')}</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useI18n()
  useTitle(t('title.home'))
  return (
    <>
      <Hero />
      <Catalog />
      <How />
      <About />
    </>
  )
}
