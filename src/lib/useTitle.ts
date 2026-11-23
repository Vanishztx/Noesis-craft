import { useEffect } from 'react'

/** Titulo do documento por rota. */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
