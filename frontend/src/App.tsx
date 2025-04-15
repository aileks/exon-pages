import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Layout from './components/Layout';
import { ErrorBoundary } from './ErrorBoundary';
import Loading from '@/components/Loading';
import { useAuth } from '@/services/auth';

function App() {
  const { getCurrentUser, isLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      getCurrentUser().finally(() => {
        setInitialized(true);
      });
    }
  }, [initialized, getCurrentUser]);

  if (!initialized && isLoading) {
    return (
      <Loading
        fullScreen
        size='lg'
      />
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
