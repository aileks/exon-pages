import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useNavigate } from 'react-router';
import Loading from '@/components/Loading';
import { useAuth } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email address'),
  password: z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      // Error is handled in the auth service
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login('demo@exon.pages', 'password');
      navigate('/');
    } catch (err) {
      console.error(err);
      // Error is handled in the auth service
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {error && <div className='bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm'>{error}</div>}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='user123@gmail.com'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='••••••••••'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={isLoading}
        >
          {isLoading ?
            <Loading size='sm' />
          : 'Log In'}
        </Button>
      </form>

      <Button
        variant='secondary'
        className='mt-4 w-full'
        onClick={handleDemoLogin}
      >
        Demo Login
      </Button>
    </Form>
  );
}
