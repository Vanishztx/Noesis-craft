import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { I18nProvider } from './lib/i18n'
import { ProductsProvider } from './data/useProducts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ProductsProvider>
          <App />
        </ProductsProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
