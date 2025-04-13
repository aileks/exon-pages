import { Link } from 'react-router';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { Book, FileText, FlaskConical } from 'lucide-react';

export default function HomePage() {
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
            <p className='text-muted-foreground mb-6'>Manage your laboratory data and collaborate with your team.</p>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card className='card-hover'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center text-xl'>
                      <Book className='text-primary mr-2 h-5 w-5' />
                      Laboratory Notebook
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>
                    Comprehensive lab notebook system for documenting your research.
                  </p>
                  <Button
                    asChild
                    className='w-full'
                  >
                    <Link to='/notebook'>Open Notebook</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className='card-hover'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center text-xl'>
                      <FlaskConical className='text-primary mr-2 h-5 w-5' />
                      Quick Access
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>Jump directly to specific notebook sections:</p>
                  <div className='flex flex-col gap-2'>
                    <Button
                      asChild
                      variant='outline'
                    >
                      <Link
                        to='/notebook/notes'
                        className='justify-start'
                      >
                        <FileText className='mr-2 h-4 w-4' />
                        General Notes
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant='outline'
                    >
                      <Link
                        to='/notebook/experiments'
                        className='justify-start'
                      >
                        <FlaskConical className='mr-2 h-4 w-4' />
                        Experiments
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
