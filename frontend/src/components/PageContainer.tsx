import React from 'react';
import { cn } from '@/lib/utils';

type PageVariant = 'default' | 'centered' | 'narrow';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: PageVariant;
}

const variantClasses: Record<PageVariant, string> = {
  default: 'container mx-auto px-4 py-8',
  centered: 'container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4',
  narrow: 'container mx-auto max-w-2xl px-4 py-8',
};

export default function PageContainer({ children, className, variant = 'default' }: PageContainerProps) {
  return <div className={cn(variantClasses[variant], className)}>{children}</div>;
}
