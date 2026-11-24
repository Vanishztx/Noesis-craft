import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProduct, useProducts } from '../data/useProducts'
import type { Product } from '../data/types'
import { coverOf, formatCve, formatUsd, imagesFor } from '../lib/format'
import { useReveal } from '../lib/useReveal'
import Price from '../components/Price'
import ProductCard, { isNewProduct } from '../components/ProductCard'
import { ErrorPanel } from '../components/StateViews'
import NotFound from './NotFound'

function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function DetailSkeleton() {
  const { t } = useI18n()
  return (
    <div role="status" aria-live="polite" className="container-x grid gap-12 py-12 md:grid-cols-2">
      <span className="sr-only">{t('state.loading')}</span>
      <div className="skeleton aspect-[3/4]" />
      <div className="space-y-5">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-14 w-3/4" />
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-24 w-full" />
      </div>
    </div>
  )
}

function Gallery({ product }: { product: Product }) {
  const { t, lang, pick } = useI18n()
  const imgs = imagesFor(product, lang)
  const [active, setActive] = useState(0)
  useEffect(() => setActive(0), [product.id, lang])
  const i = Math.min(active, Math.max(imgs.length - 1, 0))
  const shown = imgs[i] ?? coverOf(product, lang)
  const go = (d: number) => setActive((i + d + imgs.length) % imgs.length)

  return (
    <div>
      <div className="gallery-wrap relative">
        <div className="gallery-sheet p-2 sm:p-3">
          {shown && (
            <img
              key={shown.src}
              src={shown.src}
              alt={pick(shown.alt)}
              width={900}
              height={1200}
              fetchPriority="high"
              className="fade-swap block aspect-[3/4] w-full bg-paper object-contain"
            />
          )}
          {isNewProduct(product) && <span className="chip absolute left-0 top-5">{t('hero.badge')}</span>}
          <span className="tape -top-3 left-1/2 -ml-11 rotate-[-3deg]" aria-hidden="true" />
        </div>
        {imgs.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-1 sm:-mx-5 sm:px-0">
            <button type="button" className="round-btn pointer-events-auto" onClick={() => go(-1)} aria-label={t('product.prev')}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M16 9H3M8 3L2 9l6 6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button type="button" className="round-btn pointer-events-auto" onClick={() => go(1)} aria-label={t('product.next')}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {imgs.length > 1 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
            <p>{t('product.preview')}</p>
            <p aria-hidden="true">
              {i + 1} {t('product.of')} {imgs.length}
            </p>
          </div>
          <ul className="grid grid-cols-5 gap-2 sm:gap-3">
            {imgs.map((im, n) => (
              <li key={im.src}>
                <button
                  type="button"
                  onClick={() => setActive(n)}
                  aria-label={`${t('product.image')} ${n + 1}: ${pick(im.alt)}`}
                  aria-pressed={n === i}
                  className="thumb-btn"
                >
                  <img src={im.src} alt="" loading="lazy" width={150} height={200} className="aspect-[3/4] w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
          <p className="sr-only" aria-live="polite">
            {shown ? pick(shown.alt) : ''}
          </p>
        </div>
      )}
    </div>
  )
}

function Ticket({ product }: { product: Product }) {
  const { t, pick } = useI18n()
  return (
    <div className="ticket mt-8">
      <div className="p-6 sm:p-7">
        <Price product={product} size="lg" />
        {product.currency.note && <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">{pick(product.currency.note)}</p>}
      </div>
      <div className="perf p-6 sm:p-7">
        <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" aria-label={t('product.buy.aria')} className="btn btn-amber w-full">
          {t('product.buy')}
          <Arrow />
        </a>
        <p className="mt-3 text-xs text-muted">{t('product.buy.note')}</p>
      </div>
    </div>
  )
}

/** Barra de compra fixa no mobile, visivel quando o bilhete e o rodape estao fora do ecra. */
function BuyBar({ product, target }: { product: Product; target: React.RefObject<HTMLElement | null> }) {
  const { t, lang } = useI18n()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = target.current
    if (!el || !('IntersectionObserver' in window)) return
    const foot = document.querySelector('footer')
    let a = true
    let b = false
    const upd = () => setShow(!a && !b)
    const io1 = new IntersectionObserver(([e]) => {
      a = e.isIntersecting
      upd()
    })
    const io2 = new IntersectionObserver(([e]) => {
      b = e.isIntersecting
      upd()
    })
    io1.observe(el)
    if (foot) io2.observe(foot)
    return () => {
      io1.disconnect()
      io2.disconnect()
    }
  }, [target])
  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-paper px-5 py-3 transition-transform duration-300 ease-soft md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-4">
        <p className="leading-tight">
          <span className="block text-xl font-semibold">{formatCve(product.priceCve, lang)}</span>
          <span className="block text-xs text-muted">≈ {formatUsd(product.priceUsd, lang)} USD</span>
        </p>
        <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" aria-label={t('product.buy.aria')} className="btn btn-amber !min-h-11 !px-5">
          {t('product.buy')}
        </a>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { t, pick } = useI18n()
  const { state, reload } = useProduct(slug)
  const all = useProducts().state
  const ref = useReveal<HTMLDivElement>([state.status, slug])
  const ticketRef = useRef<HTMLDivElement>(null)

  const product = state.status === 'ready' ? state.data : null
  useEffect(() => {
    if (product) document.title = `${pick(product.name)} · noesis craft`
    return () => {
      document.title = 'noesis craft'
    }
  }, [product, pick])

  if (state.status === 'loading') return <DetailSkeleton />
  if (state.status === 'error')
    return (
      <div className="container-x py-20">
        <ErrorPanel onRetry={reload} />
      </div>
    )
  if (!product) return <NotFound product />

  const others = all.status === 'ready' ? all.data.filter((p) => p.id !== product.id).slice(0, 3) : []

  return (
    <div ref={ref}>
      <div className="container-x pt-6 md:pt-8">
        <Link to="/produtos" className="pencil-link inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold">
          <span aria-hidden="true">←</span> {t('product.back')}
        </Link>
      </div>

      <section className="container-x grid gap-x-16 gap-y-12 pb-20 pt-4 md:grid-cols-[1fr_1fr] md:pb-28 md:pt-8">
        <div className="rise order-2 md:order-none md:sticky md:top-28 md:self-start">
          <Gallery product={product} />
        </div>

        <div className="order-1 md:order-none">
          <div className="rise" style={{ ['--d' as string]: '100ms' }}>
            <p className="eyebrow">{pick(product.headline)}</p>
            <h1 className="mt-4 text-4xl sm:text-6xl">{pick(product.name)}</h1>
          </div>
          <div ref={ticketRef} className="rise" style={{ ['--d' as string]: '200ms' }}>
            <Ticket product={product} />
          </div>

          <div className="rise mt-12" style={{ ['--d' as string]: '300ms' }}>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{pick(product.description)}</p>

            {product.includes && product.includes.length > 0 && (
              <div className="sheet mt-10 p-6 sm:p-7">
                <h2 className="text-xl">{t('product.includes')}</h2>
                <ul className="mt-5 space-y-3.5">
                  {product.includes.map((it, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed">
                      <svg className="mt-1 shrink-0 text-craft-text" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M3 9.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" />
                      </svg>
                      {pick(it)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.details.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl">{t('product.details')}</h2>
                <dl className="mt-4 border-t-2 border-ink">
                  {product.details.map((d, i) => (
                    <div key={i} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/15 py-3.5 text-sm sm:grid-cols-[10rem_1fr]">
                      <dt className="font-semibold">{pick(d.label)}</dt>
                      <dd className="text-muted">{pick(d.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-ink/10 bg-paper-2 py-20">
          <div className="container-x">
            <h2 data-reveal className="text-3xl">
              {t('product.related')}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BuyBar product={product} target={ticketRef} />
    </div>
  )
}
