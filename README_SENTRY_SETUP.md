# Sentry Integration Setup for QuillSwitch

Sentry has been successfully integrated into QuillSwitch for comprehensive error monitoring and performance tracking.

## What's Been Implemented

### 1. Sentry Configuration
- **File**: `src/services/sentry/sentryConfig.ts`
- Configured to only send errors in production
- Includes performance monitoring
- Automatic user context tracking
- Filters out non-actionable errors (network issues, browser extensions)

### 2. Global Error Handler Integration
- Enhanced `src/services/errorHandling/globalErrorHandler.ts` to send errors to Sentry
- All QuillSwitch errors now automatically get sent to Sentry with rich context
- Includes error categorization and severity levels

### 3. React Error Boundary Integration
- Updated `src/components/error-handling/AppErrorBoundary.tsx` 
- Component errors are now captured with full stack traces and context
- Includes retry attempts and error recovery information

### 4. Authentication Context Integration
- User login/logout events automatically update Sentry user context
- Helps track errors per user for better debugging

## Next Steps Required

### 1. Get Your Sentry DSN
1. Go to your Sentry project dashboard
2. Navigate to **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
3. Copy your DSN

### 2. Update Configuration
Replace `'YOUR_SENTRY_DSN_HERE'` in `src/services/sentry/sentryConfig.ts` with your actual DSN:

```typescript
dsn: process.env.NODE_ENV === 'production' 
  ? 'https://your-dsn@sentry.io/project-id' // Replace with actual DSN
  : '', // Don't send to Sentry in development
```

### 3. Optional: Use Supabase Secrets (Recommended)
For better security, you can store your Sentry DSN as a Supabase secret:

1. Add your DSN as a Supabase secret named `SENTRY_DSN`
2. Create an edge function to provide the DSN to your frontend
3. Update the configuration to fetch from the edge function

## Features

### Error Monitoring
- **Automatic**: All unhandled errors are captured
- **Manual**: Use `captureError(error, context)` for specific error tracking
- **Context**: Rich error context including user info, page URL, and custom data

### Performance Monitoring
- Page load times
- API response times (via existing monitoring service)
- Memory usage tracking
- Route change tracking

### User Context
- Automatic user identification on login
- User-specific error tracking
- Clear context on logout

### Development vs Production
- Development: Errors logged to console, not sent to Sentry
- Production: Full error reporting and performance monitoring

## Usage Examples

### Manual Error Capture
```typescript
import { captureError, captureMessage } from '@/services/sentry/sentryConfig';

// Capture an error with context
try {
  // Some operation
} catch (error) {
  captureError(error, { 
    operation: 'migration_setup',
    project_id: 'xyz-123' 
  });
}

// Capture a message
captureMessage('Migration completed successfully', 'info');
```

### Set Additional Context
```typescript
import { setSentryContext, setSentryTag } from '@/services/sentry/sentryConfig';

// Add context
setSentryContext('migration', {
  source_crm: 'salesforce',
  destination_crm: 'hubspot',
  record_count: 1500
});

// Add tags
setSentryTag('feature', 'crm_migration');
```

## Error Categories Tracked

1. **Authentication Errors**: Login failures, session issues
2. **CRM Connection Errors**: API failures, OAuth issues
3. **Migration Errors**: Data transfer, mapping failures
4. **Network Errors**: Connection issues, timeouts
5. **Validation Errors**: Input validation, data validation
6. **Component Errors**: React component crashes

## Next Steps
1. Add your Sentry DSN to complete the setup
2. Deploy to production to start receiving error reports
3. Set up Sentry alerts for critical errors
4. Configure Sentry integrations (Slack, email notifications)
5. Use Sentry's performance monitoring to optimize QuillSwitch

Your QuillSwitch platform now has enterprise-level error monitoring and will help you maintain high reliability for your users!