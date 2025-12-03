/* eslint-disable simple-import-sort/imports */
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';
/* eslint-enable simple-import-sort/imports */

import { updateSession } from '@/libs/supabase/middleware';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const protectedPaths = [
  '/dashboard',
  '/onboarding',
  '/chat',
  '/api',
];

function isProtectedRoute(pathname: string): boolean {
  return protectedPaths.some(path => pathname.includes(path));
}

export async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  // Apply internationalization middleware first
  const response = intlMiddleware(request);

  // Update Supabase session cookies on the response
  await updateSession(request, response);

  // Check if route requires authentication
  if (isProtectedRoute(request.nextUrl.pathname)) {
    const supabase = await import('@/libs/supabase/server').then(mod =>
      mod.createClient(request.cookies as any),
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const locale
        = request.nextUrl.pathname.match(/^\/([^/]+)/)?.at(1) ?? '';
      const isLocale = AllLocales.includes(locale as any);
      const localePrefix = isLocale ? `/${locale}` : '';

      const signInUrl = new URL(`${localePrefix}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
