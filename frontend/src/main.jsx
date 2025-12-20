import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/theme-context';
import ClickSpark from './components/ClickSpark';
import { BrowserRouter } from 'react-router-dom';
import Context from './Context';

createRoot(document.getElementById('root')).render(<StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {/* <ClickSpark> */}
          <Context>
            <App />
          </Context>
        {/* </ClickSpark> */}

      </ThemeProvider>

    </BrowserRouter>

  </StrictMode>);
