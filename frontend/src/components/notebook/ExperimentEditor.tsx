import { useEffect, useState } from 'react';
import { Experiment } from '@/lib/notebookApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextEditor from './TextEditor';
import {
  AlertCircle,
  Beaker,
  BookOpen,
  CheckCircle,
  Clock,
  ListOrdered,
  Microscope,
  PlayCircle,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExperimentEditorProps {
  experiment: Experiment | null;
  isNew?: boolean;
  onSave: (experiment: {
    title: string;
    hypothesis: string;
    materials?: string;
    methods: string;
    results?: string;
    conclusion?: string;
    status?: string;
    references?: string;
    steps?: Array<{
      id?: string;
      description: string;
      observation?: string;
      started_at?: string;
      completed_at?: string;
    }>;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function ExperimentEditor({
  experiment,
  isNew = false,
  onSave,
  onDelete,
  onCancel,
}: ExperimentEditorProps) {
  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [materials, setMaterials] = useState('');
  const [methods, setMethods] = useState('');
  const [results, setResults] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [references, setReferences] = useState('');
  const [status, setStatus] = useState<string>('planned');
  const [steps, setSteps] = useState<
    Array<{
      id?: string;
      description: string;
      observation: string;
      started_at?: string;
      completed_at?: string;
    }>
  >([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (experiment) {
      setTitle(experiment.title);
      setHypothesis(experiment.hypothesis);
      setMaterials(experiment.materials || '');
      setMethods(experiment.methods);
      setResults(experiment.results || '');
      setConclusion(experiment.conclusion || '');
      setStatus(experiment.status);
      setReferences(experiment.references || '');
      setSteps(
        experiment.steps.map(step => ({
          id: step.id,
          description: step.description,
          observation: step.observation || '',
          started_at: step.started_at || undefined,
          completed_at: step.completed_at || undefined,
        }))
      );
    } else {
      setTitle('');
      setHypothesis('');
      setMaterials('');
      setMethods('');
      setResults('');
      setConclusion('');
      setStatus('planned');
      setReferences('');
      setSteps([]);
    }
  }, [experiment]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        description: '',
        observation: '',
      },
    ]);
  };

  const handleUpdateStep = (index: number, field: string, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setSteps(updatedSteps);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStartStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      started_at: new Date().toISOString(),
    };
    setSteps(updatedSteps);
  };

  const handleCompleteStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      completed_at: new Date().toISOString(),
    };
    setSteps(updatedSteps);
  };

  const handleSave = () => {
    if (!title.trim() || !hypothesis.trim() || !methods.trim()) {
      // Show error that required fields are missing
      return;
    }

    onSave({
      title: title.trim(),
      hypothesis: hypothesis.trim(),
      materials: materials.trim(),
      methods: methods.trim(),
      results: results.trim(),
      conclusion: conclusion.trim(),
      status,
      references: references.trim(),
      steps: steps.filter(step => step.description.trim() !== ''),
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;
    setStatus(newStatus);
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>{isNew ? 'New Experiment' : 'Edit Experiment'}</h2>
        <div className='flex gap-2'>
          {!isNew && onDelete && (
            <Button
              variant='destructive'
              size='sm'
              onClick={onDelete}
            >
              <Trash2 className='mr-1 h-4 w-4' />
              Delete
            </Button>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
          >
            <X className='mr-1 h-4 w-4' />
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleSave}
          >
            <Save className='mr-1 h-4 w-4' />
            Save
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='flex-grow overflow-hidden'
      >
        <TabsList className='mb-4 grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>
            <Beaker className='mr-1 h-4 w-4' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='procedure'>
            <ListOrdered className='mr-1 h-4 w-4' />
            Procedure
          </TabsTrigger>
          <TabsTrigger value='results'>
            <Microscope className='mr-1 h-4 w-4' />
            Results
          </TabsTrigger>
          <TabsTrigger value='references'>
            <BookOpen className='mr-1 h-4 w-4' />
            References
          </TabsTrigger>
        </TabsList>

        <div className='h-full overflow-y-auto pb-4'>
          <TabsContent
            value='overview'
            className='mt-0 h-full'
          >
            <div className='space-y-4'>
              <div>
                <Label
                  htmlFor='title'
                  className='mb-1 block text-sm font-medium'
                >
                  Title*
                </Label>
                <Input
                  id='title'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder='Experiment title'
                  className='w-full'
                />
              </div>

              <div>
                <Label className='mb-1 block text-sm font-medium'>Status</Label>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant={status === 'planned' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleStatusChange('planned')}
                  >
                    <Clock className='mr-1 h-4 w-4' />
                    Planned
                  </Button>
                  <Button
                    variant={status === 'in_progress' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleStatusChange('in_progress')}
                  >
                    <PlayCircle className='mr-1 h-4 w-4' />
                    In Progress
                  </Button>
                  <Button
                    variant={status === 'completed' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleStatusChange('completed')}
                  >
                    <CheckCircle className='mr-1 h-4 w-4' />
                    Completed
                  </Button>
                  <Button
                    variant={status === 'failed' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleStatusChange('failed')}
                  >
                    <AlertCircle className='mr-1 h-4 w-4' />
                    Failed
                  </Button>
                </div>
              </div>

              <div>
                <Label className='mb-1 block text-sm font-medium'>Hypothesis*</Label>
                <TextEditor
                  value={hypothesis}
                  onChange={setHypothesis}
                  className='min-h-[100px]'
                  placeholder='State your hypothesis...'
                />
              </div>

              <div>
                <Label className='mb-1 block text-sm font-medium'>Materials</Label>
                <TextEditor
                  value={materials}
                  onChange={setMaterials}
                  className='min-h-[150px]'
                  placeholder='List the materials used in this experiment...'
                />
              </div>

              <div>
                <Label className='mb-1 block text-sm font-medium'>Methods*</Label>
                <TextEditor
                  value={methods}
                  onChange={setMethods}
                  className='min-h-[200px]'
                  placeholder='Describe your methodology...'
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value='procedure'
            className='mt-0 h-full'
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Experiment Steps</h3>
                <Button
                  size='sm'
                  onClick={handleAddStep}
                >
                  <Plus className='mr-1 h-4 w-4' />
                  Add Step
                </Button>
              </div>

              {steps.length === 0 ?
                <div className='border-border rounded-md border p-4 text-center'>
                  <p className='text-muted-foreground'>No steps added yet. Click "Add Step" to start.</p>
                </div>
              : <div className='space-y-6'>
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className='border-border rounded-md border p-4'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <h4 className='font-medium'>Step {index + 1}</h4>
                        <div className='flex items-center gap-2'>
                          {!step.started_at && (
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleStartStep(index)}
                            >
                              <PlayCircle className='mr-1 h-4 w-4' />
                              Start
                            </Button>
                          )}
                          {step.started_at && !step.completed_at && (
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleCompleteStep(index)}
                            >
                              <CheckCircle className='mr-1 h-4 w-4' />
                              Complete
                            </Button>
                          )}
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleRemoveStep(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      {(step.started_at || step.completed_at) && (
                        <div className='text-muted-foreground mb-2 text-xs'>
                          {step.started_at && (
                            <div className='flex items-center'>
                              <Clock className='mr-1 h-3 w-3' />
                              Started: {formatDistanceToNow(new Date(step.started_at))} ago
                            </div>
                          )}
                          {step.completed_at && (
                            <div className='flex items-center'>
                              <CheckCircle className='mr-1 h-3 w-3' />
                              Completed: {formatDistanceToNow(new Date(step.completed_at))} ago
                            </div>
                          )}
                        </div>
                      )}

                      <div className='mb-3'>
                        <Label className='mb-1 block text-sm font-medium'>Description*</Label>
                        <TextEditor
                          value={step.description}
                          onChange={value => handleUpdateStep(index, 'description', value)}
                          className='min-h-[100px]'
                          placeholder='Describe this step...'
                        />
                      </div>

                      <div>
                        <Label className='mb-1 block text-sm font-medium'>Observations</Label>
                        <TextEditor
                          value={step.observation}
                          onChange={value => handleUpdateStep(index, 'observation', value)}
                          className='min-h-[100px]'
                          placeholder='Record your observations for this step...'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </TabsContent>

          <TabsContent
            value='results'
            className='mt-0 h-full'
          >
            <div className='space-y-4'>
              <div>
                <Label className='mb-1 block text-sm font-medium'>Results</Label>
                <TextEditor
                  value={results}
                  onChange={setResults}
                  className='min-h-[200px]'
                  placeholder='Document your experiment results...'
                />
              </div>

              <div>
                <Label className='mb-1 block text-sm font-medium'>Conclusion</Label>
                <TextEditor
                  value={conclusion}
                  onChange={setConclusion}
                  className='min-h-[200px]'
                  placeholder='What conclusions can you draw from your results?'
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value='references'
            className='mt-0 h-full'
          >
            <div>
              <Label className='mb-1 block text-sm font-medium'>References & Citations</Label>
              <TextEditor
                value={references}
                onChange={setReferences}
                className='min-h-[300px]'
                placeholder='Add references, citations, or links to related resources...'
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
