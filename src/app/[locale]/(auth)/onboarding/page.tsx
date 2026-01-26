import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { OnboardingFeatureTour } from '@/components/onboarding/OnboardingFeatureTour';
import { OnboardingUsername } from '@/components/onboarding/OnboardingUsername';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { userProfiles } from '@/models/Schema';

type Props = {
  searchParams: Promise<{ step?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Onboarding');

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function OnboardingPage({ searchParams }: Props) {
  const params = await searchParams;
  const step = params.step ? Number.parseInt(params.step, 10) : 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify authentication
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/sign-in');
  }

  // Check if onboarding is already completed
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, user.id))
    .limit(1);

  if (profile[0]?.onboardingCompletedAt) {
    redirect('/dashboard');
  }

  // Determine which step to show
  const onboardingStep = profile[0]?.onboardingStep ?? 0;

  // Validate step access (can't skip ahead)
  if (step > onboardingStep + 1) {
    // User trying to skip - redirect to their current step
    redirect(`/onboarding?step=${onboardingStep + 1}`);
  }

  // Render appropriate component
  switch (step) {
    case 2:
      return <OnboardingFeatureTour />;
    case 1:
    default:
      return <OnboardingUsername />;
  }
}
