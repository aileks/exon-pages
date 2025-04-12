import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='bg-destructive/10 text-destructive border-destructive mx-64 mt-24 self-center rounded-lg border p-6'>
            <div className='mb-4 flex items-center'>
              <AlertTriangle className='mr-2 h-6 w-6' />

              <h2 className='text-lg font-semibold'>Something went wrong</h2>
            </div>

            <p className='mb-4 max-h-40 overflow-auto font-mono text-lg'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            <Button
              variant='outline'
              onClick={this.resetError}
            >
              Try again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
