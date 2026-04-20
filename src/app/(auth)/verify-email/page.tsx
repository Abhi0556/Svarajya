'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, RefreshCw, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const supabase = createClient();

  // Extract email from URL params
  useEffect(() => {
    const emailParam = searchParams.get('email') || '';
    setEmail(emailParam);
  }, [searchParams]);

  // Check for email confirmation token in URL
  useEffect(() => {
    const checkToken = async () => {
      const hash = window.location.hash;
      if (hash.includes('type=recovery') || hash.includes('type=magiclink')) {
        // Email has been verified
        setVerified(true);
        setTimeout(() => {
          router.push('/onboarding/intro');
        }, 3000);
      }
    };
    checkToken();
  }, [router]);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setError('Email address is missing. Please try again.');
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (resendError) throw resendError;

      setResendMessage('Verification email resent! Please check your inbox.');
      setTimeout(() => {
        setResendMessage('');
      }, 5000);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Failed to resend email. Please try again.');
      } else {
        setError('Failed to resend email. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Email Verified!</h1>
            <p className="text-gray-400">Your email has been successfully verified. Redirecting to onboarding...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-mudra-gold/10 rounded-full flex items-center justify-center">
              <Mail className="w-7 h-7 text-mudra-gold" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400">We've sent a verification link to your inbox.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-900/10 border border-red-700/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {resendMessage && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-green-900/10 border border-green-700/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <p className="text-green-400 text-sm">{resendMessage}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 space-y-6 mb-6">
          <div className="space-y-3">
            <p className="text-gray-300 text-center">
              Check your email at <span className="text-mudra-gold font-semibold">{email || 'your email'}</span>
            </p>
            <p className="text-sm text-gray-500 text-center">
              Click the verification link in the email to continue. The link will expire in 24 hours.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 pt-4 border-t border-slate-600">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-mudra-gold/20 flex items-center justify-center text-sm font-semibold text-mudra-gold">
                1
              </div>
              <p className="text-sm text-gray-400">Check your email inbox</p>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-mudra-gold/20 flex items-center justify-center text-sm font-semibold text-mudra-gold">
                2
              </div>
              <p className="text-sm text-gray-400">Click the verification link from Svarajya</p>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-mudra-gold/20 flex items-center justify-center text-sm font-semibold text-mudra-gold">
                3
              </div>
              <p className="text-sm text-gray-400">Complete your onboarding</p>
            </div>
          </div>
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResendEmail}
          disabled={resendLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
        >
          {resendLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Resend Verification Email
            </>
          )}
        </button>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-400">
          <p>
            No email received?{' '}
            <button
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="text-mudra-gold hover:underline disabled:opacity-50"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
