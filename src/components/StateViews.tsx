import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'

export function LoadingGrid({ count = 3, wide = false }: { count?: number; wide?: boolean }) {
  const { t } = useI18n()
  return (
    <div role="status" aria-live="polite" className={wide ? 'grid gap-6' : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
      <span className="sr-only">{t('state.loading')}</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sheet" aria-hidden="true">
          <div className="bg-paper-2 p-4 sm:p-5">
            <div className="skeleton aspect-[3/4]" />
          </div>
          <div className="space-y-3 p-5">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-6 w-2/3" />
            <div className="skeleton h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Folhas vazias empilhadas, para estados sem conteudo. */
function EmptySheets() {
  return (
    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true" className="mx-auto mb-6">
      <rect x="16" y="14" width="60" height="76" fill="#fff" stroke="#14131e" strokeOpacity=".3" transform="rotate(-8 46 52)" />
      <rect x="44" y="10" width="60" height="76" fill="#fff" stroke="#14131e" strokeOpacity=".3" transform="rotate(7 74 48)" />
      <rect x="30" y="8" width="60" height="76" fill="#fff" stroke="#14131e" strokeWidth="2" />
      <path d="M42 30h36M42 42h36M42 54h22" stroke="#14131e" strokeOpacity=".25" strokeWidth="2" />
      <circle cx="94" cy="20" r="7" fill="#F2B63F" />
    </svg>
  )
}

export function Panel({ title, text, children, tone = 'default' }: { title: string; text: string; children?: ReactNode; tone?: 'default' | 'error' }) {
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className="sheet mx-auto max-w-2xl px-6 py-14 text-center">
      {tone === 'error' ? <span aria-hidden="true" className="mx-auto mb-5 block h-3 w-3 rounded-full bg-ink" /> : <EmptySheets />}
      <h2 className="text-2xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">{text}</p>
      {children && <div className="mt-7 flex justify-center">{children}</div>}
    </div>
  )
}

export function ErrorPanel({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return (
    <Panel tone="error" title={t('state.error.title')} text={t('state.error.text')}>
      <button type="button" className="btn" onClick={onRetry}>
        {t('state.retry')}
      </button>
    </Panel>
  )
}

export function EmptyPanel() {
  const { t } = useI18n()
  return <Panel title={t('products.empty.title')} text={t('products.empty.text')} />
}

export function BackHome() {
  const { t } = useI18n()
  return (
    <Link to="/" className="btn">
      {t('nf.home')}
    </Link>
  )
}
