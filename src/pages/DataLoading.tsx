
import React from 'react';
import { DataLoadingProvider } from '@/components/DataLoading/DataLoadingProvider';
import { DataLoader } from '@/components/DataLoading/DataLoader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';

const DataLoadingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Loading Service</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Import, validate, and process your data with intelligent error detection and actionable feedback.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <Tabs defaultValue="contacts">
            <TabsList className="mb-4">
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts">
              <DataLoadingProvider initialSourceType="contacts">
                <DataLoader title="Import Contacts" />
              </DataLoadingProvider>
            </TabsContent>
            
            <TabsContent value="accounts">
              <DataLoadingProvider initialSourceType="accounts">
                <DataLoader title="Import Accounts" />
              </DataLoadingProvider>
            </TabsContent>
            
            <TabsContent value="opportunities">
              <DataLoadingProvider initialSourceType="opportunities">
                <DataLoader title="Import Opportunities" />
              </DataLoadingProvider>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DataLoadingPage;
