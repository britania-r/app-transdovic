// src/components/ErrorBoundary.tsx

import React, { Component } from 'react';
// ¡CORRECCIÓN! Usamos 'type' para importar tipos específicos.
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // Esta es la pantalla de error que verás en tu teléfono
      return (
        <div style={{ padding: '20px', color: 'black', backgroundColor: 'white', height: '100vh', fontFamily: 'monospace', overflow: 'auto' }}>
          <h1 style={{ color: '#b00020' }}>Error en la Aplicación</h1>
          <p>La aplicación ha encontrado un problema y no puede continuar.</p>
          <hr />
          <h3 style={{ color: '#b00020' }}>Detalles del Error:</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error?.toString()}
          </pre>
          <h3 style={{ color: '#b00020' }}>Component Stack:</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;