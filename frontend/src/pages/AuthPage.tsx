import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import { Separator } from '@/components/ui/separator';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <PageContainer variant='centered'>
      <Card className='w-full max-w-lg border-2 shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>

          <CardDescription>
            {activeTab === 'login' ?
              'Enter your credentials to access your account'
            : 'Fill out the form below to create your account'}
          </CardDescription>
        </CardHeader>

        <Separator className='max-w-md self-center' />

        <CardContent className='pt-6'>
          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as 'login' | 'register')}
            className='w-full'
          >
            <TabsList className='mb-6 grid grid-cols-2'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='register'>Register</TabsTrigger>
            </TabsList>

            <TabsContent value='login'>
              <LoginForm />
            </TabsContent>

            <TabsContent value='register'>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
