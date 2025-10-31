import React from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You could send this to monitoring if needed.
    console.error('App crashed with error:', error, info);
  }

  handleReload = () => {
    // Hard reload to recover from transient failures when returning to preview.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 p-6">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-lg font-semibold">Ocorreu um erro</h1>
            <p className="text-sm text-slate-400">O aplicativo encontrou um problema ao renderizar. Você pode recarregar para continuar.</p>
            <button onClick={this.handleReload} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Recarregar app</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}