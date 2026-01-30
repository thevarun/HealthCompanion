'use client';

import { useTranslations } from 'next-intl';

import type { FeedbackEntry } from '@/libs/queries/feedback';

import { FeedbackCard } from './FeedbackCard';

type FeedbackListProps = {
  feedbackItems: FeedbackEntry[];
};

/**
 * FeedbackList Component
 * Renders a list of FeedbackCard components or an empty state.
 */
export function FeedbackList({ feedbackItems }: FeedbackListProps) {
  const t = useTranslations('Admin.Feedback');

  if (feedbackItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="feedback-empty">
        <p className="text-lg font-medium text-muted-foreground">
          {t('noFeedback')}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('noFeedbackDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="feedback-list">
      {feedbackItems.map(item => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </div>
  );
}
