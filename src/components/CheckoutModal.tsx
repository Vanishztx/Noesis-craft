import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../lib/i18n'
import type { Product } from '../data/types'
import { coverOf, formatCve, formatUsd } from '../lib/format'

const CheckoutEmbed = lazy(() => import('./CheckoutEmbed'))

/** Extrai o id do plano (plan_…) do link de checkout. */
export function planIdOf(url: string): string | null {
  return url.match(/plan_[A-Za-z0-9]+/)?.[0] ?? null
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])'

export default function CheckoutModal({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { t, lang, pick } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [, setReadyState] = useState(false)
  const readyRef = useRef(false)
  const setReady = (v: boolean) => {
    readyRef.current = v
    setReadyState(v)
  }
  const plan = planIdOf(product.checkoutUrl)
  const cover = coverOf(product, lang)
  const tab = product.category === 'infantil' ? '#8FD0E8' : '#F2B63F'
  const onFail = useCallback(() => setFailed(true), [])

  useEffect(() => {
    if (!open) return
    setFailed(false)
    setReady(false)
    const prev = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const oldOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab' && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
        if (els.length === 0) return
        const first = els[0]
        const last = els[els.length - 1]
        const act = document.activeElement
        if (!dialogRef.current.contains(act)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && act === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && act === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    // se o SDK externo não responder a tempo, mostra a alternativa
    const timer = window.setTimeout(() => {
      if (!readyRef.current) setFailed(true)
    }, 20000)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
      html.style.overflow = oldOverflow
      prev?.focus?.()
    }
  }, [open, onClose])

  // o iframe da Whop não expõe "ready"; marca como pronto quando aparece conteúdo no contentor
  useEffect(() => {
    if (!open || failed) return
    const el = dialogRef.current?.querySelector('.co-embed')
    if (!el) return
    const mo = new MutationObserver(() => {
      if (el.querySelector('iframe, [data-whop-elements], form')) setReady(true)
    })
    mo.observe(el, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [open, failed])

  if (!open) return null

  return (
    <div
      className="co-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="co-title"
        className="co-dialog"
        style={{ ['--co-shadow' as string]: tab }}
      >
        <span className="tape -top-3 left-10 rotate-[-4deg]" aria-hidden="true" />
        <header className="co-head">
          {cover && <img src={cover.src} alt="" width={56} height={75} className="co-thumb" />}
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{t('checkout.eyebrow')}</p>
            <h2 id="co-title" className="truncate text-xl sm:text-2xl">
              {pick(product.name)}
            </h2>
            <p className="mt-0.5 leading-tight">
              <span className="text-lg font-semibold">{formatCve(product.priceCve, lang)}</span>{' '}
              <span className="text-xs text-muted">≈ {formatUsd(product.priceUsd, lang)} USD</span>
            </p>
          </div>
          <button type="button" data-autofocus className="round-btn shrink-0" onClick={onClose} aria-label={t('checkout.close')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </header>

        <div className="co-body">
          {plan && !failed ? (
            <Boundary onError={onFail}>
              <Suspense fallback={<p className="co-loading" role="status">{t('checkout.loading')}</p>}>
                <div className="co-embed">
                  <CheckoutEmbed plan={plan} locale={lang} loadingLabel={t('checkout.loading')} onFail={onFail} />
                </div>
              </Suspense>
            </Boundary>
          ) : (
            <div className="co-fallback" role="alert">
              <p className="font-semibold">{t('checkout.fail.title')}</p>
              <p className="mt-1 text-sm text-muted">{t('checkout.fail.text')}</p>
              <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-amber mt-4">
                {t('checkout.alt')}
              </a>
            </div>
          )}
        </div>

        <footer className="co-foot">
          <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" className="pencil-link text-sm font-semibold">
            {t('checkout.alt')} <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </div>
    </div>
  )
}
