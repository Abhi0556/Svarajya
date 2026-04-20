'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, Loader2, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const supabase = createClient();

  // Check if user has a valid session (from reset email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, [supabase]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Validate passwords
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setValidationErrors(pwdErrors);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/start');
      }, 2000);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Failed to reset password. Please try again.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Password</h1>
          <p className="text-gray-400">Enter a new password for your account.</p>
        </div>

        {/* Form */}
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-mudra-gold" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-mudra-gold transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-mudra-gold" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-mudra-gold transition-colors"
                />
              </div>
            </div>

            {/* Password Requirements */}
            {(password.length > 0 || validationErrors.length > 0) && (
              <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-sm">
                  <li
                    className={`flex items-center gap-2 ${
                      password.length >= 8 ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    <span className="text-xs">✓</span> At least 8 characters
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    <span className="text-xs">✓</span> Contains a number
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    <span className="text-xs">✓</span> Contains a special character
                  </li>
                </ul>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="space-y-2 p-4 bg-red-900/10 border border-red-700/30 rounded-lg">
                {validationErrors.map((err, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{err}</p>
                  </div>
                ))}
              </div>
            )}

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
              disabled={loading || !password || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-mudra-gold to-yellow-400 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
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
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successfully!</h2>
              <p className="text-gray-400">Your password has been updated. Redirecting to login...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
