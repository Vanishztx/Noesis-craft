import { useId, useState, type FormEvent } from 'react'
import { useI18n } from '../lib/i18n'

/** E-mail que recebe os pedidos de aviso. Definido por VITE_CONTACT_EMAIL (sem backend por agora). */
const CONTACT = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || 'noesisteaches@gmail.com'
const STORE = 'noesis-craft-notify'

/** Captura simples sem backend: abre um e-mail (mailto) se houver destino configurado; guarda sempre no dispositivo. */
export default function EmailCapture({ topic, kids = false }: { topic: string; kids?: boolean }) {
  const { t } = useI18n()
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sent' | 'saved' | 'invalid'>('idle')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setState('invalid')
      return
    }
    try {
      const list = JSON.parse(localStorage.getItem(STORE) ?? '[]') as { email: string; topic: string }[]
      list.push({ email: v, topic })
      localStorage.setItem(STORE, JSON.stringify(list))
    } catch {
      /* ignore */
    }
    if (CONTACT) {
      const subject = encodeURIComponent(`Avisar-me: ${topic}`)
      const body = encodeURIComponent(`Quero ser avisado(a) quando "${topic}" abrir.\nO meu e-mail: ${v}`)
      window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`
      setState('sent')
    } else {
      setState('saved')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <label htmlFor={id} className="block text-sm font-semibold">
        {t('soon.form.label')}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state !== 'idle') setState('idle')
          }}
          aria-invalid={state === 'invalid'}
          aria-describedby={`${id}-msg`}
          placeholder={t('soon.form.placeholder')}
          className={`min-h-12 w-full flex-1 border-2 border-ink bg-white px-4 text-base ${kids ? 'rounded-2xl' : ''}`}
        />
        <button type="submit" className={`btn btn-amber ${kids ? 'btn-kid' : ''}`}>
          {t('soon.form.cta')}
        </button>
      </div>
      <p id={`${id}-msg`} role="status" className="mt-2 min-h-5 text-sm text-muted">
        {state === 'invalid' && t('soon.form.invalid')}
        {state === 'sent' && t('soon.form.sent')}
        {state === 'saved' && t('soon.form.saved')}
      </p>
    </form>
  )
}
