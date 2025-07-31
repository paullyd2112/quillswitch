/**
 * Console replacement utility for QuillSwitch
 * Provides drop-in replacements for console methods using structured logging
 */

import { logger } from '@/utils/logging/productionLogger';

/**
 * Drop-in console replacement that uses structured logging
 * Usage: Replace console.log with logInfo, console.error with logError, etc.
 */
export const logInfo = (message: string, data?: any) => {
  logger.info('General', message, data ? { data } : undefined);
};

export const logWarn = (message: string, data?: any) => {
  logger.warn('General', message, data ? { data } : undefined);
};

export const logError = (message: string, error?: Error | any, data?: any) => {
  if (error instanceof Error) {
    logger.error('General', message, error, data ? { data } : undefined);
  } else {
    logger.error('General', message, undefined, { error, ...data });
  }
};

export const logDebug = (message: string, data?: any) => {
  logger.debug('General', message, data ? { data } : undefined);
};

// Category-specific loggers
export const authLog = {
  info: (message: string, data?: any) => logger.info('Auth', message, data ? { data } : undefined),
  warn: (message: string, data?: any) => logger.warn('Auth', message, data ? { data } : undefined),
  error: (message: string, error?: Error, data?: any) => 
    logger.error('Auth', message, error, data ? { data } : undefined),
};

export const migrationLog = {
  info: (message: string, data?: any) => logger.info('Migration', message, data ? { data } : undefined),
  warn: (message: string, data?: any) => logger.warn('Migration', message, data ? { data } : undefined),
  error: (message: string, error?: Error, data?: any) => 
    logger.error('Migration', message, error, data ? { data } : undefined),
};

export const apiLog = {
  info: (message: string, data?: any) => logger.info('API', message, data ? { data } : undefined),
  warn: (message: string, data?: any) => logger.warn('API', message, data ? { data } : undefined),
  error: (message: string, error?: Error, data?: any) => 
    logger.error('API', message, error, data ? { data } : undefined),
};

export const crmLog = {
  info: (message: string, data?: any) => logger.info('CRM', message, data ? { data } : undefined),
  warn: (message: string, data?: any) => logger.warn('CRM', message, data ? { data } : undefined),
  error: (message: string, error?: Error, data?: any) => 
    logger.error('CRM', message, error, data ? { data } : undefined),
};

export const securityLog = {
  info: (message: string, data?: any) => logger.info('Security', message, data ? { data } : undefined),
  warn: (message: string, data?: any) => logger.warn('Security', message, data ? { data } : undefined),
  error: (message: string, error?: Error, data?: any) => 
    logger.error('Security', message, error, data ? { data } : undefined),
};