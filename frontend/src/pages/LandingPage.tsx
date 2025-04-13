import React from 'react';
import { Link } from 'react-router';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BarChart3, Calendar, Database, FileText, FlaskConical, TestTubes } from 'lucide-react';

export default function LandingPage() {
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
          >
            <Link to='#features'>Explore Features</Link>
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
}

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
