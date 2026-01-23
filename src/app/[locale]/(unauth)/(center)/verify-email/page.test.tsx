import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '@/locales/en.json';

import VerifyEmailPage from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock Supabase client
const mockResend = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/libs/supabase/client', () => ({
  createClient: () => ({
    auth: {
      resend: mockResend,
      getUser: mockGetUser,
    },
  }),
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

function renderWithIntl(component: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
}

describe('VerifyEmailPage', () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({ locale: 'en' });
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as Mock).mockReturnValue({
      get: mockGet,
    });
    mockGetUser.mockResolvedValue({
      data: { user: { email: 'test@example.com', email_confirmed_at: null } },
      error: null,
    });
    localStorage.clear();
  });

  it('renders verify email page with email from URL params', async () => {
    mockGet.mockReturnValue('test@example.com');

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(screen.getAllByText(/check your email/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/we sent a verification link to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click to resend email/i })).toBeInTheDocument();
  });

  it('fetches email from user session if not in URL', async () => {
    mockGet.mockReturnValue(null);
    mockGetUser.mockResolvedValue({
      data: { user: { email: 'session@example.com', email_confirmed_at: null } },
      error: null,
    });

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('session@example.com')).toBeInTheDocument();
    });
  });

  it('redirects to dashboard if user is already verified', async () => {
    mockGet.mockReturnValue(null);
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          email: 'verified@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z',
        },
      },
      error: null,
    });

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/dashboard');
    });
  });

  it('calls resend API when button is clicked', async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue('test@example.com');
    mockResend.mockResolvedValue({ error: null });

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /click to resend email/i })).toBeInTheDocument();
    });

    const resendButton = screen.getByRole('button', { name: /click to resend email/i });
    await user.click(resendButton);

    await waitFor(() => {
      expect(mockResend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      });
    });
  });

  it('shows error toast when resend fails', async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue('test@example.com');
    mockResend.mockResolvedValue({
      error: { message: 'Rate limit exceeded' },
    });

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /click to resend email/i })).toBeInTheDocument();
    });

    const resendButton = screen.getByRole('button', { name: /click to resend email/i });
    await user.click(resendButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: expect.any(String),
        description: expect.any(String),
        variant: 'destructive',
      });
    });
  });

  it('restores cooldown from localStorage on mount', async () => {
    mockGet.mockReturnValue('test@example.com');

    // Set cooldown in localStorage that expires in 30 seconds
    const futureTime = Date.now() + 30000;
    localStorage.setItem('email_resend_cooldown_test@example.com', futureTime.toString());

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /resend in \d+s/i });

      expect(button).toBeDisabled();
    });
  });

  it('enables button when cooldown has expired', async () => {
    mockGet.mockReturnValue('test@example.com');

    // Set cooldown that expires in the past (already expired)
    const pastTime = Date.now() - 1000;
    localStorage.setItem('email_resend_cooldown_test@example.com', pastTime.toString());

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /click to resend email/i });

      expect(button).toBeEnabled();
    });
  });

  it('shows loading spinner while checking user', () => {
    mockGet.mockReturnValue(null);
    mockGetUser.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithIntl(<VerifyEmailPage />);

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('disables button when email is not available', async () => {
    mockGet.mockReturnValue(null);
    mockGetUser.mockResolvedValue({
      data: { user: { email: '', email_confirmed_at: null } },
      error: null,
    });

    renderWithIntl(<VerifyEmailPage />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /click to resend email/i });

      expect(button).toBeDisabled();
    });
  });
});
