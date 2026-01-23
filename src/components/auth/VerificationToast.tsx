'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';

export function VerificationToast() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const t = useTranslations('VerifyEmail');

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast({
        title: t('success_message'),
        description: t('message'),
      });

      // Remove query param from URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.delete('verified');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, toast, t]);

  return null;
}
