import { useI18n } from '../lib/i18n'
import { SOON } from '../data/infantil'
import { useReveal } from '../lib/useReveal'
import { useTitle } from '../lib/useTitle'
import EmailCapture from '../components/EmailCapture'
import Torn from '../components/Torn'

/** Aba futura: "Em breve" + captura de e-mail. Usada por /planners e /templates. */
export default function EmBreve({ which }: { which: 'planners' | 'templates' }) {
  const { t, pick } = useI18n()
  const info = SOON[which]
  useTitle(`${pick(info.name)} · ${t('soon.badge')} · noesis craft`)
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref}>
      <section className="bg-paper-2">
        <div className="container-x py-14 md:py-24">
          <p className="eyebrow rise">{t('soon.badge')}</p>
          <h1 className="rise mt-4 text-5xl sm:text-6xl" style={{ ['--d' as string]: '100ms' }}>
            {pick(info.name)}
          </h1>
          <p className="rise mt-5 max-w-xl text-lg text-muted" style={{ ['--d' as string]: '200ms' }}>
            {pick(info.lead)}
          </p>
          <ul className="rise mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: '300ms' }}>
            {info.items.map((i) => (
              <li key={i.pt} className="chip chip-quiet bg-white text-sm normal-case tracking-normal">
                {pick(i)}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="text-paper-2">
        <Torn flip className="-mb-px" />
      </div>
      <section className="container-x pb-24 pt-10 md:pb-32">
        <div data-reveal className="sheet fold max-w-2xl p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">{t('soon.title')}</h2>
          <p className="mb-6 mt-3 text-muted">{t('soon.text')}</p>
          <EmailCapture topic={pick(info.name)} />
        </div>
      </section>
    </div>
  )
}
