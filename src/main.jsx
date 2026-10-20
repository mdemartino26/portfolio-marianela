import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './app.jsx';
import { LanguageProvider } from './context/language-context.jsx';
import './styles/variables.css';
import './styles/global.css';

// Animate on scroll: each element with data-aos="..." animates once when it enters the screen.
AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
