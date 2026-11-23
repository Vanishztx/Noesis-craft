import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, Localized } from '../data/types'

const dict = {
  'nav.home': { pt: 'Início', en: 'Home' },
  'nav.products': { pt: 'Produtos', en: 'Products' },
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.menu': { pt: 'Menu', en: 'Menu' },
  'nav.close': { pt: 'Fechar', en: 'Close' },
  'nav.main': { pt: 'Principal', en: 'Main' },
  'nav.footer': { pt: 'Rodapé', en: 'Footer' },
  'lang.pt': { pt: 'Português', en: 'Portuguese' },
  'lang.en': { pt: 'English', en: 'English' },
  'newtab': { pt: 'abre noutro separador', en: 'opens in a new tab' },
  'title.home': { pt: 'noesis craft · criação e design', en: 'noesis craft · creation and design' },
  'title.products': { pt: 'Produtos · noesis craft', en: 'Products · noesis craft' },
  'title.nf': { pt: 'Página não encontrada · noesis craft', en: 'Page not found · noesis craft' },
  'lang.label': { pt: 'Idioma', en: 'Language' },
  'skip': { pt: 'Saltar para o conteúdo', en: 'Skip to content' },

  'hero.eyebrow': { pt: 'criação e design', en: 'creation and design' },
  'hero.title.a': { pt: 'Coisas simples,', en: 'Simple things,' },
  'hero.title.b': { pt: 'desenhadas', en: 'drawn' },
  'hero.title.c': { pt: 'com cuidado.', en: 'with care.' },
  'hero.lead': {
    pt: 'A noesis craft cria produtos digitais com traço limpo e muito espaço para respirar. Escolhe, compra e descarrega em minutos.',
    en: 'noesis craft makes digital products with clean lines and room to breathe. Pick, buy and download in minutes.',
  },
  'hero.cta': { pt: 'Ver produtos', en: 'Browse products' },
  'hero.cta2': { pt: 'Conhecer a marca', en: 'About the brand' },
  'hero.badge': { pt: 'Novo', en: 'New' },

  'hero.chip.1': { pt: 'Download digital', en: 'Digital download' },
  'hero.chip.2': { pt: 'Imprime em casa', en: 'Print at home' },
  'hero.chip.3': { pt: 'Preço em USD e CVE', en: 'Prices in USD and CVE' },
  'hero.sheets': { pt: 'Folhas do livro em destaque', en: 'Featured book pages' },
  'product.prev': { pt: 'Imagem anterior', en: 'Previous image' },
  'product.next': { pt: 'Imagem seguinte', en: 'Next image' },
  'product.of': { pt: 'de', en: 'of' },
  'product.main': { pt: 'Em destaque', en: 'Featured' },
  'products.more': { pt: 'Mais da oficina', en: 'More from the workshop' },
  'footer.top': { pt: 'Voltar ao topo', en: 'Back to top' },
  'footer.made': { pt: 'Feito com cuidado em Cabo Verde', en: 'Made with care in Cape Verde' },
  'footer.seal': { pt: 'Selo NOESIS Cabo Verde', en: 'NOESIS Cape Verde seal' },
  'nav.menu.open': { pt: 'Abrir menu', en: 'Open menu' },
  'nav.menu.close': { pt: 'Fechar menu', en: 'Close menu' },

  'featured.eyebrow': { pt: 'em destaque', en: 'featured' },
  'featured.title': { pt: 'O mais recente da oficina', en: 'Latest from the workshop' },
  'featured.cta': { pt: 'Ver produto', en: 'View product' },
  'featured.all': { pt: 'Ver todos os produtos', en: 'See all products' },

  'how.eyebrow': { pt: 'como funciona', en: 'how it works' },
  'how.title': { pt: 'Três passos, sem complicar', en: 'Three steps, no fuss' },
  'how.1.t': { pt: 'Escolhe', en: 'Pick' },
  'how.1.d': { pt: 'Vê as páginas de exemplo e os detalhes de cada produto.', en: 'See the sample pages and the details of each product.' },
  'how.2.t': { pt: 'Compra', en: 'Buy' },
  'how.2.d': { pt: 'Pagamento seguro numa página de checkout própria.', en: 'Secure payment on a dedicated checkout page.' },
  'how.3.t': { pt: 'Descarrega', en: 'Download' },
  'how.3.d': { pt: 'Recebes os ficheiros digitais e imprimes em casa.', en: 'You get the digital files and print at home.' },

  'about.eyebrow': { pt: 'a marca', en: 'the brand' },
  'about.title': { pt: 'Feito à mão, pensado a régua', en: 'Handmade, ruler straight' },
  'about.p1': {
    pt: 'A noesis craft é a área de criação e design da NOESIS, um estúdio de Cabo Verde. Aqui nascem materiais criativos, a começar por livros de colorir.',
    en: 'noesis craft is the creation and design arm of NOESIS, a studio from Cape Verde. This is where creative materials are born, starting with coloring books.',
  },
  'about.p2': {
    pt: 'O símbolo guarda uma ponta de lápis: tudo começa num traço. Cada produto é desenhado com poucas linhas, formas claras e atenção ao detalhe.',
    en: 'The symbol carries a pencil tip: everything starts with a line. Each product is drawn with few lines, clear shapes and attention to detail.',
  },

  'products.eyebrow': { pt: 'loja', en: 'shop' },
  'products.title': { pt: 'Produtos', en: 'Products' },
  'products.lead': { pt: 'Tudo o que está publicado, pronto para descarregar.', en: 'Everything that is published, ready to download.' },
  'products.list': { pt: 'Lista de produtos', en: 'Product list' },
  'products.count.one': { pt: 'produto', en: 'product' },
  'products.count.other': { pt: 'produtos', en: 'products' },
  'products.empty.title': { pt: 'Ainda não há produtos publicados', en: 'No products published yet' },
  'products.empty.text': { pt: 'Estamos a preparar novidades. Volta daqui a pouco.', en: 'We are preparing something new. Check back soon.' },
  'state.loading': { pt: 'A carregar', en: 'Loading' },
  'state.error.title': { pt: 'Não foi possível carregar', en: 'Could not load' },
  'state.error.text': { pt: 'Verifica a ligação e tenta outra vez.', en: 'Check your connection and try again.' },
  'state.retry': { pt: 'Tentar outra vez', en: 'Try again' },

  'product.back': { pt: 'Todos os produtos', en: 'All products' },
  'product.buy': { pt: 'Comprar agora', en: 'Buy now' },
  'product.buy.note': { pt: 'Abre o checkout seguro noutra página.', en: 'Opens the secure checkout in a new tab.' },
  'product.includes': { pt: 'O que recebes', en: 'What you get' },
  'product.details': { pt: 'Detalhes', en: 'Details' },
  'product.preview': { pt: 'Páginas de exemplo', en: 'Sample pages' },
  'product.preview.hint': { pt: 'Escolhe uma miniatura para ver maior.', en: 'Choose a thumbnail to enlarge.' },
  'product.buy.aria': { pt: 'Comprar agora (abre noutro separador)', en: 'Buy now (opens in a new tab)' },
  'product.image': { pt: 'Imagem', en: 'Image' },
  'product.related': { pt: 'Mais produtos', en: 'More products' },
  'product.view': { pt: 'Ver detalhes', en: 'View details' },
  'price.ref': { pt: 'referência', en: 'reference' },
  'price.about': { pt: 'aprox.', en: 'approx.' },

  'nf.title': { pt: 'Página não encontrada', en: 'Page not found' },
  'nf.text': { pt: 'O endereço não existe ou já não está disponível.', en: 'The address does not exist or is no longer available.' },
  'nf.product.title': { pt: 'Produto não encontrado', en: 'Product not found' },
  'nf.product.text': { pt: 'Este produto não existe ou já não está publicado.', en: 'This product does not exist or is no longer published.' },
  'nf.cta': { pt: 'Ver os produtos', en: 'Browse the products' },
  'nf.home': { pt: 'Voltar ao início', en: 'Back to home' },

  'footer.tag': { pt: 'Criação e design, por NOESIS', en: 'Creation and design, by NOESIS' },
  'footer.shop': { pt: 'Loja', en: 'Shop' },
  'footer.rights': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
  'footer.store': { pt: 'Página da loja', en: 'Store page' },
} satisfies Record<string, Localized>

export type Key = keyof typeof dict

type I18n = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: Key) => string
  /** Escolhe o texto do idioma atual a partir de um campo { pt, en }. */
  pick: (l: Localized) => string
}

const Ctx = createContext<I18n | null>(null)
const STORAGE = 'noesis-craft-lang'

function initialLang(): Lang {
  try {
    const s = localStorage.getItem(STORAGE)
    if (s === 'pt' || s === 'en') return s
  } catch {
    /* ignore */
  }
  return 'pt'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE, l)
    } catch {
      /* ignore */
    }
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const value = useMemo<I18n>(
    () => ({ lang, setLang, t: (k) => dict[k][lang], pick: (l) => l[lang] }),
    [lang, setLang],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useI18n precisa de <I18nProvider>')
  return c
}
