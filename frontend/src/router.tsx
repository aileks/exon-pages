import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy } from 'react';
import App from './App';
import NotFoundPage from './pages/NotFoundPage.tsx';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HomeContainer = lazy(() => import('./components/HomeContainer'));
const NotebookPage = lazy(() => import('./pages/NotebookPage'));

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
      {
        path: '/notebook',
        element: <NotebookPage />,
      },
      {
        path: '/notebook/notes',
        element: <NotebookPage />,
      },
      {
        path: '/notebook/experiments',
        element: <NotebookPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
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
