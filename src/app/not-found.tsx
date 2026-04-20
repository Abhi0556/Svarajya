'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Branding */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mudra-gold to-yellow-400 mb-2">
            404
          </h1>
          <p className="text-xl text-gray-300 font-semibold">Page Not Found</p>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-2">
          <p className="text-gray-400 text-base">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          {/* Home Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-mudra-gold to-yellow-400 text-black font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <Link href="/contact" className="text-mudra-gold hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
