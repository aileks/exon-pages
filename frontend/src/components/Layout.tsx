import React, { Suspense } from 'react';
import { Link } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import { Book, FileText, FlaskConical } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isLoading } = useAuthStore();

  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <header className='border-border border-b'>
        <nav className='container mx-auto flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-4'>
            <Link
              to='/'
              className='text-primary text-xl font-bold'
            >
              Exon Pages
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                      <li className='row-span-3'>
                        <NavigationMenuLink asChild>
                          <a
                            className='from-primary/10 to-primary/20 flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md'
                            href='/'
                          >
                            <div className='text-lg font-medium'>Exon Pages</div>
                            <p className='text-muted-foreground text-sm leading-tight'>
                              Cutting-edge biology data management platform.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className={cn(
                              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                            )}
                            href='/notebook'
                          >
                            <div className='flex items-center text-sm font-medium leading-none'>
                              <Book className='mr-2 h-4 w-4' />
                              Laboratory Notebook
                            </div>
                            <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
                              Comprehensive lab notebook system for notes and experiments.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className={cn(
                              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                            )}
                            href='#'
                          >
                            <div className='text-sm font-medium leading-none'>DNA Analysis</div>
                            <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
                              Advanced tools for DNA sequence analysis.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className={cn(
                              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                            )}
                            href='#'
                          >
                            <div className='text-sm font-medium leading-none'>Protein Visualization</div>

                            <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
                              Interactive 3D protein structure models.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {user && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Notebook</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid w-[200px] gap-2 p-4'>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className={cn(
                                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                              )}
                              href='/notebook'
                            >
                              <div className='flex items-center text-sm font-medium leading-none'>
                                <Book className='mr-2 h-4 w-4' />
                                All Notebooks
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className={cn(
                                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                              )}
                              href='/notebook/notes'
                            >
                              <div className='flex items-center text-sm font-medium leading-none'>
                                <FileText className='mr-2 h-4 w-4' />
                                General Notes
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className={cn(
                                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                              )}
                              href='/notebook/experiments'
                            >
                              <div className='flex items-center text-sm font-medium leading-none'>
                                <FlaskConical className='mr-2 h-4 w-4' />
                                Experiments
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <Link to='/about'>
                    <NavigationMenuLink
                      className={cn(
                        'bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      )}
                    >
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div>
            {isLoading ?
              <Loading size='sm' />
            : user ?
              <div className='flex items-center gap-4'>
                <ThemeToggle />
                <span className='text-foreground'>Welcome, {user?.username}</span>

                <Button
                  onClick={() => logout()}
                  variant='destructive'
                >
                  Log Out
                </Button>
              </div>
            : <div className='space-x-4'>
                <ThemeToggle />
                <Button asChild>
                  <Link to='/login'>Login</Link>
                </Button>
              </div>
            }
          </div>
        </nav>
      </header>

      <main className='flex-grow'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
}
