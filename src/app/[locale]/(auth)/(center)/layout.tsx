import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/libs/supabase/server';

export default async function CenteredLayout(props: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
