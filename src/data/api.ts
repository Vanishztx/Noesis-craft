import { mockProducts } from './products'
import type { Product } from './types'

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL as string | undefined
const CHECKOUT_OVERRIDE = import.meta.env.VITE_CHECKOUT_URL_OVERRIDE as string | undefined

/**
 * Ponto unico de ligacao a fonte de dados.
 * - Sem VITE_PRODUCTS_URL: devolve os mocks.
 * - Com VITE_PRODUCTS_URL: faz GET e espera Product[] (ou { products: Product[] }).
 * O agente da Whop pode tambem substituir o corpo desta funcao, mantendo a assinatura.
 */
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  let raw: Product[]
  if (PRODUCTS_URL) {
    const res = await fetch(PRODUCTS_URL, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Falha ao carregar produtos (${res.status})`)
    const json = await res.json()
    raw = Array.isArray(json) ? json : json.products
    if (!Array.isArray(raw)) throw new Error('Resposta invalida: esperava uma lista de produtos')
  } else {
    await new Promise((r) => setTimeout(r, 350))
    raw = mockProducts
  }
  return raw
    .filter((p) => p.status === 'published')
    .map((p) => (CHECKOUT_OVERRIDE ? { ...p, checkoutUrl: CHECKOUT_OVERRIDE } : p))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}
