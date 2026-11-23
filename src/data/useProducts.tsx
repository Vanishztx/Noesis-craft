import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fetchProducts } from './api'
import type { LoadState, Product } from './types'

type Ctx = { state: LoadState<Product[]>; reload: () => void }
const ProductsContext = createContext<Ctx | null>(null)

/** Carrega os produtos uma vez e partilha entre lista e detalhe. */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState<Product[]>>({ status: 'loading' })
  const ctrl = useRef<AbortController | null>(null)

  const load = useCallback(() => {
    ctrl.current?.abort()
    const c = new AbortController()
    ctrl.current = c
    setState({ status: 'loading' })
    fetchProducts(c.signal)
      .then((data) => !c.signal.aborted && setState({ status: 'ready', data }))
      .catch((e) => !c.signal.aborted && setState({ status: 'error', error: e instanceof Error ? e : new Error(String(e)) }))
  }, [])

  useEffect(() => {
    load()
    return () => ctrl.current?.abort()
  }, [load])

  const value = useMemo(() => ({ state, reload: load }), [state, load])
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

function useCtx() {
  const c = useContext(ProductsContext)
  if (!c) throw new Error('useProducts precisa de <ProductsProvider>')
  return c
}

/** Lista de produtos publicados: { state: loading | error | ready(data), reload }. */
export function useProducts() {
  return useCtx()
}

/** Um produto pelo slug. data = null quando nao existe (404). */
export function useProduct(slug: string | undefined): { state: LoadState<Product | null>; reload: () => void } {
  const { state, reload } = useCtx()
  if (state.status !== 'ready') return { state, reload }
  return { state: { status: 'ready', data: state.data.find((p) => p.slug === slug) ?? null }, reload }
}
