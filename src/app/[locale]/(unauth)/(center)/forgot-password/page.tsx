'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createClient } from '@/libs/supabase/client';

const createForgotPasswordSchema = (t: ReturnType<typeof useTranslations<'ForgotPassword'>>) =>
  z.object({
    email: z.string().min(1, t('validation_email_required')).email(t('validation_email_invalid')),
  });

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword');
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const forgotPasswordSchema = createForgotPasswordSchema(t);
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Configure redirect URL for password reset
      const redirectTo = `${window.location.origin}/${locale}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });

      if (error) {
        // Only show errors for rate limiting or network issues
        // Do NOT show "email not found" errors (security)
        if (error.message.includes('rate') || error.message.includes('too many')) {
          setServerError(t('error_rate_limit'));
        } else if (error.message.includes('Network') || error.message.includes('network')) {
          setServerError(t('error_network'));
        } else {
          // For any other error, show generic network error
          // This prevents email enumeration attacks
          setServerError(t('error_network'));
        }
        setLoading(false);
        return;
      }

      // Success: transition to success state
      // Show SAME message regardless of whether email exists (security)
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      setLoading(false);
    } catch {
      setServerError(t('error_network'));
      setLoading(false);
    }
  };

  // Success state UI
  if (isSubmitted) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 p-4">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
          <div className="p-8 sm:p-10">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="size-8 text-green-600" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t('success_title')}
              </h1>
              <p className="mt-3 text-slate-600">
                {t('success_message')}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {t('success_email_sent_to')}
                {' '}
                <span className="font-medium text-slate-700">{submittedEmail}</span>
              </p>
            </div>

            {/* Additional Note */}
            <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                {t('success_note')}
              </p>
            </div>

            {/* Back to Sign In */}
            <Link
              href={`/${locale}/sign-in`}
              className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('back_to_sign_in')}
            </Link>
          </div>

          {/* Decorative bottom bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 opacity-80" />
        </div>
      </div>
    );
  }

  // Form UI
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 p-4">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] size-2/5 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] size-2/5 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
      </div>

      {/* Back to Sign In Link */}
      <div className="absolute left-6 top-6 z-10">
        <Link
          href={`/${locale}/sign-in`}
          className="group flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <div className="mr-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition-all group-hover:border-slate-300">
            <ArrowLeft className="size-4" />
          </div>
          {t('back_to_sign_in')}
        </Link>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {t('title')}
            </h1>
            <p className="mt-2 text-slate-600">
              {t('subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
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

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-slate-700">
                {t('email_label')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors.email}
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="-ml-1 mr-2 size-5 animate-spin" />
                      {t('sending')}
                    </span>
                  )
                : t('submit_button')}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-500">
                  {t('remembered_password')}
                </span>
              </div>
            </div>

            <Link
              href={`/${locale}/sign-in`}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-center font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              {t('back_to_sign_in')}
            </Link>
          </form>
        </div>

        {/* Decorative bottom bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 opacity-80" />
      </div>
    </div>
  );
}
