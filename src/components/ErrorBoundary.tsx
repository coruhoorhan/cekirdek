import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const serializeError = (error: Error | null): string => {
  if (!error) return 'Bilinmeyen hata';

  // Production'da stack trace'i gizle
  if (import.meta.env.PROD) {
    return error.message || 'Bir hata oluştu';
  }

  return `${error.message}\n\nStack Trace:\n${error.stack || 'Stack trace mevcut değil'}`;
};

const generateErrorId = (): string => {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error logging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo
    });

    // Custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    // this.logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  goHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 text-red-600 rounded-full p-3">
                  <AlertTriangle size={32} />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Bir Hata Oluştu
              </CardTitle>
              <CardDescription className="text-gray-600">
                Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Hata ID:</strong> {this.state.errorId}
                </p>
                {!import.meta.env.PROD && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Teknik Detaylar (Geliştirici Modu)
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {serializeError(this.state.error)}
                      {this.state.errorInfo && (
                        <>
                          {'\n\nComponent Stack:'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.resetError}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <RefreshCw size={16} />
                  Tekrar Dene
                </Button>
                <Button
                  onClick={this.goHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  Ana Sayfaya Dön
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Sorun devam ederse, lütfen sistem yöneticisi ile iletişime geçin.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}