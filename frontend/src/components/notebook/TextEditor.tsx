import React, { useEffect, useState } from 'react';
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
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (readOnly) return;

    const newValue = e.currentTarget.innerHTML;
    setLocalValue(newValue);
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
        contentEditable={!readOnly}
        className='h-full w-full outline-none'
        dangerouslySetInnerHTML={{ __html: localValue || '' }}
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          minHeight: readOnly ? 'unset' : minHeight,
        }}
      />
    </div>
  );
}
