import type { Lang, Product, ProductImage } from '../data/types'

export function formatUsd(v: number, lang: Lang) {
  const n = new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : 'en-US', {
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(v)
  return `$${n}`
}

/** Escudos cabo-verdianos: "700 CVE". */
export function formatCve(v: number, lang: Lang) {
  return `${new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : 'en-US', { maximumFractionDigits: 0 }).format(v)} CVE`
}

/** Imagens do idioma atual (as que nao tem idioma servem para ambos). */
export function imagesFor(p: Product, lang: Lang): ProductImage[] {
  return p.images.filter((i) => !i.lang || i.lang === lang)
}

export function coverOf(p: Product, lang: Lang): ProductImage | undefined {
  const imgs = imagesFor(p, lang)
  return imgs.find((i) => i.kind === 'cover') ?? imgs[0]
}
