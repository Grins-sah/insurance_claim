import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/theme-context.tsx'
import ClickSpark from './components/ClickSpark.tsx'
import { BrowserRouter } from 'react-router-dom'
import Context from './Context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ClickSpark>
          
          <Context>
              <App />
          </Context>
          
        </ClickSpark>

      </ThemeProvider>

    </BrowserRouter>

  </StrictMode>,
)
