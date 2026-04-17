'use client';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-parchment pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/landing" className="text-mudra-gold hover:underline mb-6 inline-block">
          ← Back to landing
        </Link>
        <h1 className="font-serif text-4xl font-bold text-fort-stone mb-4">Features</h1>
        <p className="text-fort-stone/70">This page will be implemented soon. Check back later!</p>
      </div>
    </div>
  );
}
