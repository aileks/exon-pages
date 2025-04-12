import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ?
        <Moon className='h-5 w-5' />
      : <Sun className='h-5 w-5' />}
    </Button>
  );
}
