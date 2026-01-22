'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PasswordInput } from '@/components/ui/password-input';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/libs/supabase/client';

type TokenState = 'loading' | 'valid' | 'expired' | 'invalid';

// Redirect delay after successful password reset
const REDIRECT_DELAY_MS = 2000;

const createResetPasswordSchema = (t: ReturnType<typeof useTranslations<'ResetPassword'>>) =>
  z.object({
    password: z
      .string()
      .min(8, t('validation_password_min'))
      .regex(/[A-Z]/, t('validation_password_uppercase'))
      .regex(/[a-z]/, t('validation_password_lowercase'))
      .regex(/\d/, t('validation_password_number')),
    confirmPassword: z.string().min(1, t('validation_confirm_required')),
  }).refine(data => data.password === data.confirmPassword, {
    message: t('error_passwords_match'),
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { toast } = useToast();

  const [tokenState, setTokenState] = useState<TokenState>('loading');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordSchema = createResetPasswordSchema(t);
  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        // Try to differentiate between expired and invalid tokens
        if (error.message.includes('expired') || error.message.includes('Expired')) {
          setTokenState('expired');
        } else {
          setTokenState('invalid');
        }
        return;
      }

      if (!session || session.user.aud !== 'recovery') {
        setTokenState('invalid');
        return;
      }

      setTokenState('valid');
    };

    verifyToken();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        const errorMessage = t('error_update_failed');
        setServerError(errorMessage);
        toast({
          title: t('error_title'),
          description: errorMessage,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // CRITICAL: Sign out to invalidate the recovery session
      // This prevents token reuse attacks
      await supabase.auth.signOut();

      // Success: show success state
      setIsSuccess(true);
      setLoading(false);

      // Show success toast
      toast({
        title: t('success_title'),
        description: t('success_message'),
      });
    } catch {
      const errorMessage = t('error_update_failed');
      setServerError(errorMessage);
      toast({
        title: t('error_title'),
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handle redirect with cleanup on component unmount
  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        router.push(`/${locale}/sign-in`);
      }, REDIRECT_DELAY_MS);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isSuccess, router, locale]);

  // Loading state
  if (tokenState === 'loading') {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100 opacity-50 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-slate-200 opacity-50 blur-[100px]" />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-10">
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <p className="text-slate-600">{t('verifying_token')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenState === 'invalid' || tokenState === 'expired') {
    const isExpired = tokenState === 'expired';

    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100 opacity-50 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-slate-200 opacity-50 blur-[100px]" />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-10">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-100 shadow-lg shadow-red-100/20">
              <KeyRound className="size-6 text-red-600" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">
              {t(isExpired ? 'expired_title' : 'invalid_title')}
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 md:text-base">
              {t(isExpired ? 'expired_message' : 'invalid_message')}
            </p>
          </div>

          {/* Action Button */}
          <Link
            href={`/${locale}/forgot-password`}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98]"
          >
            {t(isExpired ? 'expired_action' : 'invalid_action')}
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100 opacity-50 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-slate-200 opacity-50 blur-[100px]" />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-10">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green-100 shadow-lg shadow-green-100/20">
              <Check className="size-6 text-green-600" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">
              {t('success_title')}
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 md:text-base">
              {t('success_message')}
            </p>
          </div>

          {/* Success Message */}
          <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center text-sm text-green-700">
            {t('success_message')}
          </div>
        </div>
      </div>
    );
  }

  // Form UI (valid token)
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100 opacity-50 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-slate-200 opacity-50 blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-10">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-slate-900/20">
            <KeyRound className="size-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">
            {t('title')}
          </h1>
          <p className="text-sm leading-relaxed text-slate-500 md:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Password Requirements */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">{t('requirements_title')}</p>
          <ul className="space-y-1 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-slate-400" />
              {t('requirement_min_length')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-slate-400" />
              {t('requirement_uppercase')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-slate-400" />
              {t('requirement_lowercase')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-slate-400" />
              {t('requirement_number')}
            </li>
          </ul>
        </div>

        {serverError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 shrink-0 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              {t('password_label')}
            </label>
            <PasswordInput
              id="password"
              placeholder={t('password_placeholder')}
              aria-invalid={!!errors.password}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              {t('confirm_password_label')}
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder={t('confirm_password_placeholder')}
              aria-invalid={!!errors.confirmPassword}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>{t('resetting')}</span>
                  </>
                )
              : t('submit_button')}
          </button>
        </form>
      </div>
    </div>
  );
}
