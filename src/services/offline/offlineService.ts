import { supabase } from '@/integrations/supabase/client';

export interface OfflineAction {
  id: string;
  operation_type: 'create' | 'update' | 'delete';
  table_name: string;
  record_id?: string;
  data: Record<string, any>;
  timestamp: number;
  workspace_id?: string;
}

export class OfflineService {
  private static instance: OfflineService;
  private dbName = 'QuillSwitchOfflineDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private syncInProgress = false;

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  // Initialize IndexedDB
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create object stores
        if (!db.objectStoreNames.contains('offline_actions')) {
          const store = db.createObjectStore('offline_actions', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('table_name', 'table_name');
        }

        if (!db.objectStoreNames.contains('cached_data')) {
          const cacheStore = db.createObjectStore('cached_data', { keyPath: 'key' });
          cacheStore.createIndex('table_name', 'table_name');
          cacheStore.createIndex('workspace_id', 'workspace_id');
        }
      };
    });
  }

  // Queue an action for offline processing
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) await this.initialize();

    const offlineAction: OfflineAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    const transaction = this.db!.transaction(['offline_actions'], 'readwrite');
    const store = transaction.objectStore('offline_actions');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(offlineAction);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncWhenOnline();
    }
  }

  // Get all queued actions
  async getQueuedActions(): Promise<OfflineAction[]> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['offline_actions'], 'readonly');
    const store = transaction.objectStore('offline_actions');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Remove a synced action
  async removeAction(actionId: string): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['offline_actions'], 'readwrite');
    const store = transaction.objectStore('offline_actions');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(actionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cache data for offline use
  async cacheData(key: string, data: any, tableName: string, workspaceId?: string): Promise<void> {
    if (!this.db) await this.initialize();

    const cacheEntry = {
      key,
      data,
      table_name: tableName,
      workspace_id: workspaceId,
      timestamp: Date.now()
    };

    const transaction = this.db!.transaction(['cached_data'], 'readwrite');
    const store = transaction.objectStore('cached_data');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached data
  async getCachedData(key: string): Promise<any | null> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['cached_data'], 'readonly');
    const store = transaction.objectStore('cached_data');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        if (result && this.isCacheValid(result.timestamp)) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Check if cache is still valid (24 hours)
  private isCacheValid(timestamp: number): boolean {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - timestamp < maxAge;
  }

  // Sync queued actions when online
  async syncWhenOnline(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return;

    this.syncInProgress = true;
    
    try {
      const actions = await this.getQueuedActions();
      console.log(`Syncing ${actions.length} offline actions...`);

      for (const action of actions) {
        try {
          await this.syncAction(action);
          await this.removeAction(action.id);
          console.log(`Synced action: ${action.operation_type} on ${action.table_name}`);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          // Add to Supabase sync queue for server-side retry
          await this.addToServerSyncQueue(action);
        }
      }

      if (actions.length > 0) {
        // Notify UI about sync completion
        window.dispatchEvent(new CustomEvent('offlineSyncComplete', {
          detail: { syncedCount: actions.length }
        }));
      }

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync individual action
  private async syncAction(action: OfflineAction): Promise<void> {
    const { operation_type, table_name, record_id, data } = action;

      // For safety, we'll only sync certain known tables
      const allowedTables = [
        'migration_projects', 'migration_schedules', 'custom_validation_rules',
        'user_notification_preferences', 'migration_records'
      ];
      
      if (!allowedTables.includes(table_name)) {
        throw new Error(`Table ${table_name} not allowed for offline sync`);
      }

      switch (operation_type) {
        case 'create':
          if (table_name === 'migration_projects') {
            const { error: insertError } = await supabase
              .from('migration_projects')
              .insert(data as any);
            if (insertError) throw insertError;
          }
          // Add other table cases as needed
          break;

        case 'update':
          if (!record_id) throw new Error('Record ID required for update');
          if (table_name === 'migration_projects') {
            const { error: updateError } = await supabase
              .from('migration_projects')
              .update(data as any)
              .eq('id', record_id);
            if (updateError) throw updateError;
          }
          // Add other table cases as needed
          break;

        case 'delete':
          if (!record_id) throw new Error('Record ID required for delete');
          if (table_name === 'migration_projects') {
            const { error: deleteError } = await supabase
              .from('migration_projects')
              .delete()
              .eq('id', record_id);
            if (deleteError) throw deleteError;
          }
          // Add other table cases as needed
          break;

        default:
          throw new Error(`Unknown operation type: ${operation_type}`);
      }
  }

  // Add failed sync to server queue for retry
  private async addToServerSyncQueue(action: OfflineAction): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      await supabase
        .from('offline_sync_queue')
        .insert({
          user_id: userData.user.id,
          operation_type: action.operation_type,
          table_name: action.table_name,
          record_id: action.record_id,
          data: action.data,
          workspace_id: action.workspace_id
        });
    } catch (error) {
      console.error('Failed to add to server sync queue:', error);
    }
  }

  // Check online status and setup listeners
  setupOnlineListeners(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored, syncing offline actions...');
      this.syncWhenOnline();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost, queuing actions for later sync...');
    });

    // Also sync on page visibility change (user returns to app)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && navigator.onLine) {
        this.syncWhenOnline();
      }
    });
  }

  // Get offline status
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get sync status
  isSyncing(): boolean {
    return this.syncInProgress;
  }
}

// Export singleton instance
export const offlineService = OfflineService.getInstance();