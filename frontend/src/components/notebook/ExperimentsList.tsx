import { useEffect, useState } from 'react';
import { Experiment } from '@/lib/notebookApi';
import { Button } from '@/components/ui/button';
import { FlaskConical, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExperimentsListProps {
  experiments: Experiment[];
  selectedExperimentId?: string;
  onSelect: (experiment: Experiment) => void;
  onCreateNew: () => void;
}

export default function ExperimentsList({
  experiments,
  selectedExperimentId,
  onSelect,
  onCreateNew,
}: ExperimentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExperiments(experiments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiments.filter(
      experiment =>
        experiment.title.toLowerCase().includes(query) ||
        experiment.hypothesis.toLowerCase().includes(query) ||
        (experiment.methods && experiment.methods.toLowerCase().includes(query))
    );

    setFilteredExperiments(filtered);
  }, [searchQuery, experiments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-gray-300 dark:bg-gray-600';
      case 'in_progress':
        return 'bg-blue-400 dark:bg-blue-600';
      case 'completed':
        return 'bg-green-400 dark:bg-green-600';
      case 'failed':
        return 'bg-red-400 dark:bg-red-600';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='relative flex-grow'>
          <Search className='text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2' />

          <Input
            placeholder='Search experiments...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
        <Button
          onClick={onCreateNew}
          size='sm'
        >
          <Plus className='mr-1 h-4 w-4' />
          New
        </Button>
      </div>

      <div className='scrollbar-thin h-full flex-grow overflow-y-auto pb-4'>
        {filteredExperiments.length === 0 ?
          <div className='text-muted-foreground flex h-32 items-center justify-center'>No experiments found</div>
        : <ul className='space-y-3'>
            {filteredExperiments.map(experiment => (
              <li key={experiment.id}>
                <Button
                  variant='ghost'
                  className={cn(
                    'border-border hover:bg-accent h-auto w-full justify-start rounded-md border p-3 text-left transition-colors hover:text-white',
                    selectedExperimentId === experiment.id && 'bg-muted'
                  )}
                  onClick={() => onSelect(experiment)}
                >
                  <div className='w-full text-left'>
                    <div className='flex items-center justify-between'>
                      <h3 className='line-clamp-1 font-medium'>{experiment.title}</h3>

                      <div className='flex items-center'>
                        <span
                          className={cn('ml-2 inline-block h-2 w-2 rounded-full', getStatusColor(experiment.status))}
                        ></span>

                        <span className='text-muted-foreground ml-1 text-xs'>{formatStatus(experiment.status)}</span>
                      </div>
                    </div>

                    <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>{experiment.hypothesis}</p>

                    <div className='text-muted-foreground mt-2 flex items-center text-xs'>
                      <FlaskConical className='mr-1 h-3 w-3' />

                      <span>
                        {experiment.status === 'planned' ?
                          'Created '
                        : experiment.status === 'completed' ?
                          'Completed '
                        : 'Updated '}
                        {formatDistanceToNow(
                          new Date(
                            experiment.status === 'completed' ?
                              experiment.completed_at || experiment.updated_at
                            : experiment.updated_at
                          )
                        )}{' '}
                        ago
                      </span>
                    </div>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
}
