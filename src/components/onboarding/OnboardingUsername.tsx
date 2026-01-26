'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUsernameValidation } from '@/hooks/useUsernameValidation';

import { ProgressIndicator } from './ProgressIndicator';
import { UsernameInput } from './UsernameInput';

const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Username must contain only lowercase letters, numbers, and underscores'),
});

type UsernameFormData = z.infer<typeof usernameFormSchema>;

export function OnboardingUsername() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
    mode: 'onChange',
  });

  const username = watch('username', '');
  const validation = useUsernameValidation(username);

  const onSubmit = async (data: UsernameFormData) => {
    if (!validation.isValid || !validation.isAvailable) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile/update-username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your username has been saved',
        });
        router.push('/onboarding?step=2');
      } else {
        toast({
          title: 'Error',
          description: result.error || t('errorSaving'),
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: t('errorNetwork'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = validation.isValid && validation.isAvailable && !validation.isChecking;

  const handleSkip = () => {
    router.push('/onboarding?step=2');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-100/50 bg-white p-8 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 md:p-10">
        {/* Progress */}
        <ProgressIndicator currentStep={1} totalSteps={3} />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('step1Title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('step1Description')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <UsernameInput
            {...register('username')}
            value={username}
            onChange={(value) => {
              const event = { target: { value, name: 'username' } };
              register('username').onChange(event);
            }}
            isValid={validation.isValid}
            isAvailable={validation.isAvailable}
            error={validation.error}
            isChecking={validation.isChecking}
          />

          <div className="space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full gap-2 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              disabled={!isFormValid || isSubmitting}
            >
              <span>{isSubmitting ? t('saving') : t('continue')}</span>
              <ArrowRight className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={handleSkip}
            >
              {t('skipForNow')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
