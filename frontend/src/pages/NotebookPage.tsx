import { useLocation } from 'react-router';
import PageContainer from '@/components/PageContainer';
import NotebookSidebar from '@/components/notebook/NotebookSidebar';
import NotesPage from './NotesPage';
import ExperimentsPage from './ExperimentsPage';

export default function NotebookPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    if (currentPath === '/notebook/notes') {
      return <NotesPage sidebarMode={true} />;
    } else if (currentPath === '/notebook/experiments') {
      return <ExperimentsPage sidebarMode={true} />;
    } else {
      return (
        <div className='flex h-full items-center justify-center'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold'>Welcome to your Notebook</h2>

            <p className='text-muted-foreground mb-6'>
              Select a section from the sidebar to get started, or create a new note or experiment.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <PageContainer className='p-0'>
      <div className='flex h-[calc(100vh-4rem)]'>
        <NotebookSidebar />
        <div className='flex-1 overflow-auto p-4'>{renderContent()}</div>
      </div>
    </PageContainer>
  );
}
