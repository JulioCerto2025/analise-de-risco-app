import React, { Component } from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };
type ErrorBoundaryProps = React.PropsWithChildren<{ variant?: 'fullscreen' | 'inline'; onReset?: () => void }>;

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  declare state: Readonly<ErrorBoundaryState>;
  declare setState: Component<ErrorBoundaryProps, ErrorBoundaryState>["setState"];
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You could send this to monitoring if needed.
    if (import.meta.env.DEV) {
      console.error('App crashed with error:', error, info);
    }
  }

  handleReload = () => {
    // Hard reload to recover from transient failures when returning to preview.
    window.location.reload();
  };

  handleClearStorageAndReload = () => {
    try {
      // Limpa apenas a chave de dados da análise para evitar perda de outra configuração
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('spda-analysis-data');
      }
    } catch (_) {
      // silencioso
    }
    this.handleReload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) this.props.onReset();
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Se os filhos mudarem (por exemplo, troca de etapa), limpe o erro automaticamente.
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.variant === 'inline') {
        return (
          <div className="p-4 rounded-lg border border-slate-600 bg-slate-800 text-slate-200">
            <div className="flex items-start gap-3">
              <div className="text-red-400 font-bold">!</div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">Falha ao renderizar esta seção</h2>
                <p className="text-xs text-slate-400">Tente novamente. Se persistir, mude de etapa ou recarregue.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={this.handleReset} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs">Tentar novamente</button>
                  <button onClick={this.handleReload} className="px-3 py-1.5 rounded border border-slate-500 text-slate-200 text-xs">Recarregar app</button>
                </div>
                {this.state.error && (
                  <div className="mt-3 rounded border border-slate-700 bg-slate-900/60 p-2">
                    <p className="text-xs text-slate-300"><span className="font-semibold">Erro:</span> {this.state.error.message}</p>
                    {this.state.error.stack && (
                      <pre className="mt-2 text-[10px] whitespace-pre-wrap text-slate-400">{this.state.error.stack}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 p-6">
          <div className="max-w-2xl w-full space-y-4">
            <h1 className="text-lg font-semibold text-center">Ocorreu um erro</h1>
            <p className="text-sm text-slate-400 text-center">O aplicativo encontrou um problema ao renderizar. Você pode recarregar para continuar.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={this.handleReload} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Recarregar app</button>
              <button onClick={this.handleClearStorageAndReload} className="px-4 py-2 rounded border border-slate-500 text-slate-200">Limpar dados salvos e recarregar</button>
            </div>
            {this.state.error && (
              <div className="mt-4 rounded border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-300"><span className="font-semibold">Erro:</span> {this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="mt-2 text-[10px] whitespace-pre-wrap text-slate-400">{this.state.error.stack}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
