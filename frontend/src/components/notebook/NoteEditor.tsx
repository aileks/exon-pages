import { useEffect, useState } from 'react';
import { Note } from '@/lib/notebookApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TextEditor from './TextEditor';
import { Save, Trash2, X } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  isNew?: boolean;
  onSave: (note: { title: string; content: string; tags: string[] }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function NoteEditor({ note, isNew = false, onSave, onDelete, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      // Show error that title is required
      return;
    }

    onSave({
      title: title.trim(),
      content,
      tags,
    });
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>{isNew ? 'New Note' : 'Edit Note'}</h2>
        <div className='flex gap-2'>
          {!isNew && onDelete && (
            <Button
              variant='destructive'
              size='sm'
              onClick={onDelete}
            >
              <Trash2 className='mr-1 h-4 w-4' />
              Delete
            </Button>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
          >
            <X className='mr-1 h-4 w-4' />
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleSave}
          >
            <Save className='mr-1 h-4 w-4' />
            Save
          </Button>
        </div>
      </div>

      <div className='flex-grow space-y-4 overflow-auto pb-4'>
        <div>
          <label
            htmlFor='title'
            className='text-foreground mb-1 block text-sm font-medium'
          >
            Title
          </label>
          <Input
            id='title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Note title'
            className='w-full'
          />
        </div>

        <div>
          <label className='text-foreground mb-1 block text-sm font-medium'>Content</label>
          <TextEditor
            value={content}
            onChange={setContent}
            className='min-h-[300px]'
          />
        </div>

        <div>
          <label className='text-foreground mb-1 block text-sm font-medium'>Tags</label>
          <div className='mb-2 flex flex-wrap gap-2'>
            {tags.map(tag => (
              <div
                key={tag}
                className='bg-secondary/20 text-secondary flex items-center rounded-full px-3 py-1 text-sm'
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className='hover:bg-secondary/20 ml-2 rounded-full p-1'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            ))}
          </div>
          <div className='flex'>
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Add a tag'
              className='flex-grow'
            />
            <Button
              type='button'
              variant='secondary'
              className='ml-2'
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
