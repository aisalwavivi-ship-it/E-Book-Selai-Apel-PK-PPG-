import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-200 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-xl text-red-950">
              Terjadi Kesalahan Tampilan
            </h2>
            <p className="text-xs text-red-800 leading-relaxed">
              Aplikasi mengalami kendala teknis saat memuat komponen. Silakan muat ulang halaman untuk memulihkan tampilan.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
