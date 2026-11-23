import { Link } from 'react-router-dom'
import type { Product } from '../data/types'
import { useI18n } from '../lib/i18n'
import { coverOf } from '../lib/format'
import Price from './Price'

export function isNewProduct(p: Product) {
  return Date.now() - new Date(p.publishedAt).getTime() < 30 * 24 * 3600 * 1000
}

function Go() {
  return (
    <span className="card-go" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M2 9h13M10 3l6 6-6 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  )
}

/** Cartao de produto. "wide" = destaque horizontal com capa grande e descricao. */
export default function ProductCard({
  product,
  delay = 0,
  wide = false,
  onInk = false,
}: {
  product: Product
  delay?: number
  wide?: boolean
  onInk?: boolean
}) {
  const { lang, pick, t } = useI18n()
  const cover = coverOf(product, lang)
  const isNew = isNewProduct(product)
  return (
    <article
      data-reveal
      style={{ ['--d' as string]: `${delay}ms`, ['--fold-bg' as string]: onInk ? '#14131e' : undefined }}
      className={`product-card sheet fold group flex flex-col ${wide ? 'md:flex-row' : ''}`}
    >
      <span className="tape" aria-hidden="true" />
      <div className={`bg-paper-2 p-4 sm:p-5 ${wide ? 'md:w-[46%] md:shrink-0 md:p-8' : 'pb-0 sm:pb-0'}`}>
        <div className="card-cover relative aspect-[3/4] overflow-hidden border border-ink/15 bg-white">
          {cover ? (
            <img src={cover.src} alt={pick(cover.alt)} loading="lazy" width={900} height={1200} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-muted">{pick(product.name)}</div>
          )}
          {isNew && <span className="chip absolute left-0 top-3">{t('hero.badge')}</span>}
        </div>
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-5 ${wide ? 'md:justify-center md:p-10' : 'sm:p-6'}`}>
        <p className="eyebrow">{pick(product.headline)}</p>
        <h3 className={wide ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}>
          <Link to={`/produtos/${product.slug}`} className="inline-flex min-h-11 items-center after:absolute after:inset-0">
            <span className="line-clamp-2">{pick(product.name)}</span>
          </Link>
        </h3>
        {wide && <p className="line-clamp-4 max-w-md leading-relaxed text-muted">{pick(product.description)}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price product={product} size={wide ? 'lg' : 'md'} />
          <Go />
        </div>
        <span className="sr-only">{t('product.view')}</span>
      </div>
    </article>
  )
}
