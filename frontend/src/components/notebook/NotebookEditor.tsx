import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { cn, htmlToMarkdown } from '@/lib/utils';
import { Edit, Eye } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  readOnly?: boolean;
}

export default function NotebookEditor({
  value,
  onChange,
  placeholder = 'Start typing here... Use Markdown syntax for formatting',
  className,
  minHeight = '200px',
  readOnly = false,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>(readOnly ? 'preview' : 'edit');
  const [editorContent, setEditorContent] = useState(value);

  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  const handleEditContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange(newContent);
  };

  return (
    <div className='flex flex-col space-y-2'>
      {!readOnly && (
        <div className='flex justify-end space-x-2'>
          <Button
            variant={mode === 'edit' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setMode('edit')}
          >
            <Edit className='mr-1 h-4 w-4' />
            Edit
          </Button>

          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setMode('preview')}
          >
            <Eye className='mr-1 h-4 w-4' />
            Preview
          </Button>
        </div>
      )}

      <div className={cn('relative', className)}>
        {mode === 'edit' ?
          <textarea
            value={editorContent}
            onChange={handleEditContent}
            placeholder={placeholder}
            className={cn(
              'border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border p-3 outline-none focus-visible:ring-[3px]',
              className
            )}
            style={{ minHeight, resize: 'vertical' }}
            disabled={readOnly}
          />
        : <div
            className={cn(
              'border-input bg-background text-foreground prose prose-stone dark:prose-invert max-w-none overflow-auto rounded-md border p-4',
              className
            )}
            style={{ minHeight }}
          >
            {editorContent ?
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
              >
                {htmlToMarkdown(editorContent)}
              </ReactMarkdown>
            : <div className='text-muted-foreground italic opacity-70'>No content to preview</div>}
          </div>
        }
      </div>
    </div>
  );
}
