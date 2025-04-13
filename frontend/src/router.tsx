import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy } from 'react';
import App from './App';
import NotFoundPage from './pages/NotFoundPage.tsx';

const HomeContainer = lazy(() => import('./components/HomeContainer'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotebookPage = lazy(() => import('./pages/NotebookPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));

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
        element: <NotesPage />,
      },
      {
        path: '/notebook/experiments',
        element: <ExperimentsPage />,
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
