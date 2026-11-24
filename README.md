# noesis craft

Site da marca noesis craft (criação e design da NOESIS). Vite + React + TypeScript + Tailwind v4 + react-router. Só layout e front-end visual: sem Whop, sem chaves, sem checkout próprio.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build, saída em dist/
```

Rotas: `/` (Home), `/produtos` (lista), `/produtos/:slug` (detalhe), `/infantil` (livros infantis por idade e tema), `/planners` e `/templates` ("Em breve" com captura de e-mail por mailto), `*` (404). Preço principal em CVE, com o valor em USD (moeda do checkout) ao lado. O `npm run build` copia `dist/index.html` para `dist/404.html` (links diretos em hosts estáticos). Idioma PT por defeito, seletor PT/EN no topo (guardado em localStorage).

## Identidade

Tinta `#14131E`, âmbar `#F2B63F`, verde craft `#4E8B78` (só áreas pequenas), branco. Tipografia Sora (Semibold títulos, Regular texto), instalada via `@fontsource-variable/sora`. Logos em `public/logos/`. Animações respeitam `prefers-reduced-motion`.

## Contrato de dados

Tudo o que é produto passa por `src/data/`:

| Ficheiro | Papel |
|---|---|
| `types.ts` | Tipo `Product` (o contrato) |
| `products.ts` | Dados mock (Cozy Friends) |
| `api.ts` | `fetchProducts()`: único ponto de ligação à fonte real |
| `useProducts.tsx` | `ProductsProvider`, `useProducts()`, `useProduct(slug)` devolvem `loading / error / ready` |

Lista, detalhe, página inicial e rodapé só leem destes hooks. Um produto novo (com `status: "published"`) aparece na lista, na Home e ganha a sua página `/produtos/<slug>` sem tocar no layout. Estados de loading, vazio, erro (com "tentar outra vez") e 404 de produto já existem.

```ts
type Localized = { pt: string; en: string }

type Product = {
  id: string
  slug: string                       // usado em /produtos/:slug, único
  name: Localized
  headline: Localized                // ex.: "Coloring book, 38 pages" / "Livro de colorir, 38 páginas"
  description: Localized
  priceUsd: number                   // preço cobrado
  priceCve: number                   // referência em escudos (aprox.)
  currency: { primary: 'USD'; reference: 'CVE'; note?: Localized }
  images: {                          // capa + páginas de exemplo / mockups
    src: string; alt: Localized
    kind: 'cover' | 'page' | 'mockup'
    lang?: 'pt' | 'en'               // opcional: imagem só para um idioma
  }[]
  details: { label: Localized; value: Localized }[]   // formato, nº de páginas, idiomas, tipo de ficheiro...
  includes?: Localized[]             // "o que recebes"
  checkoutUrl: string                // botão "Comprar agora" abre isto
  storeUrl?: string
  publishedAt: string                // ISO 8601; ordena do mais recente
  status: 'published' | 'draft' | 'archived'   // só "published" aparece
}
```

Configuração (`.env`, ver `.env.example`):

- `VITE_PRODUCTS_URL`: se definido, `fetchProducts()` faz GET e espera `Product[]` (ou `{ "products": Product[] }`). Vazio = mocks.
- `VITE_CONTACT_EMAIL`: destino do formulário "Em breve" (por defeito noesisteaches@gmail.com).
- `VITE_STORE_URL`: página da loja (link no rodapé).
- `VITE_CHECKOUT_URL_OVERRIDE`: força um checkout para todos os produtos (só testes).

## O que o agente da Whop precisa de ligar

1. **Fonte de dados**: um endpoint JSON (ou função serverless/backend) com os produtos da Whop, e pô-lo em `VITE_PRODUCTS_URL`, ou reescrever o corpo de `fetchProducts()` em `src/data/api.ts` (mesma assinatura). A API da Whop exige chave: deve ficar no servidor, nunca no front-end.
2. **Mapeamento de campos**: Whop product/plan para `Product` (nome, descrição, preço, imagens, slug, estado). A Whop não tem PT/EN nativos: decidir de onde vêm os textos nos dois idiomas (descrição estruturada, metadados ou tabela própria). `priceCve` é calculado/definido por nós.
3. **Checkout**: `checkoutUrl` = link do plano (ex.: `https://whop.com/checkout/plan_X6M6DRk7JCP9Y`).
4. **Atualização**: quando o dono publicar/despublicar na Whop, a lista tem de refletir. Opções: webhook da Whop que regenera o JSON, ou endpoint que consulta a Whop com cache curto. O front carrega a lista ao abrir o site.
5. **Imagens**: hoje estão em `public/products/<slug>/` (capas e 4 páginas de exemplo, PT e EN). Para produtos novos, `src` pode ser URL absoluta (CDN da Whop ou outra).
6. **SPA em produção**: o host precisa de fallback para `index.html` (rotas `/produtos/...`).
