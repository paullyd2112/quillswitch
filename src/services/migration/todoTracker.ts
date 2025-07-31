/**
 * TODO/FIXME tracker for QuillSwitch
 * Systematically manages and tracks technical debt and unfinished features
 */

import { logger } from '@/utils/logging/productionLogger';

export interface TodoItem {
  id: string;
  type: 'TODO' | 'FIXME' | 'HACK';
  description: string;
  file: string;
  line?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'crm-integration' | 'security' | 'performance' | 'ui' | 'testing' | 'general';
  assignee?: string;
  estimatedHours?: number;
  blockedBy?: string[];
  dateAdded: string;
  targetDate?: string;
}

// Current known TODOs from the codebase scan
export const KNOWN_TODOS: TodoItem[] = [
  {
    id: 'ecosystem-discovery',
    type: 'TODO',
    description: 'Replace with actual API call to discover connected ecosystem tools',
    file: 'src/components/migration-setup/EcosystemAutoConnector.tsx',
    line: 48,
    priority: 'high',
    category: 'crm-integration',
    estimatedHours: 8,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-15'
  },
  {
    id: 'ecosystem-autoconnect',
    type: 'TODO', 
    description: 'Implement actual auto-connection logic via API',
    file: 'src/components/migration-setup/EcosystemAutoConnector.tsx',
    line: 100,
    priority: 'high',
    category: 'crm-integration',
    estimatedHours: 16,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-15'
  },
  {
    id: 'native-crm-extraction',
    type: 'TODO',
    description: 'Replace with native CRM data extraction',
    file: 'src/components/migration/MigrationExecutionDashboard.tsx',
    line: 101,
    priority: 'critical',
    category: 'crm-integration',
    estimatedHours: 24,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-10'
  },
  {
    id: 'native-crm-migration',
    type: 'TODO',
    description: 'Replace with native CRM migration',
    file: 'src/components/migration/MigrationExecutionDashboard.tsx', 
    line: 133,
    priority: 'critical',
    category: 'crm-integration',
    estimatedHours: 32,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-10'
  },
  {
    id: 'real-data-preview',
    type: 'TODO',
    description: 'Implement real data preview from connected CRM systems',
    file: 'src/components/migration/data-mapping/DataPreview.tsx',
    line: 17,
    priority: 'medium',
    category: 'crm-integration',
    estimatedHours: 12,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-20'
  },
  {
    id: 'production-mfa',
    type: 'TODO',
    description: 'Enable MFA for production',
    file: 'src/utils/security/securityConfig.ts',
    line: 14,
    priority: 'high',
    category: 'security',
    estimatedHours: 6,
    dateAdded: '2025-07-31',
    targetDate: '2025-08-05'
  },
  {
    id: 'page-architecture-migrations',
    type: 'TODO',
    description: 'Page candidate for future overhaul to improve UX and architecture',
    file: 'src/pages/AppMigrations.tsx',
    line: 1,
    priority: 'medium',
    category: 'ui',
    estimatedHours: 20,
    dateAdded: '2025-07-31',
    targetDate: '2025-09-01'
  },
  {
    id: 'page-architecture-setup',
    type: 'TODO',
    description: 'Page candidate for future overhaul to improve UX and architecture',
    file: 'src/pages/Setup.tsx',
    line: 1,
    priority: 'medium',
    category: 'ui',
    estimatedHours: 16,
    dateAdded: '2025-07-31',
    targetDate: '2025-09-01'
  }
];

class TodoTracker {
  private todos: TodoItem[] = [...KNOWN_TODOS];

  // Get todos by priority
  getCriticalTodos(): TodoItem[] {
    return this.todos.filter(todo => todo.priority === 'critical');
  }

  getHighPriorityTodos(): TodoItem[] {
    return this.todos.filter(todo => todo.priority === 'high');
  }

  // Get todos by category
  getTodosByCategory(category: TodoItem['category']): TodoItem[] {
    return this.todos.filter(todo => todo.category === category);
  }

  // Get overdue todos
  getOverdueTodos(): TodoItem[] {
    const now = new Date();
    return this.todos.filter(todo => {
      if (!todo.targetDate) return false;
      return new Date(todo.targetDate) < now;
    });
  }

  // Get upcoming todos (due within 7 days)
  getUpcomingTodos(): TodoItem[] {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.todos.filter(todo => {
      if (!todo.targetDate) return false;
      const targetDate = new Date(todo.targetDate);
      return targetDate >= now && targetDate <= weekFromNow;
    });
  }

  // Add new todo
  addTodo(todo: Omit<TodoItem, 'id' | 'dateAdded'>): TodoItem {
    const newTodo: TodoItem = {
      ...todo,
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    
    this.todos.push(newTodo);
    logger.info('TodoTracker', 'New TODO added', { todoId: newTodo.id, description: newTodo.description });
    
    return newTodo;
  }

  // Mark todo as completed
  completeTodo(id: string): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    
    const completedTodo = this.todos.splice(index, 1)[0];
    logger.info('TodoTracker', 'TODO completed', { todoId: id, description: completedTodo.description });
    
    return true;
  }

  // Get summary statistics
  getSummary() {
    const byPriority = {
      critical: this.todos.filter(t => t.priority === 'critical').length,
      high: this.todos.filter(t => t.priority === 'high').length,
      medium: this.todos.filter(t => t.priority === 'medium').length,
      low: this.todos.filter(t => t.priority === 'low').length,
    };

    const byCategory = this.todos.reduce((acc, todo) => {
      acc[todo.category] = (acc[todo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.todos.length,
      byPriority,
      byCategory,
      overdue: this.getOverdueTodos().length,
      upcoming: this.getUpcomingTodos().length,
      estimatedHours: this.todos.reduce((sum, todo) => sum + (todo.estimatedHours || 0), 0),
    };
  }

  // Log current status
  logStatus(): void {
    const summary = this.getSummary();
    
    logger.info('TodoTracker', 'Current TODO status', {
      summary,
      criticalTodos: this.getCriticalTodos().map(t => ({ id: t.id, description: t.description })),
      overdueTodos: this.getOverdueTodos().map(t => ({ id: t.id, description: t.description, targetDate: t.targetDate }))
    });
  }

  // Get all todos
  getAllTodos(): TodoItem[] {
    return [...this.todos];
  }
}

// Export singleton instance
export const todoTracker = new TodoTracker();

// Log initial status
todoTracker.logStatus();