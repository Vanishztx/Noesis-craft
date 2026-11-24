import { useState } from 'react'
import { loadWhop } from '@whop/elements'
import { Checkout, CheckoutElement, WhopElements } from '@whop/elements-react'

/** Checkout da Whop embebido. Carregado a pedido (lazy) para não pesar no bundle inicial. */
export default function CheckoutEmbed({
  plan,
  locale,
  loadingLabel,
  onFail,
}: {
  plan: string
  locale: 'pt' | 'en'
  loadingLabel: string
  onFail: () => void
}) {
  // carrega o SDK uma só vez por montagem
  const [sdk] = useState(() => loadWhop())
  return (
    <WhopElements elements={sdk} onLoadError={() => onFail()}>
      <Checkout
        plan={plan}
        locale={locale === 'pt' ? ('pt' as never) : ('en' as never)}
        returnUrl={typeof window !== 'undefined' ? window.location.href : undefined}
        fallback={<p className="co-loading">{loadingLabel}</p>}
      >
        <CheckoutElement />
      </Checkout>
    </WhopElements>
  )
}
