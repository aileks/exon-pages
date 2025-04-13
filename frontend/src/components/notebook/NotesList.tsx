import { useEffect, useState } from 'react';
import { Note } from '@/lib/notebookApi';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils.ts';

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelect: (note: Note) => void;
  onCreateNew: () => void;
}

export default function NotesList({ notes, selectedNoteId, onSelect, onCreateNew }: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
    );

    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='relative flex-grow'>
          <Search className='text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search notes...'
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
        {filteredNotes.length === 0 ?
          <div className='text-muted-foreground flex h-32 items-center justify-center'>No notes found</div>
        : <ul className='space-y-2'>
            {filteredNotes.map(note => (
              <li key={note.id}>
                <Button
                  variant='ghost'
                  className={cn(
                    'border-border hover:bg-accent h-auto w-full justify-start rounded-md border p-3 text-left transition-colors',
                    selectedNoteId === note.id && 'bg-accent'
                  )}
                  onClick={() => onSelect(note)}
                >
                  <div className='w-full text-left'>
                    <h3 className='line-clamp-1 font-medium'>{note.title}</h3>
                    <div className='text-muted-foreground mt-1 text-xs'>
                      <span>Updated {formatDistanceToNow(new Date(note.updated_at))} ago</span>
                      {note.tags && note.tags.length > 0 && (
                        <div className='mt-1 flex flex-wrap gap-1'>
                          {note.tags.map(tag => (
                            <span
                              key={tag}
                              className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
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
