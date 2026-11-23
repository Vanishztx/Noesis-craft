// Gera products.json de teste (so para verificar a grelha). Nao entra no build.
const base = '/products/cozy-friends'
const cozy = require('fs').existsSync('x') ? null : null
const img = (l) => [
  { src: `${base}/cover-${l}.jpg`, alt: { pt: 'Capa', en: 'Cover' }, kind: 'cover', lang: l },
  { src: `${base}/page-praia-${l}.jpg`, alt: { pt: 'Pagina de exemplo', en: 'Sample page' }, kind: 'page', lang: l },
]
const mk = (n, name, date, status = 'published') => ({
  id: 'p' + n, slug: 'teste-' + n,
  name: { pt: name.pt, en: name.en },
  headline: { pt: 'Livro de colorir, 38 páginas', en: 'Coloring book, 38 pages' },
  description: { pt: 'Descrição de teste.', en: 'Test description.' },
  priceUsd: 7, priceCve: 700,
  currency: { primary: 'USD', reference: 'CVE' },
  images: [...img('pt'), ...img('en')],
  details: [{ label: { pt: 'Formato', en: 'Format' }, value: { pt: 'PDF', en: 'PDF' } }],
  checkoutUrl: 'https://example.invalid/checkout/' + n,
  publishedAt: date, status,
})
const long = 'Livro de colorir muito longo para testar o corte de duas linhas no título do cartão de produto'
const all = [
  mk(1, { pt: 'Cozy Friends Teste', en: 'Cozy Friends Test' }, '2026-11-14T00:00:00Z'),
  mk(2, { pt: long.slice(0, 80), en: long.slice(0, 80) }, '2026-11-15T00:00:00Z'),
  mk(3, { pt: 'Animais da Quinta', en: 'Farm Animals' }, '2026-11-16T00:00:00Z'),
  mk(4, { pt: 'Produto Novo Publicado Depois', en: 'New Product Published Later' }, '2026-11-20T00:00:00Z'),
  mk(5, { pt: 'Rascunho', en: 'Draft (must not show)' }, '2026-11-21T00:00:00Z', 'draft'),
]
const n = Number(process.argv[2] || 3)
require('fs').writeFileSync(__dirname + '/products.json', JSON.stringify(all.slice(0, n), null, 2))
