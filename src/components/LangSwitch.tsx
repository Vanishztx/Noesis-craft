import { useI18n } from '../lib/i18n'
import type { Lang } from '../data/types'

export default function LangSwitch({ onInk = false }: { onInk?: boolean }) {
  const { lang, setLang, t } = useI18n()
  const opts: Lang[] = ['pt', 'en']
  return (
    <div role="group" aria-label={t('lang.label')} data-lang={lang} className={`lang-switch ${onInk ? 'on-ink-switch' : ''}`}>
      <span className="thumb" aria-hidden="true" />
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          lang={o}
          aria-label={`${o.toUpperCase()}, ${t(o === 'pt' ? 'lang.pt' : 'lang.en')}`}
          aria-pressed={lang === o}
          onClick={() => setLang(o)}
          className={`relative z-10 h-10 min-w-11 px-2.5 text-xs font-semibold uppercase tracking-widest ${
            lang === o ? 'text-ink' : onInk ? 'text-white' : 'text-ink/70 hover:text-ink'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
