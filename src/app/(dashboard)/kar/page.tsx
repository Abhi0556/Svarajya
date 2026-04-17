'use client';
import { useRouter } from 'next/navigation';

export default function KarPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[var(--color-rajya-bg)] p-4 pb-24 flex flex-col items-center justify-center text-center">
      <div className="text-5xl mb-4">📝</div>
      <h1 className="text-xl font-bold text-amber-300 font-cinzel mb-2">Tax</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/40 text-sm mt-6">
        🚧 Coming Soon
      </div>
      <button onClick={() => router.back()} className="mt-6 text-amber-400/60 text-sm hover:text-amber-400"> Go back</button>
    </div>
  );
}
