import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Layout from './components/Layout';
import { ErrorBoundary } from './ErrorBoundary';
import useAuthStore from '@/store/useAuthStore';
import Loading from '@/components/Loading';

function App() {
  const { getUser, isLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      getUser().finally(() => {
        setInitialized(true);
      });
    }
  }, [initialized, getUser]);

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
