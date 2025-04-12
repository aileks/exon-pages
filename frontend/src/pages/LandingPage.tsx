import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PageContainer from '@/components/PageContainer';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store';
import { BarChart3, Calendar, Database, FileText, FlaskConical, TestTubes } from 'lucide-react';

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
        <h1 className='mb-6 text-5xl font-bold'>
          Exon Pages <span className='text-primary'>BioLab</span>
        </h1>

        <p className='text-muted-foreground mb-8 text-xl'>
          Your comprehensive solution for managing laboratory notebooks, experiments, and research data.
        </p>

        <div className='flex flex-wrap justify-center gap-4'>
          <Button
            size='lg'
            className='gradient-primary'
            asChild
          >
            <Link to='/login'>Get Started</Link>
          </Button>

          <Button
            variant='secondary'
            size='lg'
            asChild
          >
            <a href='#features'>Explore Features</a>
          </Button>
        </div>
      </div>

      <Separator className='my-8' />

      <div
        id='features'
        className='py-8'
      >
        <h2 className='mb-12 text-center text-3xl font-bold'>Laboratory Management Features</h2>

        <div className='grid gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={<FlaskConical className='text-primary h-8 w-8' />}
            title='Experiment Tracking'
            description='Record and monitor your laboratory experiments with detailed metadata and real-time status updates.'
            comingSoon={true}
          />

          <FeatureCard
            icon={<FileText className='text-primary h-8 w-8' />}
            title='Protocol Library'
            description='Create, store, and share standardized protocols with your team for consistent experimental workflows.'
            comingSoon={true}
          />

          <FeatureCard
            icon={<Database className='text-primary h-8 w-8' />}
            title='Sample Management'
            description='Track samples through their lifecycle with barcode integration and location mapping.'
            comingSoon={true}
          />
        </div>

        <div className='mt-8 grid gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={<BarChart3 className='text-primary h-8 w-8' />}
            title='Data Visualization'
            description='Generate interactive charts and graphs from your experimental data for insightful analysis.'
            comingSoon={true}
          />
          <FeatureCard
            icon={<Calendar className='text-primary h-8 w-8' />}
            title='Equipment Scheduling'
            description='Book and manage shared laboratory equipment to maximize resource utilization.'
            comingSoon={true}
          />
          <FeatureCard
            icon={<TestTubes className='text-primary h-8 w-8' />}
            title='Reagent Inventory'
            description='Monitor stock levels and track usage of reagents and supplies across your lab.'
            comingSoon={true}
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
            <CardTitle className='text-2xl'>Your Laboratory Dashboard</CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-muted-foreground mb-6'>Here's an overview of your recent research activity:</p>

            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='experiment-card'>
                <CardHeader className='p-0 pb-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base font-medium'>Recent Experiments</CardTitle>

                    <div className='flex items-center'>
                      <div className='status-active mr-2'></div>

                      <span className='text-xs'>2 Active</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='p-0'>
                  <div className='bg-muted/50 rounded p-4 text-sm'>
                    <p>
                      PCR Amplification - <span className='text-primary'>In Progress</span>
                    </p>

                    <p className='text-muted-foreground mt-1 text-xs'>Last updated: 2 hours ago</p>
                  </div>

                  <div className='rounded p-4 text-sm'>
                    <p>
                      Gel Electrophoresis - <span className='text-accent'>Planned</span>
                    </p>

                    <p className='text-muted-foreground mt-1 text-xs'>Scheduled: Tomorrow</p>
                  </div>
                </CardContent>
              </Card>

              <Card className='experiment-card border-l-secondary'>
                <CardHeader className='p-0 pb-2'>
                  <CardTitle className='text-base font-medium'>Pending Tasks</CardTitle>
                </CardHeader>

                <CardContent className='p-0'>
                  <div className='flex items-center p-3'>
                    <input
                      type='checkbox'
                      className='mr-3'
                    />
                    <span className='text-sm'>Prepare PCR primers</span>
                  </div>

                  <div className='flex items-center border-t p-3'>
                    <input
                      type='checkbox'
                      className='mr-3'
                    />
                    <span className='text-sm'>Order new restriction enzymes</span>
                  </div>

                  <div className='flex items-center border-t p-3'>
                    <input
                      type='checkbox'
                      className='mr-3'
                    />
                    <span className='text-sm'>Update sample database</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Button size='sm'>View All Experiments</Button>

        <Button
          variant='outline'
          className='ml-4'
          size='sm'
        >
          Create New Experiment
        </Button>
      </div>
    </PageContainer>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
}

const FeatureCard = ({ icon, title, description, comingSoon = false }: FeatureCardProps) => {
  return (
    <Card className='card-hover'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {icon}
            <CardTitle className='text-xl'>{title}</CardTitle>
          </div>

          {comingSoon && <span className='coming-soon text-muted-foreground'>Coming Soon</span>}
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
};
