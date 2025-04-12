import React, { Suspense } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { Link } from 'react-router';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isLoading } = useAuthStore();
  console.log('User response:', user);
  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <header className='border-border border-b'>
        <nav className='container mx-auto flex items-center justify-between px-4 py-3'>
          <Link
            to='/'
            className='text-primary text-xl font-bold'
          >
            Exon Pages
          </Link>

          <div>
            {isLoading ?
              <Loading size='sm' />
            : user ?
              <div className='flex items-center gap-4'>
                <span className='text-foreground'>Welcome, {user?.username}</span>

                <Button
                  onClick={() => logout()}
                  className=''
                  variant='destructive'
                >
                  Log Out
                </Button>
              </div>
            : <div className='space-x-4'>
                <Link
                  to='/login'
                  className='bg-primary text-primary-foreground rounded px-4 py-2 transition-opacity hover:opacity-90'
                >
                  Login
                </Link>
              </div>
            }
          </div>
        </nav>
      </header>

      <main className='flex-grow'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
}
