import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Layout from './components/Layout';
import { ErrorBoundary } from './ErrorBoundary';
import useAuthStore from '@/store/useAuthStore';

function App() {
  const { getUser } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      getUser().finally(() => {
        setInitialized(true);
      });
    }
  }, [initialized, getUser]);

  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
