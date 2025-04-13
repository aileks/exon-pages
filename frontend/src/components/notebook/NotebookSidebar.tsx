import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Book, ChevronDown, Clock, FileText, FlaskConical, PlusCircle, Star, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NotebookSidebarProps {
  className?: string;
  onCreateNote?: () => void;
  onCreateExperiment?: () => void;
}

export default function NotebookSidebar({ className, onCreateNote, onCreateExperiment }: NotebookSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={cn('border-border bg-background flex h-full w-64 flex-shrink-0 flex-col border-r', className)}>
      <div className='border-border flex items-center justify-between border-b p-4'>
        <h2 className='flex items-center text-lg font-medium'>
          <Book className='mr-2 h-5 w-5' />
          Workspace
        </h2>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-sm'
        >
          <PlusCircle className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex-grow overflow-y-auto p-2'>
        {/* Quick Links */}
        <div className='mb-2 px-2 py-1'>
          <Link
            to='/notebook'
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
              currentPath === '/notebook' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
            )}
          >
            <Book className='h-4 w-4' />
            All Notebooks
          </Link>
        </div>

        <Separator className='my-2' />

        {/* Notes Section */}
        <div className='mb-4'>
          <div className='text-muted-foreground mb-2 flex items-center justify-between px-2 text-xs font-medium'>
            <span className='flex items-center'>
              <ChevronDown className='mr-1 h-3 w-3' />
              NOTES
            </span>

            {onCreateNote && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onCreateNote}
                className='h-5 w-5 rounded-sm p-0'
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            )}
          </div>

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
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <Clock className='h-3 w-3' />
              Recent
            </Link>

            <Link
              to='/notebook/notes?filter=favorites'
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <Star className='h-3 w-3' />
              Favorites
            </Link>

            <Link
              to='/notebook/notes?filter=tags'
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <Tag className='h-3 w-3' />
              Tags
            </Link>
          </div>
        </div>

        {/* Experiments Section */}
        <div className='mb-4'>
          <div className='text-muted-foreground mb-2 flex items-center justify-between px-2 text-xs font-medium'>
            <span className='flex items-center'>
              <ChevronDown className='mr-1 h-3 w-3' />
              EXPERIMENTS
            </span>

            {onCreateExperiment && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onCreateExperiment}
                className='h-5 w-5 rounded-sm p-0'
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            )}
          </div>

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
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <span className='h-2 w-2 rounded-full bg-gray-400'></span>
              Planned
            </Link>

            <Link
              to='/notebook/experiments?status=in_progress'
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <span className='h-2 w-2 rounded-full bg-blue-400'></span>
              In Progress
            </Link>

            <Link
              to='/notebook/experiments?status=completed'
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs',
                'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <span className='h-2 w-2 rounded-full bg-green-400'></span>
              Completed
            </Link>
          </div>
        </div>

        <Separator className='my-2' />

        <div className='px-2 py-1'>
          <Link
            to='/notebook/trash'
            className={cn(
              'text-muted-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
              'hover:bg-accent/50'
            )}
          >
            <Trash2 className='h-4 w-4' />
            Trash
          </Link>
        </div>
      </div>
    </div>
  );
}
