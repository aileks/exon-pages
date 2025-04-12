import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-red-600'>404</h1>

        <p className='mt-4 text-xl'>Page Not Found</p>

        <p className='mt-2 text-gray-600'>The page you are looking for does not exist.</p>

        <Button
          variant='link'
          className='mt-4'
        >
          <Link
            to='/'
            className='text-lg'
          >
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
