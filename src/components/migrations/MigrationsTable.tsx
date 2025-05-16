
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MigrationProject } from '@/integrations/supabase/migrationTypes';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import MigrationStatus from './MigrationStatus';

interface MigrationsTableProps {
  projects: MigrationProject[];
  isLoading: boolean;
}

const MigrationsTable = ({ projects, isLoading }: MigrationsTableProps) => {
  const navigate = useNavigate();
  
  const handleViewMigration = (id: string) => {
    navigate(`/app/migrations/${id}`);
  };
  
  const handleContinueMigration = (id: string) => {
    navigate(`/app/migrations/${id}`);
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading migrations...</div>;
  }
  
  if (projects.length === 0) {
    return <div className="py-8 text-center">No migrations found.</div>;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Migration Type</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Progress</TableHead>
            <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                {project.company_name}
                <div className="text-xs text-muted-foreground mt-1">
                  {project.source_crm} → {project.destination_crm}
                </div>
              </TableCell>
              <TableCell>{project.migration_strategy}</TableCell>
              <TableCell className="hidden md:table-cell">
                <MigrationStatus status={project.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {project.total_objects > 0 
                  ? `${Math.round((project.migrated_objects / project.total_objects) * 100)}%` 
                  : '-'}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {project.updated_at 
                  ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true }) 
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {project.status === 'completed' || project.status === 'failed' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMigration(project.id)}
                    className="gap-1"
                  >
                    View <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleContinueMigration(project.id)}
                    className="gap-1"
                  >
                    Continue <PlayCircle size={14} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MigrationsTable;
