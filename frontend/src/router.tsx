import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy } from 'react';
import App from './App';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <AuthPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
