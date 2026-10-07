import { Component } from 'react';

// Si algo falla al dibujar la página, muestra un aviso en lugar de dejarla en blanco.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error en la app:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ maxWidth: 560, margin: '12vh auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '1.4rem' }}>Algo salió mal</h1>
        <p>Recargá la página. Si el problema sigue, avisame.</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', opacity: 0.7 }}>
          {String(this.state.error?.message || this.state.error)}
        </pre>
      </div>
    );
  }
}
