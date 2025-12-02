'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createClient } from '@/libs/supabase/client';

export default function SignOutPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/sign-in');
        router.refresh();
      } catch (error) {
        console.error('Sign out failed', error);
        setError('Failed to sign out');
      }
    };

    signOut();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600">Error</h2>
            <p className="mt-4 text-sm text-gray-600">{error}</p>
            <p className="mt-4">
              <a href="/dashboard" className="text-blue-600 hover:underline">
                Go to Dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Signing out...</h2>
          <div className="mt-4 animate-spin text-4xl">⏳</div>
        </div>
      </div>
    </div>
  );
}
