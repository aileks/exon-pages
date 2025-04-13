import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import { FileText, FlaskConical } from 'lucide-react';
import NotesPage from './NotesPage';
import ExperimentsPage from './ExperimentsPage';

export default function NotebookPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'experiments'>('notes');

  return (
    <PageContainer>
      <div className='mx-auto'>
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as 'notes' | 'experiments')}
          className='w-full'
        >
          <div className='mb-8 flex justify-center'>
            <TabsList className='grid w-[400px] grid-cols-2'>
              <TabsTrigger value='notes'>
                <FileText className='mr-2 h-4 w-4' />
                General Notes
              </TabsTrigger>
              <TabsTrigger value='experiments'>
                <FlaskConical className='mr-2 h-4 w-4' />
                Experiments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value='notes'
            className='mt-0'
          >
            <NotesPage />
          </TabsContent>

          <TabsContent
            value='experiments'
            className='mt-0'
          >
            <ExperimentsPage />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
