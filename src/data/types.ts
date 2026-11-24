/**
 * Contrato de dados dos produtos.
 * O agente da Whop deve devolver objetos neste formato (ver README, secao "Contrato de dados").
 */
export type Lang = 'pt' | 'en'

/** Texto nos dois idiomas. */
export type Localized = { pt: string; en: string }

/** Area da loja. Sem valor = loja geral. */
export type ProductCategory = 'infantil' | 'planners' | 'templates'
/** Faixas etarias da area Infantil. */
export type AgeRange = '3-4' | '5-6' | '7+'
/** Temas da area Infantil. */
export type InfantilTheme = 'alfabetizacao' | 'numeros' | 'descobertas' | 'artes' | 'datas'

export type ProductStatus = 'published' | 'draft' | 'archived'

export type ProductImage = {
  /** URL absoluta ou caminho em /public. */
  src: string
  alt: Localized
  /** cover = capa; page = pagina de exemplo; mockup = foto de apresentacao. */
  kind: 'cover' | 'page' | 'mockup'
  /** Se a imagem so serve para um idioma (ex.: capa PT). Sem valor = serve para ambos. */
  lang?: Lang
}

export type ProductDetail = {
  label: Localized
  value: Localized
}

export type CurrencyInfo = {
  /** Moeda do preco principal cobrado no checkout. */
  primary: 'USD'
  /** Moeda de referencia mostrada ao cliente (valor aproximado). */
  reference: 'CVE'
  note?: Localized
}

export type Product = {
  id: string
  slug: string
  name: Localized
  headline: Localized
  description: Localized
  priceUsd: number
  /** Valor de referencia em escudos cabo-verdianos. */
  priceCve: number
  currency: CurrencyInfo
  images: ProductImage[]
  details: ProductDetail[]
  /** Pontos curtos do que vem incluido. */
  includes?: Localized[]
  /** Link de checkout (Whop). */
  checkoutUrl: string
  /** Pagina do produto na Whop (opcional). */
  storeUrl?: string
  /** Opcional: area da loja (ex.: 'infantil'). */
  category?: ProductCategory
  /** Opcional (infantil): idades recomendadas. */
  ageRange?: AgeRange[]
  /** Opcional (infantil): tema principal. */
  theme?: InfantilTheme
  /** ISO 8601. */
  publishedAt: string
  status: ProductStatus
}

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; data: T }
