'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ErrorThreadStateProps = {
  error?: string;
  onRetry: () => void;
};

/**
 * ErrorThreadState Component
 * Displays when thread fetch fails with retry mechanism
 *
 * Acceptance Criteria:
 * - AC #3: Error states styled and helpful (failed to load threads)
 * - AC #4: Error states have retry mechanisms
 */
export function ErrorThreadState({ error = 'Failed to load threads', onRetry }: ErrorThreadStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h3 className="text-base font-semibold">Unable to load threads</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {error}
        . Please try again.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="mt-6 gap-2"
        size="sm"
      >
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
