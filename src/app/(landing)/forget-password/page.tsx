'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Loader2, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    // Validate email
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setSuccess(true);
      setEmail('');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Failed to send reset email. Please try again.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Reset Your Password</h1>
            <p className="text-gray-400">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-mudra-gold" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-mudra-gold transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/10 border border-red-700/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-mudra-gold to-yellow-400 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <p className="text-center text-sm text-gray-400">
                Remember your password?{' '}
                <Link href="/start" className="text-mudra-gold hover:underline">
                  Back to Login
                </Link>
              </p>
            </form>
          ) : (
            // Success Message
            <div className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 mb-4">
                  We've sent a password reset link to <span className="text-mudra-gold font-semibold">{email}</span>
                </p>
                <p className="text-sm text-gray-500">The link will expire in 24 hours.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setError('');
                    setEmail('');
                  }}
                  className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                  Try Another Email
                </button>
                <Link
                  href="/start"
                  className="py-2 px-4 bg-linear-to-r from-mudra-gold to-yellow-400 text-black font-semibold rounded-lg text-center hover:opacity-90 transition-opacity"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
