import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store';

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
            <p className='text-muted-foreground mb-6'>Your experiments and research data will appear here.</p>
          </CardContent>
        </Card>

        <Button
          variant='outline'
          size='sm'
        >
          Create New Experiment
        </Button>
      </div>
    </PageContainer>
  );
}
