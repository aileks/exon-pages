import React from 'react';
import { Link } from 'react-router';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, FlaskConical, Github, Microscope, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageContainer>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold'>
            About <span className='text-primary'>Exon Pages</span>
          </h1>

          <p className='text-muted-foreground text-xl'>
            A modern laboratory notebook system designed for scientists and researchers
          </p>
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='text-2xl'>Our Mission</CardTitle>
          </CardHeader>

          <CardContent>
            <p className='mb-4'>
              Exon Pages was created to simplify the process of documenting research and experiments in modern
              laboratories. We believe that scientists should spend more time on discovery and less time on
              documentation.
            </p>

            <p>
              Our platform provides a streamlined digital environment for recording notes, tracking experiments, and
              collaborating with team members—all with the security and reliability expected in scientific research.
            </p>
          </CardContent>
        </Card>

        <h2 className='mb-6 text-2xl font-bold'>Key Features</h2>

        <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FeatureCard
            icon={<FileText className='text-primary h-8 w-8' />}
            title='Comprehensive Notes'
            description='Create, organize, and search through detailed research notes with rich text formatting and tagging capabilities.'
          />

          <FeatureCard
            icon={<FlaskConical className='text-primary h-8 w-8' />}
            title='Experiment Tracking'
            description='Document experimental procedures, record observations, and track results in a structured workflow.'
          />

          <FeatureCard
            icon={<Microscope className='text-primary h-8 w-8' />}
            title='Data Analysis'
            description='Visualize your experimental data with integrated charts and graphs to identify patterns and insights.'
          />

          <FeatureCard
            icon={<Users className='text-primary h-8 w-8' />}
            title='Team Collaboration'
            description='Share notes and experiments with colleagues, enabling seamless cooperation on research projects.'
          />
        </div>

        <Separator className='my-8' />

        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Technology Stack</h2>
          <p className='text-muted-foreground mb-6'>
            Exon Pages is built using modern web technologies to ensure performance, reliability, and security.
          </p>

          <div className='flex flex-wrap justify-center gap-4'>
            <TechBadge label='React' />
            <TechBadge label='TypeScript' />
            <TechBadge label='Flask' />
            <TechBadge label='SQLAlchemy' />
            <TechBadge label='Tailwind CSS' />
          </div>
        </div>

        <div className='text-center'>
          <h2 className='mb-6 text-2xl font-bold'>Get Started Today</h2>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button
              asChild
              size='lg'
              className='gradient-primary'
            >
              <Link to='/login'>Create Account</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
            >
              <Link
                to='https://github.com/aileks/exon-pages'
                className='flex items-center'
              >
                <Github className='mr-2 h-4 w-4' />
                View on GitHub
                <ExternalLink className='ml-1 h-3 w-3' />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className='card-hover'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          {icon}
          <CardTitle className='text-xl'>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
};

const TechBadge = ({ label }: { label: string }) => {
  return <span className='bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm font-medium'>{label}</span>;
};
