import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy } from 'react';
import App from './App';
import NotFoundPage from './pages/NotFoundPage.tsx';

const HomeContainer = lazy(() => import('./pages/HomeContainer'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeContainer />,
      },
      {
        path: '/login',
        element: <AuthPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
