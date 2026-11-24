import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { useReveal } from '../lib/useReveal'
import { coverOf, formatCve, formatUsd, imagesFor } from '../lib/format'
import { useTitle } from '../lib/useTitle'
import Price from '../components/Price'
import ProductCard, { isNewProduct } from '../components/ProductCard'
import Torn from '../components/Torn'
import { ErrorPanel, LoadingGrid } from '../components/StateViews'

function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/** Pilha de folhas: capa a frente e duas paginas do livro por tras. */
function Stack() {
  const { t, lang, pick } = useI18n()
  const { state } = useProducts()
  const first = state.status === 'ready' ? state.data[0] : undefined
  const cover = first ? coverOf(first, lang) : undefined
  const pages = first ? imagesFor(first, lang).filter((i) => i.kind !== 'cover') : []

  return (
    <div className="rise stack relative mx-auto w-full max-w-[24rem] sm:max-w-[28rem] lg:max-w-none" style={{ ['--d' as string]: '250ms' }}>
      <div className="relative aspect-[5/6] w-full">
        <span aria-hidden="true" className="absolute inset-[6%] rounded-full bg-amber/20" />
        <span
          aria-hidden="true"
          className="absolute left-[2%] top-[62%] h-[14%] w-[14%] bg-craft"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
        />
        <span aria-hidden="true" className="absolute right-[6%] top-[4%] h-[5%] w-[5%] rounded-full bg-ink" />

        {first && cover ? (
          <>
            <span className="stack-sheet stack-back" aria-hidden="true">
              {pages[1] && <img src={pages[1].src} alt="" width={300} height={400} loading="eager" />}
            </span>
            <span className="stack-sheet stack-mid" aria-hidden="true">
              {pages[0] && <img src={pages[0].src} alt="" width={300} height={400} loading="eager" />}
            </span>
            <Link to={`/produtos/${first.slug}`} aria-label={pick(first.name)} className="stack-sheet stack-front block">
              <img src={cover.src} alt={pick(cover.alt)} width={900} height={1200} fetchPriority="high" />
              <span className="tape -top-3 left-1/2 -ml-11 rotate-[-4deg]" aria-hidden="true" />
            </Link>
            <span
              className="absolute bottom-[3%] right-[2%] z-10 grid h-24 w-24 rotate-12 place-items-center rounded-full border-2 border-dashed border-amber bg-ink text-center text-white sm:h-28 sm:w-28"
              aria-hidden="true"
            >
              <span className="text-2xl font-semibold leading-none sm:text-3xl">
                {formatCve(first.priceCve, lang)}
                <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-widest text-amber">≈ {formatUsd(first.priceUsd, lang)} USD</span>
              </span>
            </span>
            {isNewProduct(first) && <span className="chip absolute left-[8%] top-[78%] z-10">{t('hero.badge')}</span>}
          </>
        ) : state.status === 'loading' ? (
          <>
            <span className="stack-sheet stack-back"><span className="skeleton block h-full w-full" /></span>
            <span className="stack-sheet stack-mid"><span className="skeleton block h-full w-full" /></span>
            <span className="stack-sheet stack-front"><span className="skeleton block h-full w-full" /></span>
          </>
        ) : (
          <>
            <span className="stack-sheet stack-back" aria-hidden="true" />
            <span className="stack-sheet stack-mid" aria-hidden="true" />
            <span className="stack-sheet stack-front grid place-items-center" aria-hidden="true">
              <img src="/logos/master.svg" alt="" className="!h-20 !w-20 !object-contain" width={80} height={80} />
            </span>
          </>
        )}
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
            <Link to="/produtos" className="btn btn-amber w-full sm:w-auto">
              {t('hero.cta')} <Arrow />
            </Link>
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
        <Stack />
      </div>
    </section>
  )
}

function Featured() {
  const { t, lang, pick } = useI18n()
  const { state, reload } = useProducts()
  const ref = useReveal<HTMLElement>([state.status])

  const items = state.status === 'ready' ? state.data : []
  const main = items[0]
  const rest = items.slice(1, 4)
  // O hero ja mostra a capa do 1.o produto: aqui usa-se uma pagina de exemplo.
  const cover = main ? (imagesFor(main, lang).find((i) => i.kind === 'page') ?? coverOf(main, lang)) : undefined

  if (state.status === 'ready' && !main) return null

  return (
    <section ref={ref} id="destaque" className="on-ink relative text-white">
      <div className="text-ink">
        <Torn />
      </div>
      <div className="-mt-px bg-ink pb-24 pt-10 md:pb-32 md:pt-14">
        <div className="container-x">
          <div data-reveal>
            <p className="eyebrow">{t('featured.eyebrow')}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">{t('featured.title')}</h2>
          </div>

          {state.status === 'loading' && (
            <div className="mt-12 text-ink">
              <LoadingGrid count={1} wide />
            </div>
          )}
          {state.status === 'error' && (
            <div className="mt-12 text-ink">
              <ErrorPanel onRetry={reload} />
            </div>
          )}

          {main && (
            <div className="mt-12 grid items-center gap-12 md:grid-cols-2 md:gap-16">
              <Link
                to={`/produtos/${main.slug}`}
                data-reveal
                aria-label={pick(main.name)}
                className="gallery-wrap relative mx-auto block w-full max-w-sm md:justify-self-center"
              >
                <span className="gallery-sheet block p-2 text-ink">
                  {cover && <img src={cover.src} alt={pick(cover.alt)} width={900} height={1200} loading="lazy" className="block w-full" />}
                </span>
                <span className="tape -top-3 left-1/2 -ml-11 rotate-3" aria-hidden="true" />
              </Link>
              <div data-reveal style={{ ['--d' as string]: '120ms' }}>
                <h3 className="text-4xl sm:text-5xl">{pick(main.name)}</h3>
                <p className="mt-3 text-lg text-amber">{pick(main.headline)}</p>
                <p className="mt-6 max-w-lg leading-relaxed text-white/80">{pick(main.description)}</p>
                <div className="mt-8">
                  <Price product={main} size="lg" onInk />
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Link to={`/produtos/${main.slug}`} className="btn btn-amber w-full sm:w-auto">
                    {t('featured.cta')} <Arrow />
                  </Link>
                  {items.length > 1 && (
                    <Link to="/produtos" className="btn btn-on-ink">
                      {t('featured.all')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-20 grid gap-6 text-ink sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 80} onInk />
              ))}
            </div>
          )}
        </div>
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
      <Featured />
      <How />
      <About />
    </>
  )
}
