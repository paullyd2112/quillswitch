
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MigrationsTable from '@/components/migrations/MigrationsTable';
import { MigrationProject } from '@/integrations/supabase/migrationTypes';

const MigrationsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('migration_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to match our MigrationProject type
      const typedProjects: MigrationProject[] = (data || []).map(project => ({
        ...project,
        status: project.status as MigrationProject['status']
      }));
      
      setProjects(typedProjects);
    } catch (error) {
      console.error('Error loading migration projects:', error);
      toast.error('Failed to load migration projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateNew = () => {
    navigate('/app/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <div className="container px-4 pt-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Migration Projects</h1>
            <p className="text-muted-foreground">
              Manage your CRM data migration projects
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={loadProjects}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              New Migration
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Migration Projects</CardTitle>
            <CardDescription>
              Track the progress of your CRM data migrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MigrationsTable projects={projects} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrationsList;
