// src/main.tsx (VERSIÓN DE PRUEBA SÚPER SIMPLE)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// No importamos NADA más. Ni App, ni Contexts, ni Providers.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '20px', color: 'black', backgroundColor: 'lightgreen', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
      ¡El motor de React funciona!
    </div>
  </React.StrictMode>
);