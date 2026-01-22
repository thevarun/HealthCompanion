import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '@/locales/en.json';

import ResetPasswordPage from './page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ locale: 'en' }),
}));

// Mock Supabase client
const mockGetSession = vi.fn();
const mockUpdateUser = vi.fn();
vi.mock('@/libs/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      updateUser: mockUpdateUser,
    },
  }),
}));

// Helper to wrap component with NextIntlClientProvider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};

describe('reset password page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to loading state
    mockGetSession.mockReturnValue(new Promise(() => {}));
  });

  it('renders the loading state initially', () => {
    renderWithIntl(<ResetPasswordPage />);

    expect(screen.getByText(/verifying reset link/i)).toBeInTheDocument();
  });

  it('renders the form when token is valid', async () => {
    // Mock valid session
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { aud: 'recovery' },
        },
      },
      error: null,
    });

    renderWithIntl(<ResetPasswordPage />);

    // Wait for form to appear
    const passwordLabel = await screen.findByLabelText(/new password/i, {}, { timeout: 1000 });

    expect(passwordLabel).toBeInTheDocument();
  });

  it('renders password requirements', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { aud: 'recovery' },
        },
      },
      error: null,
    });

    renderWithIntl(<ResetPasswordPage />);

    const requirements = await screen.findByText(/password requirements/i, {}, { timeout: 1000 });

    expect(requirements).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
  });

  it('renders invalid state when session is missing', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithIntl(<ResetPasswordPage />);

    const invalidTitle = await screen.findByText(/invalid reset link/i, {}, { timeout: 1000 });

    expect(invalidTitle).toBeInTheDocument();
  });

  it('renders invalid state when session audience is not recovery', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { aud: 'authenticated' },
        },
      },
      error: null,
    });

    renderWithIntl(<ResetPasswordPage />);

    const invalidTitle = await screen.findByText(/invalid reset link/i, {}, { timeout: 1000 });

    expect(invalidTitle).toBeInTheDocument();
  });

  it('provides link to forgot-password page from error state', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithIntl(<ResetPasswordPage />);

    const link = await screen.findByRole('link', { name: /request a new reset link/i }, { timeout: 1000 });

    expect(link).toHaveAttribute('href', '/en/forgot-password');
  });
});
