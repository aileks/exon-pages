import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  readOnly?: boolean;
}

export default function TextEditor({
  value,
  onChange,
  placeholder = 'Start typing here...',
  className,
  minHeight = '200px',
  readOnly = false,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value && !isComposing) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const startContainer = range?.startContainer;
      const startOffset = range?.startOffset;
      const isEditorFocused = editor.contains(selection?.focusNode || null);

      editor.innerHTML = value || '';

      if (isEditorFocused && startContainer && range && selection) {
        try {
          selection.removeAllRanges();
          range.setStart(startContainer, startOffset || 0);
          range.setEnd(startContainer, startOffset || 0);
          selection.addRange(range);
        } catch (e) {
          console.warn('Could not restore cursor position:', e);
        }
      }
    }
  }, [value, isComposing]);

  const handleInput = () => {
    if (readOnly || !editorRef.current) return;

    const newValue = editorRef.current.innerHTML;
    onChange(newValue);
  };

  return (
    <div
      className={cn(
        'border-input bg-background text-foreground focus-within:border-ring focus-within:ring-ring/50 rounded-md border p-2 transition-all focus-within:ring-[3px]',
        readOnly ? 'cursor-default' : 'cursor-text',
        className
      )}
      style={{ minHeight }}
    >
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        className='h-full w-full outline-none'
        onInput={handleInput}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => {
          setIsComposing(false);
          handleInput();
        }}
        data-placeholder={placeholder}
        style={{
          minHeight: readOnly ? 'unset' : minHeight,
        }}
      />
    </div>
  );
}
