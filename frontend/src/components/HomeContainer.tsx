import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import Loading from '@/components/Loading.tsx';
import LandingPage from '../pages/LandingPage.tsx';
import HomePage from '../pages/HomePage.tsx';

export default function HomeContainer() {
  const { isAuthenticated, getUser, isLoading } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
