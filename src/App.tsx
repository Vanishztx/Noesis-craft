import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Infantil from './pages/Infantil'
import EmBreve from './pages/EmBreve'
import NotFound from './pages/NotFound'
import { useI18n } from './lib/i18n'

/** Navegacao SPA: volta ao topo (ou a ancora) e leva o foco para o conteudo (leitores de ecra e teclado). */
function RouteFocus() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    const target = hash ? document.querySelector(hash) : null
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
    if (first.current) {
      first.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { t } = useI18n()
  return (
    <PageTransition>
      <a
        href="#main"
        className="absolute left-2 top-2 z-[100] -translate-y-20 bg-amber px-4 py-2 font-semibold text-ink focus:translate-y-0"
      >
        {t('skip')}
      </a>
      <RouteFocus />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:slug" element={<ProductDetail />} />
          <Route path="/infantil" element={<Infantil />} />
          <Route path="/planners" element={<EmBreve which="planners" />} />
          <Route path="/templates" element={<EmBreve which="templates" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </PageTransition>
  )
}
