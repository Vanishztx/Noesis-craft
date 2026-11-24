import type { AgeRange, InfantilTheme, Localized } from './types'

export const AGES: { id: AgeRange; label: Localized }[] = [
  { id: '3-4', label: { pt: '3 a 4 anos', en: 'Ages 3 to 4' } },
  { id: '5-6', label: { pt: '5 a 6 anos', en: 'Ages 5 to 6' } },
  { id: '7+', label: { pt: '7 anos ou mais', en: 'Ages 7 and up' } },
]

export type ThemeInfo = {
  id: InfantilTheme
  name: Localized
  blurb: Localized
  /** Simbolo grande do cartao (texto curto, decorativo). */
  glyph: string
  /** Cor do recorte de papel (classe em index.css). */
  tone: 'sky' | 'coral' | 'mint' | 'lilac' | 'amber'
  topics: { label: Localized; ages: AgeRange[] }[]
}

/** Mapa de temas do Infantil. So descreve o que vem aí; produtos reais vêm de products.ts. */
export const THEMES: ThemeInfo[] = [
  {
    id: 'alfabetizacao',
    name: { pt: 'Alfabetização', en: 'Early literacy' },
    blurb: {
      pt: 'Do primeiro a, e, i, o, u até à letra bonita: aprender a ler e a escrever a brincar.',
      en: 'From the first vowels to neat handwriting: learning to read and write through play.',
    },
    glyph: 'Aa',
    tone: 'sky',
    topics: [
      { label: { pt: 'Vogais', en: 'Vowels' }, ages: ['3-4', '5-6'] },
      { label: { pt: 'Consoantes', en: 'Consonants' }, ages: ['5-6'] },
      { label: { pt: 'Sílabas', en: 'Syllables' }, ages: ['5-6', '7+'] },
      { label: { pt: 'Caligrafia', en: 'Handwriting' }, ages: ['5-6', '7+'] },
    ],
  },
  {
    id: 'numeros',
    name: { pt: 'Números', en: 'Numbers' },
    blurb: {
      pt: 'Contar, juntar e reconhecer números com desenhos para colorir e riscar.',
      en: 'Counting, adding and recognising numbers with pages to color and trace.',
    },
    glyph: '123',
    tone: 'coral',
    topics: [
      { label: { pt: 'Contar até 10', en: 'Counting to 10' }, ages: ['3-4'] },
      { label: { pt: 'Contar até 100', en: 'Counting to 100' }, ages: ['5-6'] },
      { label: { pt: 'Somar e subtrair', en: 'Adding and subtracting' }, ages: ['5-6', '7+'] },
    ],
  },
  {
    id: 'descobertas',
    name: { pt: 'Descobertas', en: 'Discoveries' },
    blurb: {
      pt: 'Ciências para curiosos: o mar, as plantas, o corpo e os animais de Cabo Verde.',
      en: 'Science for curious minds: the sea, plants, the body and the animals of Cape Verde.',
    },
    glyph: '?!',
    tone: 'mint',
    topics: [
      { label: { pt: 'O mar e a praia', en: 'The sea and the beach' }, ages: ['3-4', '5-6'] },
      { label: { pt: 'Plantas e jardim', en: 'Plants and garden' }, ages: ['5-6'] },
      { label: { pt: 'O corpo humano', en: 'The human body' }, ages: ['7+'] },
    ],
  },
  {
    id: 'artes',
    name: { pt: 'Artes', en: 'Arts' },
    blurb: {
      pt: 'Colorir, desenhar e inventar. Aqui já vive o Cozy Friends.',
      en: 'Color, draw and invent. Cozy Friends already lives here.',
    },
    glyph: 'Ab',
    tone: 'amber',
    topics: [
      { label: { pt: 'Livros de colorir', en: 'Coloring books' }, ages: ['3-4', '5-6', '7+'] },
      { label: { pt: 'Desenho guiado', en: 'Guided drawing' }, ages: ['5-6', '7+'] },
    ],
  },
  {
    id: 'datas',
    name: { pt: 'Datas', en: 'Special dates' },
    blurb: {
      pt: 'Histórias e cores das datas de Cabo Verde: 5 de Julho, Dia da Criança, a morna e a Cesária Évora.',
      en: 'Stories and colors for Cape Verde dates: 5 July, Children’s Day, morna and Cesária Évora.',
    },
    glyph: '5/7',
    tone: 'lilac',
    topics: [
      { label: { pt: '5 de Julho', en: '5 July' }, ages: ['5-6', '7+'] },
      { label: { pt: 'Dia da Criança', en: 'Children’s Day' }, ages: ['3-4', '5-6', '7+'] },
      { label: { pt: 'Morna e Cesária Évora', en: 'Morna and Cesária Évora' }, ages: ['5-6', '7+'] },
    ],
  },
]

export type SoonInfo = {
  slug: 'planners' | 'templates'
  name: Localized
  lead: Localized
  items: Localized[]
}

/** Abas futuras: so descrevem o que vem. Sem precos nem produtos. */
export const SOON: Record<'planners' | 'templates', SoonInfo> = {
  planners: {
    slug: 'planners',
    name: { pt: 'Planners', en: 'Planners' },
    lead: {
      pt: 'Planners para imprimir: semana, estudo e hábitos, com o mesmo traço limpo da noesis craft.',
      en: 'Printable planners: week, study and habits, with the same clean noesis craft line.',
    },
    items: [
      { pt: 'Planner semanal', en: 'Weekly planner' },
      { pt: 'Planner de estudo', en: 'Study planner' },
      { pt: 'Registo de hábitos', en: 'Habit tracker' },
    ],
  },
  templates: {
    slug: 'templates',
    name: { pt: 'Templates (Canva e Notion)', en: 'Templates (Canva and Notion)' },
    lead: {
      pt: 'Modelos prontos a editar no Canva e no Notion, para quem quer organizar ou apresentar sem começar do zero.',
      en: 'Ready-to-edit Canva and Notion templates, for organizing or presenting without starting from scratch.',
    },
    items: [
      { pt: 'Templates de Canva', en: 'Canva templates' },
      { pt: 'Templates de Notion', en: 'Notion templates' },
    ],
  },
}
