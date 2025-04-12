import { useEffect } from 'react';
import { Link } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import PageContainer from '@/components/PageContainer';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  const { isAuthenticated, getUser, isLoading } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />;
}

const UnauthenticatedView = () => {
  return (
    <PageContainer>
      <div className='mx-auto mb-16 max-w-3xl text-center'>
        <h1 className='mb-6 text-5xl font-bold'>Welcome to Exon Pages</h1>

        <p className='text-muted-foreground mb-8 text-xl'>
          Your solution for managing your BioLab notes, projects, and experiments.
        </p>

        <div className='flex flex-wrap justify-center gap-4'>
          <Button
            size='lg'
            asChild
          >
            <Link to='/login'>Get Started</Link>
          </Button>

          <Button
            variant='secondary'
            size='lg'
            asChild
          >
            <a href='#features'>Learn More</a>
          </Button>
        </div>
      </div>

      <Separator className='my-8' />

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
    </PageContainer>
  );
};

const AuthenticatedView = () => {
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-6 text-4xl font-bold'>Welcome back, {user?.username}!</h1>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='text-2xl'>Your Dashboard</CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-muted-foreground mb-6'>Here's an overview of your recent activity:</p>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base font-medium'>Recent Projects</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className='text-muted-foreground'>No recent projects found.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-base font-medium'>Upcoming Tasks</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className='text-muted-foreground'>No upcoming tasks.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Button>View All Projects</Button>
      </div>
    </PageContainer>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
};
