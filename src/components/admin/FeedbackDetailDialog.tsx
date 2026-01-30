'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { STATUS_BADGE_STYLES, TYPE_BADGE_STYLES } from '@/libs/constants/feedbackBadges';
import type { FeedbackEntry } from '@/libs/queries/feedback';

type FeedbackDetailDialogProps = {
  feedback: FeedbackEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * FeedbackDetailDialog Component
 * Shows full feedback details in a dialog with placeholder action buttons.
 */
export function FeedbackDetailDialog({ feedback: item, open, onOpenChange }: FeedbackDetailDialogProps) {
  const t = useTranslations('Admin.Feedback');
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: t('detail.actionComingSoon'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="feedback-detail-dialog">
        <DialogHeader>
          <DialogTitle>{t('detail.title')}</DialogTitle>
          <DialogDescription>
            {item.email || t('anonymous')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type and Status */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground">{t('detail.type')}</span>
              <div className="mt-1">
                <Badge variant={TYPE_BADGE_STYLES[item.type].variant} className={TYPE_BADGE_STYLES[item.type].className}>
                  {t(`types.${item.type}`)}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">{t('detail.status')}</span>
              <div className="mt-1">
                <Badge variant={STATUS_BADGE_STYLES[item.status].variant} className={STATUS_BADGE_STYLES[item.status].className}>
                  {t(`statuses.${item.status}`)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Full Message */}
          <div>
            <span className="text-xs font-medium text-muted-foreground">{t('detail.fullMessage')}</span>
            <p className="mt-1 whitespace-pre-wrap text-sm" data-testid="feedback-full-message">
              {item.message}
            </p>
          </div>

          {/* Submitted by */}
          <div>
            <span className="text-xs font-medium text-muted-foreground">{t('detail.submittedBy')}</span>
            <p className="mt-1 text-sm">{item.email || t('anonymous')}</p>
          </div>

          {/* Timestamps */}
          <div className="flex gap-6">
            <div>
              <span className="text-xs font-medium text-muted-foreground">{t('detail.submittedAt')}</span>
              <p className="mt-1 text-sm">
                {format(new Date(item.createdAt), 'PPpp')}
              </p>
            </div>
            {item.reviewedAt && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">{t('detail.reviewedAt')}</span>
                <p className="mt-1 text-sm">
                  {format(new Date(item.reviewedAt), 'PPpp')}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {item.status === 'pending' && (
            <Button onClick={handleAction} data-testid="mark-reviewed-btn">
              {t('detail.markReviewed')}
            </Button>
          )}
          <Button variant="destructive" onClick={handleAction} data-testid="delete-feedback-btn">
            {t('detail.delete')}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('detail.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
