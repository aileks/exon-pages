import { useEffect, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import ExperimentsList from '@/components/notebook/ExperimentsList';
import ExperimentEditor from '@/components/notebook/ExperimentEditor';
import Loading from '@/components/Loading';
import { Experiment, useExperiments } from '@/services/notebook';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beaker, FileText, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '@/lib/utils.ts';

interface ExperimentsPageProps {
  sidebarMode?: boolean;
}

export default function ExperimentsPage({ sidebarMode = false }: ExperimentsPageProps) {
  const {
    experiments,
    currentExperiment,
    isLoading,
    refetchExperiments,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    setCurrentExperiment,
  } = useExperiments();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    refetchExperiments();
  }, [refetchExperiments]);

  const handleSelectExperiment = (experiment: Experiment) => {
    setCurrentExperiment(experiment);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setCurrentExperiment(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditExperiment = () => {
    setIsEditing(true);
  };

  const handleSaveExperiment = async (data: any) => {
    try {
      if (isCreating) {
        await createExperiment(data);
        setIsCreating(false);
      } else if (currentExperiment) {
        await updateExperiment(currentExperiment.id, data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving experiment:', error);
    }
  };

  const handleDeleteExperiment = async () => {
    if (!currentExperiment) return;

    try {
      await deleteExperiment(currentExperiment.id);
      setCurrentExperiment(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting experiment:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-gray-400 dark:bg-gray-600';
      case 'in_progress':
        return 'bg-blue-400 dark:bg-blue-600';
      case 'completed':
        return 'bg-green-400 dark:bg-green-600';
      case 'failed':
        return 'bg-red-400 dark:bg-red-600';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (isLoading && experiments.length === 0) {
    return <Loading />;
  }

  const content = (
    <>
      <h1 className='mb-6 text-3xl font-bold'>Experiment Notebook</h1>

      <div className='border-border grid h-[calc(100vh-12rem)] grid-cols-4 gap-6'>
        <div className='border-border rounded-lg border p-4'>
          <ExperimentsList
            experiments={experiments}
            selectedExperimentId={currentExperiment?.id}
            onSelect={handleSelectExperiment}
            onCreateNew={handleCreateNew}
          />
        </div>

        <div className='border-border col-span-3 rounded-lg border p-4'>
          {isCreating ?
            <ExperimentEditor
              experiment={null}
              isNew={true}
              onSave={handleSaveExperiment}
              onCancel={handleCancelEdit}
            />
          : isEditing && currentExperiment ?
            <ExperimentEditor
              experiment={currentExperiment}
              onSave={handleSaveExperiment}
              onDelete={handleDeleteExperiment}
              onCancel={handleCancelEdit}
            />
          : currentExperiment ?
            <div className='flex h-full flex-col'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{currentExperiment.title}</h2>

                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${getStatusColor(currentExperiment.status)}`}
                    ></span>

                    <span className='text-sm'>{formatStatus(currentExperiment.status)}</span>
                  </div>

                  <Button
                    variant='link'
                    className='text-primary hover:text-primary/80 h-auto p-0'
                    onClick={handleEditExperiment}
                  >
                    Edit
                  </Button>
                </div>
              </div>

              <Tabs
                defaultValue='overview'
                className='flex-grow'
              >
                <TabsList className='mb-4'>
                  <TabsTrigger value='overview'>
                    <Beaker className='mr-1 h-4 w-4' />
                    Overview
                  </TabsTrigger>

                  <TabsTrigger value='procedure'>
                    <FlaskConical className='mr-1 h-4 w-4' />
                    Procedure
                  </TabsTrigger>

                  <TabsTrigger value='results'>
                    <FileText className='mr-1 h-4 w-4' />
                    Results
                  </TabsTrigger>
                </TabsList>

                <div className='h-full overflow-auto pb-4'>
                  <TabsContent
                    value='overview'
                    className='mt-0'
                  >
                    <div className='space-y-4'>
                      <div className='text-muted-foreground grid grid-cols-2 gap-2 text-sm'>
                        <div>
                          <span className='font-medium'>Created:</span> {formatDate(currentExperiment.created_at)}
                        </div>

                        <div>
                          <span className='font-medium'>Last Updated:</span> {formatDate(currentExperiment.updated_at)}
                        </div>

                        {currentExperiment.started_at && (
                          <div>
                            <span className='font-medium'>Started:</span> {formatDate(currentExperiment.started_at)}
                          </div>
                        )}

                        {currentExperiment.completed_at && (
                          <div>
                            <span className='font-medium'>Completed:</span> {formatDate(currentExperiment.completed_at)}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className='mb-2 text-lg font-medium'>Hypothesis</h3>
                        <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                          >
                            {htmlToMarkdown(currentExperiment.hypothesis)}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div>
                        <h3 className='mb-2 text-lg font-medium'>Materials</h3>
                        <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                          >
                            {currentExperiment.materials ?
                              htmlToMarkdown(currentExperiment.materials)
                            : 'No materials recorded yet'}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div>
                        <h3 className='mb-2 text-lg font-medium'>Methods</h3>
                        <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                          >
                            {htmlToMarkdown(currentExperiment.methods)}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {currentExperiment.references && (
                        <div>
                          <h3 className='mb-2 text-lg font-medium'>References</h3>
                          <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                            >
                              {htmlToMarkdown(currentExperiment.references)}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value='procedure'
                    className='mt-0'
                  >
                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Experiment Steps</h3>

                      {currentExperiment.steps.length === 0 ?
                        <div className='border-border rounded-md border p-4 text-center'>
                          <p className='text-muted-foreground'>No steps have been added to this experiment.</p>
                        </div>
                      : <div className='space-y-4'>
                          {currentExperiment.steps.map((step, index) => (
                            <div
                              key={step.id}
                              className='border-border rounded-md border p-4'
                            >
                              <div className='mb-2 flex items-center justify-between'>
                                <h4 className='font-medium'>Step {index + 1}</h4>

                                <div className='text-muted-foreground text-sm'>
                                  {step.started_at && (
                                    <span className='mr-3'>Started: {formatDate(step.started_at)}</span>
                                  )}

                                  {step.completed_at && <span>Completed: {formatDate(step.completed_at)}</span>}
                                </div>
                              </div>

                              <div className='mb-3'>
                                <h5 className='mb-1 text-sm font-medium'>Description</h5>
                                <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-3'>
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[
                                      [
                                        rehypeHighlight,
                                        {
                                          detect: true,
                                          ignoreMissing: true,
                                        },
                                      ],
                                    ]}
                                  >
                                    {htmlToMarkdown(step.description)}
                                  </ReactMarkdown>
                                </div>
                              </div>

                              {step.observation && (
                                <div>
                                  <h5 className='mb-1 text-sm font-medium'>Observations</h5>
                                  <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-3'>
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      rehypePlugins={[
                                        [
                                          rehypeHighlight,
                                          {
                                            detect: true,
                                            ignoreMissing: true,
                                          },
                                        ],
                                      ]}
                                    >
                                      {htmlToMarkdown(step.observation)}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  </TabsContent>

                  <TabsContent
                    value='results'
                    className='mt-0'
                  >
                    <div className='space-y-4'>
                      <div>
                        <h3 className='mb-2 text-lg font-medium'>Results</h3>
                        <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                          >
                            {currentExperiment.results ?
                              htmlToMarkdown(currentExperiment.results)
                            : 'No results recorded yet'}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div>
                        <h3 className='mb-2 text-lg font-medium'>Conclusion</h3>
                        <div className='border-border prose prose-stone dark:prose-invert max-w-none rounded-md border p-4'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                          >
                            {currentExperiment.conclusion ?
                              htmlToMarkdown(currentExperiment.conclusion)
                            : 'No conclusion recorded yet'}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          : <div className='text-muted-foreground flex h-full items-center justify-center'>
              <p>Select an experiment or create a new one to get started</p>
            </div>
          }
        </div>
      </div>
    </>
  );

  return sidebarMode ?
      <div className='w-full'>{content}</div>
    : <PageContainer>
        <div className='w-full'>{content}</div>
      </PageContainer>;
}
