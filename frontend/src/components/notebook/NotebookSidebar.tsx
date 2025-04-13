import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Book, Clock, FileText, FlaskConical, Star, Tag, Trash2 } from 'lucide-react';

interface NotebookSidebarProps {
  className?: string;
  onCreateNote?: () => void;
  onCreateExperiment?: () => void;
}

export default function NotebookSidebar({ className }: NotebookSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={cn('border-border bg-background flex h-full w-64 flex-shrink-0 flex-col border-r', className)}>
      <div className='border-border mx-2 flex items-center justify-between border-b p-4'>
        <h2 className='flex items-center text-lg font-medium'>
          <Book className='mr-2 h-5 w-5' />
          Workspace
        </h2>
      </div>

      <div className='flex-grow overflow-y-auto p-2'>
        {/* Quick Links */}
        <div className='mb-4 border-b px-2 py-1'>
          <Link
            to='/notebook'
            className={cn(
              'mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
              currentPath === '/notebook' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
            )}
          >
            <Book className='h-4 w-4' />
            All Notebooks
          </Link>
        </div>

        {/* Notes Section */}
        <div className='mb-4'>
          <p className='text-muted-foreground mb-2 px-2 text-xs font-semibold'>NOTES</p>

          <Link
            to='/notebook/notes'
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
              currentPath === '/notebook/notes' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
            )}
          >
            <FileText className='h-4 w-4' />
            All Notes
          </Link>

          <div className='mt-1 space-y-1 pl-4'>
            <Link
              to='/notebook/notes?filter=recent'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <Clock className='h-3 w-3' />
              Recent
            </Link>

            <Link
              to='/notebook/notes?filter=favorites'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <Star className='h-3 w-3' />
              Favorites
            </Link>

            <Link
              to='/notebook/notes?filter=tags'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <Tag className='h-3 w-3' />
              Tags
            </Link>
          </div>
        </div>

        <div className='mb-4'>
          <p className='text-muted-foreground mb-2 px-2 text-xs font-semibold'>EXPERIMENTS</p>

          <Link
            to='/notebook/experiments'
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
              currentPath === '/notebook/experiments' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
            )}
          >
            <FlaskConical className='h-4 w-4' />
            All Experiments
          </Link>

          <div className='mt-1 space-y-1 pl-4'>
            <Link
              to='/notebook/experiments?status=planned'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <span className='h-2 w-2 rounded-full bg-gray-400'></span>
              Planned
            </Link>

            <Link
              to='/notebook/experiments?status=in_progress'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <span className='h-2 w-2 rounded-full bg-blue-400'></span>
              In Progress
            </Link>

            <Link
              to='/notebook/experiments?status=completed'
              className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs'
            >
              <span className='h-2 w-2 rounded-full bg-green-400'></span>
              Completed
            </Link>
          </div>
        </div>

        <div className='border-t px-2 pt-2'>
          <Link
            to='/notebook/trash'
            className='text-muted-foreground hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm'
          >
            <Trash2 className='h-4 w-4' />
            Trash
          </Link>
        </div>
      </div>
    </div>
  );
}
