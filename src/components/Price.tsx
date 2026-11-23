import type { Product } from '../data/types'
import { useI18n } from '../lib/i18n'
import { formatCve, formatUsd } from '../lib/format'

/** Preco em USD (cobrado) e CVE (referencia), sempre visiveis. */
export default function Price({ product, size = 'md', onInk = false }: { product: Product; size?: 'md' | 'lg'; onInk?: boolean }) {
  const { lang, t } = useI18n()
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className={`font-semibold tracking-tight ${size === 'lg' ? 'text-5xl' : 'text-2xl'}`}>
        {formatUsd(product.priceUsd, lang)}
        <span className="ml-1.5 text-sm font-normal tracking-normal">USD</span>
      </span>
      <span
        className={`inline-flex items-center px-2.5 py-1 font-semibold ${size === 'lg' ? 'text-base' : 'text-sm'} ${
          onInk ? 'bg-white/12 text-white' : 'bg-amber/25 text-ink'
        }`}
      >
        ≈ {formatCve(product.priceCve, lang)}
        <span className="sr-only"> ({t('price.ref')})</span>
      </span>
    </p>
  )
}
