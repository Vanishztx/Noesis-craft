import type { Product, ProductImage } from './types'

const base = '/products/cozy-friends'

function pagePair(slug: string, pt: string, en: string): ProductImage[] {
  return [
    { src: `${base}/page-${slug}-pt.jpg`, alt: { pt, en }, kind: 'page', lang: 'pt' },
    { src: `${base}/page-${slug}-en.jpg`, alt: { pt, en }, kind: 'page', lang: 'en' },
  ]
}

/** Dados mock no formato esperado. Substituidos pela fonte real (Whop) via VITE_PRODUCTS_URL ou em src/data/api.ts. */
export const mockProducts: Product[] = [
  {
    id: 'prod_cozy_friends',
    slug: 'cozy-friends',
    name: { pt: 'Cozy Friends', en: 'Cozy Friends' },
    headline: {
      pt: 'Livro de colorir, 38 páginas',
      en: 'Coloring book, 38 pages',
    },
    description: {
      pt: 'Cinco amigos, um dia inteiro de brincadeiras e 38 páginas para colorir ao teu ritmo. Linhas limpas, cenas acolhedoras e muito espaço para cores. Recebes o livro completo em português e em inglês, pronto para imprimir em casa.',
      en: 'Five friends, one whole day of play and 38 pages to color at your own pace. Clean lines, cozy scenes and plenty of room for color. You get the full book in Portuguese and in English, ready to print at home.',
    },
    priceUsd: 7,
    priceCve: 700,
    currency: {
      primary: 'USD',
      reference: 'CVE',
      note: {
        pt: 'O valor em escudos é uma referência aproximada. A cobrança é feita em dólares.',
        en: 'The escudo amount is an approximate reference. You are charged in US dollars.',
      },
    },
    images: [
      { src: `${base}/cover-pt.jpg`, alt: { pt: 'Capa do livro Cozy Friends em português', en: 'Cozy Friends cover in Portuguese' }, kind: 'cover', lang: 'pt' },
      { src: `${base}/cover-en.jpg`, alt: { pt: 'Capa do livro Cozy Friends em inglês', en: 'Cozy Friends cover in English' }, kind: 'cover', lang: 'en' },
      ...pagePair('blocos', 'Página de exemplo: amigos a brincar com blocos', 'Sample page: friends playing with blocks'),
      ...pagePair('praia', 'Página de exemplo: dia de praia com castelo de areia', 'Sample page: beach day with a sandcastle'),
      ...pagePair('jardim', 'Página de exemplo: jardim de flores', 'Sample page: flower garden'),
      ...pagePair('escola', 'Página de exemplo: dia de escola', 'Sample page: school day'),
    ],
    details: [
      { label: { pt: 'Formato', en: 'Format' }, value: { pt: 'Livro de colorir digital', en: 'Digital coloring book' } },
      { label: { pt: 'Páginas', en: 'Pages' }, value: { pt: '38 por idioma', en: '38 per language' } },
      { label: { pt: 'Idiomas', en: 'Languages' }, value: { pt: 'Português e inglês', en: 'Portuguese and English' } },
      { label: { pt: 'Tipo de ficheiro', en: 'File type' }, value: { pt: 'PDF', en: 'PDF' } },
      { label: { pt: 'Entrega', en: 'Delivery' }, value: { pt: 'Download digital, sem envio físico', en: 'Digital download, no physical shipping' } },
    ],
    includes: [
      { pt: 'Livro completo em português (38 páginas)', en: 'Full book in Portuguese (38 pages)' },
      { pt: 'Livro completo em inglês (38 páginas)', en: 'Full book in English (38 pages)' },
      { pt: 'Para imprimir em casa quantas vezes quiseres', en: 'Print at home as many times as you like' },
    ],
    category: 'infantil',
    ageRange: ['3-4', '5-6', '7+'],
    theme: 'artes',
    checkoutUrl: 'https://whop.com/checkout/plan_X6M6DRk7JCP9Y',
    storeUrl: 'https://whop.com/noesis-craft/cozy-friends-craft/',
    publishedAt: '2026-11-14T00:00:00Z',
    status: 'published',
  },
]
