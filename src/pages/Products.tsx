import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'
import Torn from '../components/Torn'
import { EmptyPanel, ErrorPanel, LoadingGrid } from '../components/StateViews'

export default function Products() {
  const { t } = useI18n()
  useTitle(t('title.products'))
  const { state, reload } = useProducts()
  const ref = useReveal<HTMLDivElement>([state.status])
  const count = state.status === 'ready' ? state.data.length : 0
  const [main, ...rest] = state.status === 'ready' ? state.data : []

  return (
    <div ref={ref}>
      <section className="relative">
        <div className="bg-paper-2"><div className="container-x py-14 text-ink md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <p className="eyebrow rise">{t('products.eyebrow')}</p>
              <h1 className="rise mt-4 text-5xl sm:text-6xl" style={{ ['--d' as string]: '100ms' }}>
                {t('products.title')}
              </h1>
              <p className="rise mt-5 max-w-lg text-lg text-muted" style={{ ['--d' as string]: '200ms' }}>
                {t('products.lead')}
              </p>
            </div>
            {count > 0 && (
              <p className="rise chip chip-quiet bg-white text-sm normal-case tracking-normal" style={{ ['--d' as string]: '300ms' }} aria-live="polite">
                {count} {count === 1 ? t('products.count.one') : t('products.count.other')}
              </p>
            )}
          </div>
        </div></div>
        <div className="text-paper-2">
          <Torn flip className="-mb-px" />
        </div>
      </section>

      <section className="container-x pb-24 pt-10 md:pb-32 md:pt-14" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <LoadingGrid />}
        {state.status === 'error' && <ErrorPanel onRetry={reload} />}
        {state.status === 'ready' && count === 0 && <EmptyPanel />}
        {main && (
          <>
            <h2 className="sr-only">{t('products.list')}</h2>
            <div className="mb-3 flex items-center gap-3">
              <span className="chip">{t('product.main')}</span>
            </div>
            <ProductCard product={main} wide />
            {rest.length > 0 && (
              <>
                <h2 data-reveal className="mb-8 mt-20 text-2xl sm:text-3xl">
                  {t('products.more')}
                </h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <div key={p.id} className="lg:[&:nth-child(3n+2)]:mt-10">
                      <ProductCard product={p} delay={(i % 3) * 90} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}
