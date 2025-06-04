
import { useMemo } from 'react';
import { 
  formatNumber, 
  formatPercentage, 
  formatStatus, 
  formatDateTime, 
  formatDuration,
  formatRecordsCount,
  getStatusColor
} from '@/utils/formatters';

interface DashboardData {
  migration_projects?: any[];
  migration_stages?: any[];
  migration_object_types?: any[];
  migration_errors?: any[];
  user_activities?: any[];
}

export const useDashboardFormatting = (data: DashboardData = {}) => {
  const formattedStats = useMemo(() => {
    const {
      migration_projects = [],
      migration_stages = [],
      migration_object_types = [],
      migration_errors = [],
      user_activities = []
    } = data;

    // Calculate overall stats
    const totalProjects = migration_projects.length;
    const activeProjects = migration_projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
    const completedProjects = migration_projects.filter(p => p.status === 'completed').length;
    const failedProjects = migration_projects.filter(p => p.status === 'failed' || p.status === 'error').length;
    
    const totalRecords = migration_projects.reduce((sum, p) => sum + (p.total_objects || 0), 0);
    const migratedRecords = migration_projects.reduce((sum, p) => sum + (p.migrated_objects || 0), 0);
    const failedRecords = migration_projects.reduce((sum, p) => sum + (p.failed_objects || 0), 0);
    
    const completionRate = totalRecords > 0 ? (migratedRecords / totalRecords) * 100 : 0;
    const errorRate = totalRecords > 0 ? (failedRecords / totalRecords) * 100 : 0;
    
    const recentErrors = migration_errors.filter(error => {
      const errorDate = new Date(error.created_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return errorDate > oneDayAgo;
    }).length;

    return {
      overview: {
        totalProjects: formatNumber(totalProjects),
        activeProjects: formatNumber(activeProjects),
        completedProjects: formatNumber(completedProjects),
        failedProjects: formatNumber(failedProjects),
        completionRate: formatPercentage(completionRate),
        errorRate: formatPercentage(errorRate)
      },
      records: {
        total: formatRecordsCount(totalRecords),
        migrated: formatRecordsCount(migratedRecords),
        failed: formatRecordsCount(failedRecords),
        remaining: formatRecordsCount(totalRecords - migratedRecords)
      },
      activity: {
        totalActivities: formatNumber(user_activities.length),
        recentErrors: formatNumber(recentErrors),
        lastActivity: user_activities.length > 0 ? formatDateTime(user_activities[0]?.created_at) : 'No recent activity'
      }
    };
  }, [data]);

  const formattedProjects = useMemo(() => {
    return (data.migration_projects || []).map(project => ({
      ...project,
      formattedStatus: formatStatus(project.status),
      statusColor: getStatusColor(project.status),
      formattedCreatedAt: formatDateTime(project.created_at),
      formattedCompletedAt: project.completed_at ? formatDateTime(project.completed_at) : null,
      progressPercentage: project.total_objects > 0 
        ? Math.round((project.migrated_objects / project.total_objects) * 100)
        : 0,
      formattedTotalRecords: formatRecordsCount(project.total_objects),
      formattedMigratedRecords: formatRecordsCount(project.migrated_objects),
      formattedFailedRecords: formatRecordsCount(project.failed_objects)
    }));
  }, [data.migration_projects]);

  const formattedStages = useMemo(() => {
    return (data.migration_stages || []).map(stage => ({
      ...stage,
      formattedStatus: formatStatus(stage.status),
      statusColor: getStatusColor(stage.status),
      formattedStartedAt: stage.started_at ? formatDateTime(stage.started_at) : null,
      formattedCompletedAt: stage.completed_at ? formatDateTime(stage.completed_at) : null,
      formattedProgress: formatPercentage(stage.percentage_complete || 0),
      duration: stage.started_at && stage.completed_at 
        ? formatDuration((new Date(stage.completed_at).getTime() - new Date(stage.started_at).getTime()) / 1000)
        : null
    }));
  }, [data.migration_stages]);

  const formattedErrors = useMemo(() => {
    return (data.migration_errors || []).map(error => ({
      ...error,
      formattedErrorType: formatStatus(error.error_type),
      formattedCreatedAt: formatDateTime(error.created_at),
      isResolved: error.resolved,
      severity: getSeverityFromErrorType(error.error_type)
    }));
  }, [data.migration_errors]);

  return {
    stats: formattedStats,
    projects: formattedProjects,
    stages: formattedStages,
    errors: formattedErrors,
    hasData: Object.values(data).some(arr => Array.isArray(arr) && arr.length > 0)
  };
};

const getSeverityFromErrorType = (errorType: string): 'low' | 'medium' | 'high' | 'critical' => {
  const type = errorType?.toLowerCase() || '';
  
  if (type.includes('critical') || type.includes('fatal')) return 'critical';
  if (type.includes('error') || type.includes('failed')) return 'high';
  if (type.includes('warning') || type.includes('validation')) return 'medium';
  
  return 'low';
};
