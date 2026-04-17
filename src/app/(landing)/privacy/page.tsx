import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Privacy Policy | Svarajya',
  description: 'How Svarajya collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="temple-line w-24 mb-6" />
          <h1 className="font-serif text-4xl font-bold text-fort-stone mb-4">Privacy Policy</h1>
          <p className="text-fort-stone/60 text-sm">Last updated: April 2026</p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm space-y-6">
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">1. Information We Collect</h2>
            <p className="text-fort-stone/70 leading-relaxed">We collect information you provide directly when you create an account, complete your financial profile, or interact with our services.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">2. How We Use Your Data</h2>
            <p className="text-fort-stone/70 leading-relaxed">Your data is used solely to provide you with the Svarajya experience. We never sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">3. Local-First Architecture</h2>
            <p className="text-fort-stone/70 leading-relaxed">Svarajya uses a local-first vault system. Sensitive documents remain on your device unless you explicitly choose to back them up to the cloud.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
