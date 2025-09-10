// src/main.tsx (VERSIÓN FINAL Y FUNCIONAL)

// --- ¡LA SOLUCIÓN MÁGICA ESTÁ AQUÍ! ---
// Este polyfill debe importarse al principio para que Supabase funcione en Capacitor.
import 'react-native-url-polyfill/auto';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// --- Volvemos a poner todos nuestros Providers ---
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';

// Creamos la instancia del cliente de React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Mantenemos el ErrorBoundary por si acaso, es una buena práctica */}
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);