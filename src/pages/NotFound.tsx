import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useProducts } from '../data/useProducts'
import { useTitle } from '../lib/useTitle'

export default function NotFound({ product = false }: { product?: boolean }) {
  const { t, pick } = useI18n()
  const { state } = useProducts()
  useTitle(product ? `${t('nf.product.title')} · noesis craft` : t('title.nf'))
  const first = state.status === 'ready' ? state.data[0] : undefined

  return (
    <div className="container-x py-20 md:py-28">
      <p className="text-8xl font-semibold leading-none text-amber sm:text-9xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-6 max-w-xl text-4xl sm:text-5xl">{product ? t('nf.product.title') : t('nf.title')}</h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{product ? t('nf.product.text') : t('nf.text')}</p>
      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {first ? (
          <Link to={`/produtos/${first.slug}`} className="btn w-full sm:w-auto">
            {pick(first.name)}
          </Link>
        ) : (
          <Link to="/produtos" className="btn w-full sm:w-auto">
            {t('nf.cta')}
          </Link>
        )}
        <Link to="/" className="btn btn-ghost w-full sm:w-auto">
          {t('nf.home')}
        </Link>
      </div>
    </div>
  )
}
