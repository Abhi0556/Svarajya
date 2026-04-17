import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Careers | Svarajya',
  description: 'Join our mission to bring financial sovereignty to every Indian family.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Join Our Kingdom</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">Help us build the financial sovereignty platform that every Indian family deserves.</p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm text-center">
          <p className="text-fort-stone/60 italic">No open positions at the moment. We are building in stealth. Stay tuned.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
