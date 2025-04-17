import { useAuth } from '@/services/auth';
import Loading from '@/components/Loading.tsx';
import LandingPage from '../pages/LandingPage.tsx';
import HomePage from '../pages/HomePage.tsx';

export default function HomeContainer() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
