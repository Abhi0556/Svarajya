'use client';
import { useRouter } from 'next/navigation';

export default function IdentityDocDetailPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[var(--color-rajya-bg)] p-4 pb-24">
      <button onClick={() => router.back()} className="text-amber-400/60 text-sm mb-4 block hover:text-amber-400"> Back</button>
      <div className="text-center mt-8"><div className="text-5xl mb-3"></div><h1 className="text-xl font-bold text-amber-300">Identity Document</h1></div>
    </div>
  );
}
