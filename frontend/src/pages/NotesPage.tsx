import { useEffect, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import NotesList from '@/components/notebook/NotesList';
import NoteEditor from '@/components/notebook/NoteEditor';
import Loading from '@/components/Loading';
import { Note } from '@/lib/notebookApi';
import { useNotebookStore } from '@/store';
import { Button } from '@/components/ui/button.tsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '@/lib/utils.ts';

interface NotesPageProps {
  sidebarMode?: boolean;
}

export default function NotesPage({ sidebarMode = false }: NotesPageProps) {
  const { notes, currentNote, isLoadingNotes, fetchNotes, createNote, updateNote, deleteNote, setCurrentNote } =
    useNotebookStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setCurrentNote(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleSaveNote = async (data: { title: string; content: string; tags: string[] }) => {
    try {
      if (isCreating) {
        await createNote(data);
        setIsCreating(false);
      } else if (currentNote) {
        await updateNote(currentNote.id, data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!currentNote) return;

    try {
      await deleteNote(currentNote.id);
      setCurrentNote(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  if (isLoadingNotes && notes.length === 0) {
    return <Loading />;
  }

  const content = (
    <>
      <h1 className='mb-6 text-3xl font-bold'>Research Notes</h1>

      <div className='grid h-[calc(100vh-12rem)] grid-cols-4 gap-6'>
        <div className='border-border rounded-lg border p-4'>
          <NotesList
            notes={notes}
            selectedNoteId={currentNote?.id}
            onSelect={handleSelectNote}
            onCreateNew={handleCreateNew}
          />
        </div>

        <div className='border-border col-span-3 rounded-lg border p-4'>
          {isCreating ?
            <NoteEditor
              note={null}
              isNew={true}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
          : isEditing && currentNote ?
            <NoteEditor
              note={currentNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onCancel={handleCancelEdit}
            />
          : currentNote ?
            <div className='flex h-full flex-col'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{currentNote.title}</h2>

                <Button
                  variant='link'
                  className='text-primary hover:text-primary/80 h-auto p-0'
                  onClick={handleEditNote}
                >
                  Edit
                </Button>
              </div>

              <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {htmlToMarkdown(currentNote.content)}
                </ReactMarkdown>
              </div>

              {currentNote.tags && currentNote.tags.length > 0 && (
                <div className='mt-4'>
                  <h3 className='mb-2 text-sm font-medium'>Tags</h3>

                  <div className='flex flex-wrap gap-2'>
                    {currentNote.tags.map(tag => (
                      <span
                        key={tag}
                        className='bg-primary/10 text-primary rounded-full px-2 py-1 text-xs'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          : <div className='text-muted-foreground flex h-full items-center justify-center'>
              <p>Select a note or create a new one to get started</p>
            </div>
          }
        </div>
      </div>
    </>
  );

  return sidebarMode ?
      <div className='w-full'>{content}</div>
    : <PageContainer>
        <div className='w-full'>{content}</div>
      </PageContainer>;
}
