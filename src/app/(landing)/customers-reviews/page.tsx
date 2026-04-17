import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Customer Reviews | Svarajya',
  description: 'See what Indian families are saying about Svarajya.',
};

export default function CustomersReviewsPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Voices of Svarajya</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">Real stories from families who have taken charge of their financial kingdoms.</p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm text-center">
          <p className="text-fort-stone/60 italic">Reviews coming soon as we onboard our early families.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
