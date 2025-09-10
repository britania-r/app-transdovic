// src/main.tsx (VERSIÓN DE PRUEBA #2)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Importamos SOLO lo de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Creamos una instancia del cliente
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos nuestro mensaje de éxito con el QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', color: 'black', backgroundColor: 'lightblue', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
        ¡React Query funciona!
      </div>
    </QueryClientProvider>
  </React.StrictMode>
);