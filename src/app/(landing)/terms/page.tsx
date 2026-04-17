import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Terms of Service | Svarajya',
  description: 'Read the terms and conditions for using Svarajya.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="temple-line w-24 mb-6" />
          <h1 className="font-serif text-4xl font-bold text-fort-stone mb-4">Terms of Service</h1>
          <p className="text-fort-stone/60 text-sm">Last updated: April 2026</p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm space-y-6">
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">1. Acceptance of Terms</h2>
            <p className="text-fort-stone/70 leading-relaxed">By accessing or using Svarajya, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">2. Use of Service</h2>
            <p className="text-fort-stone/70 leading-relaxed">Svarajya is intended for personal financial management. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">3. Intellectual Property</h2>
            <p className="text-fort-stone/70 leading-relaxed">All content, features, and functionality of Svarajya are the exclusive property of Svarajya and are protected by applicable intellectual property laws.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
