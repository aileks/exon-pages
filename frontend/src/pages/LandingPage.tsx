import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function LandingPage() {
  const { isAuthenticated, getUser, isLoading } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <p className='text-xl'>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />;
}

const UnauthenticatedView = () => {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mx-auto mb-16 max-w-3xl text-center'>
        <h1 className='mb-6 text-5xl font-bold'>Welcome to Our Platform</h1>
        <p className='text-muted-foreground mb-8 text-xl'>
          The ultimate solution for managing your projects and tasks efficiently.
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          <a
            href='/login'
            className='bg-primary text-primary-foreground rounded-md px-6 py-3 font-medium transition-opacity hover:opacity-90'
          >
            Get Started
          </a>
          <a
            href='#features'
            className='bg-secondary text-secondary-foreground rounded-md px-6 py-3 font-medium transition-opacity hover:opacity-90'
          >
            Learn More
          </a>
        </div>
      </div>

      <div
        id='features'
        className='py-8'
      >
        <h2 className='mb-12 text-center text-3xl font-bold'>Key Features</h2>
        <div className='grid gap-8 md:grid-cols-3'>
          <FeatureCard
            title='Seamless Integration'
            description='Easily integrate with your existing tools and workflows.'
          />
          <FeatureCard
            title='Real-time Collaboration'
            description='Work together with your team in real-time.'
          />
          <FeatureCard
            title='Analytics Dashboard'
            description='Get insights into your productivity and team performance.'
          />
        </div>
      </div>
    </div>
  );
};

const AuthenticatedView = () => {
  const { user } = useAuthStore();

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-6 text-4xl font-bold'>Welcome back, {user?.username}!</h1>
        <div className='bg-card mb-8 rounded-lg p-6 shadow-sm'>
          <h2 className='mb-4 text-2xl font-bold'>Your Dashboard</h2>
          <p className='text-muted-foreground mb-6'>Here's an overview of your recent activity:</p>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='bg-background border-border rounded border p-4'>
              <h3 className='mb-2 font-medium'>Recent Projects</h3>
              <p className='text-muted-foreground'>No recent projects found.</p>
            </div>
            <div className='bg-background border-border rounded border p-4'>
              <h3 className='mb-2 font-medium'>Upcoming Tasks</h3>
              <p className='text-muted-foreground'>No upcoming tasks.</p>
            </div>
          </div>
        </div>
        <button className='bg-primary text-primary-foreground rounded px-5 py-2 font-medium transition-opacity hover:opacity-90'>
          View All Projects
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className='bg-card rounded-lg p-6 shadow-sm'>
      <h3 className='mb-3 text-xl font-bold'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
};
