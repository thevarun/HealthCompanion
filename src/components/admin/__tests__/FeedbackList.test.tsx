import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FeedbackEntry } from '@/libs/queries/feedback';

import { FeedbackList } from '../FeedbackList';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => {
      const translations: Record<string, string> = {
        'noFeedback': 'No feedback yet',
        'noFeedbackDescription': 'Feedback submissions will appear here once users start providing feedback.',
        'types.bug': 'Bug',
        'types.feature': 'Feature',
        'statuses.pending': 'Pending',
        'statuses.reviewed': 'Reviewed',
        'anonymous': 'Anonymous',
      };
      return translations[key] || key;
    };
    return t;
  },
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '3 hours ago',
}));

// Mock FeedbackDetailDialog to avoid Dialog complexity
vi.mock('../FeedbackDetailDialog', () => ({
  FeedbackDetailDialog: () => null,
}));

const mockFeedbackItems: FeedbackEntry[] = [
  {
    id: 'fb-1',
    type: 'bug',
    message: 'Bug report message',
    email: 'user1@example.com',
    status: 'pending',
    userId: 'user-1',
    createdAt: new Date('2026-01-29T12:00:00Z'),
    reviewedAt: null,
  },
  {
    id: 'fb-2',
    type: 'feature',
    message: 'Feature request message',
    email: null,
    status: 'reviewed',
    userId: null,
    createdAt: new Date('2026-01-28T10:00:00Z'),
    reviewedAt: new Date('2026-01-29T08:00:00Z'),
  },
];

describe('FeedbackList', () => {
  it('renders feedback cards', () => {
    render(<FeedbackList feedbackItems={mockFeedbackItems} />);

    expect(screen.getByTestId('feedback-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('feedback-card')).toHaveLength(2);
  });

  it('shows empty state when no feedback', () => {
    render(<FeedbackList feedbackItems={[]} />);

    expect(screen.getByTestId('feedback-empty')).toBeInTheDocument();
    expect(screen.getByText('No feedback yet')).toBeInTheDocument();
    expect(screen.getByText('Feedback submissions will appear here once users start providing feedback.')).toBeInTheDocument();
  });
});
