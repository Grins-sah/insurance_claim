import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/theme-context';
import ClickSpark from './components/ClickSpark';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(<StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ClickSpark>
          <App />
        </ClickSpark>

      </ThemeProvider>

    </BrowserRouter>

  </StrictMode>);
