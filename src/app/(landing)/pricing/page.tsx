import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Pricing | Svarajya',
  description: 'Simple, transparent pricing for individuals and families.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Simple Pricing</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">
            One plan. Full access. Built for Indian families who are serious about their financial future.
          </p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm text-center">
          <p className="text-fort-stone/60 italic">Pricing plans coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
