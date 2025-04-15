import { useEffect } from 'react';
import { useAuth } from '@/services/auth';
import Loading from '@/components/Loading.tsx';
import LandingPage from '../pages/LandingPage.tsx';
import HomePage from '../pages/HomePage.tsx';

export default function HomeContainer() {
  const { getCurrentUser, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
