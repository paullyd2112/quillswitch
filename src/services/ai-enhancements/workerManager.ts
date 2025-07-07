/**
 * Web Worker Manager for AI Enhancement Services
 * Manages worker lifecycle and provides fallback to main thread processing
 */

export interface WorkerTask<T, R> {
  id: string;
  type: string;
  data: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
  timeout?: number;
}

export class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  private pendingTasks: Map<string, WorkerTask<any, any>> = new Map();
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof Worker !== 'undefined';
  }

  /**
   * Initialize a worker for a specific service
   */
  initWorker(workerName: string, scriptPath: string): boolean {
    if (!this.isSupported) {
      console.warn('Web Workers not supported, falling back to main thread');
      return false;
    }

    try {
      const worker = new Worker(scriptPath);
      
      worker.onmessage = (event) => {
        this.handleWorkerMessage(workerName, event);
      };

      worker.onerror = (error) => {
        console.error(`Worker ${workerName} error:`, error);
        this.handleWorkerError(workerName, error);
      };

      this.workers.set(workerName, worker);
      return true;
    } catch (error) {
      console.error(`Failed to initialize worker ${workerName}:`, error);
      return false;
    }
  }

  /**
   * Execute a task on a worker with fallback
   */
  async executeTask<T, R>(
    workerName: string,
    taskType: string,
    data: T,
    fallbackFn?: () => Promise<R>,
    timeout: number = 30000
  ): Promise<R> {
    const worker = this.workers.get(workerName);
    
    if (!worker) {
      if (fallbackFn) {
        console.warn(`Worker ${workerName} not available, using fallback`);
        return fallbackFn();
      }
      throw new Error(`Worker ${workerName} not initialized and no fallback provided`);
    }

    return new Promise<R>((resolve, reject) => {
      const taskId = this.generateTaskId();
      
      const task: WorkerTask<T, R> = {
        id: taskId,
        type: taskType,
        data,
        resolve,
        reject,
        timeout
      };

      this.pendingTasks.set(taskId, task);

      // Set timeout
      const timeoutId = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        reject(new Error(`Worker task timeout after ${timeout}ms`));
      }, timeout);

      // Override task resolve to clear timeout
      const originalResolve = task.resolve;
      task.resolve = (result: R) => {
        clearTimeout(timeoutId);
        this.pendingTasks.delete(taskId);
        originalResolve(result);
      };

      const originalReject = task.reject;
      task.reject = (error: Error) => {
        clearTimeout(timeoutId);
        this.pendingTasks.delete(taskId);
        originalReject(error);
      };

      // Send task to worker
      worker.postMessage({
        id: taskId,
        type: taskType,
        data
      });
    });
  }

  /**
   * Handle messages from workers
   */
  private handleWorkerMessage(workerName: string, event: MessageEvent) {
    const { id, type, results, error, info } = event.data;

    if (type === 'PROGRESS') {
      // Handle progress updates - emit to listeners
      this.emitProgress(workerName, event.data);
      return;
    }

    if (!id) {
      // Handle worker-initiated messages (like MODEL_READY)
      this.emitWorkerEvent(workerName, event.data);
      return;
    }

    const task = this.pendingTasks.get(id);
    if (!task) {
      console.warn(`Received response for unknown task: ${id}`);
      return;
    }

    if (error) {
      task.reject(new Error(error));
    } else {
      task.resolve(results || info);
    }
  }

  /**
   * Handle worker errors
   */
  private handleWorkerError(workerName: string, error: ErrorEvent) {
    // Reject all pending tasks for this worker
    for (const [taskId, task] of this.pendingTasks.entries()) {
      if (this.workers.get(workerName) === error.target) {
        task.reject(new Error(`Worker error: ${error.message}`));
        this.pendingTasks.delete(taskId);
      }
    }
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Event emitter for progress updates
   */
  private progressListeners: Map<string, ((data: any) => void)[]> = new Map();

  onProgress(workerName: string, callback: (data: any) => void) {
    if (!this.progressListeners.has(workerName)) {
      this.progressListeners.set(workerName, []);
    }
    this.progressListeners.get(workerName)!.push(callback);
  }

  private emitProgress(workerName: string, data: any) {
    const listeners = this.progressListeners.get(workerName);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Event emitter for worker events
   */
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

  onEvent(workerName: string, callback: (data: any) => void) {
    if (!this.eventListeners.has(workerName)) {
      this.eventListeners.set(workerName, []);
    }
    this.eventListeners.get(workerName)!.push(callback);
  }

  private emitWorkerEvent(workerName: string, data: any) {
    const listeners = this.eventListeners.get(workerName);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Check if workers are supported
   */
  isWorkersSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get worker status
   */
  getWorkerStatus(workerName: string): 'ready' | 'not_initialized' | 'error' {
    const worker = this.workers.get(workerName);
    if (!worker) return 'not_initialized';
    return 'ready';
  }

  /**
   * Terminate a worker
   */
  terminateWorker(workerName: string) {
    const worker = this.workers.get(workerName);
    if (worker) {
      worker.terminate();
      this.workers.delete(workerName);
      
      // Reject any pending tasks for this worker
      for (const [taskId, task] of this.pendingTasks.entries()) {
        if (this.workers.get(workerName) === worker) {
          task.reject(new Error('Worker terminated'));
          this.pendingTasks.delete(taskId);
        }
      }
    }
  }

  /**
   * Terminate all workers
   */
  terminateAll() {
    for (const workerName of this.workers.keys()) {
      this.terminateWorker(workerName);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      workersSupported: this.isSupported,
      activeWorkers: this.workers.size,
      pendingTasks: this.pendingTasks.size,
      workerStatus: Array.from(this.workers.keys()).reduce((acc, name) => {
        acc[name] = this.getWorkerStatus(name);
        return acc;
      }, {} as Record<string, string>)
    };
  }
}

// Singleton instance
export const workerManager = new WorkerManager();