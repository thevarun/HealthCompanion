import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/libs/supabase/server';

import SignInFormClient from './SignInFormClient';

export default async function SignInPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Server-side auth check - redirect authenticated users to dashboard
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  return <SignInFormClient />;
}
