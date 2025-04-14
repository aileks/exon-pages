import { cn } from '@/lib/utils';

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ fullScreen = false, className, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const containerClass =
    fullScreen ?
      'fixed inset-0 z-50 flex items-center justify-center overflow-clip bg-background/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-6 overflow-clip';

  return (
    <div className={cn(containerClass, className)}>
      <div className={cn('border-primary animate-spin rounded-full border-b-2 border-t-2', sizeClasses[size])}></div>
    </div>
  );
}

export default Loading;
