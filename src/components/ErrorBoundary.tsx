import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <Alert className="border-red-500 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                <div className="space-y-2">
                  <div className="font-semibold">Something went wrong!</div>
                  <div className="text-sm text-gray-300">
                    Error: {this.state.error?.message || 'Unknown error'}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Check the browser console for more details.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="btn-netflix w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                variant="secondary"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
