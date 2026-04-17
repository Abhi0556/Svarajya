import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'About Us | Svarajya',
  description: 'Learn about Svarajya — the financial sovereignty platform built for Indian families.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">About Svarajya</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">
            Svarajya is a financial sovereignty platform built for Indian families — helping them gain clarity, control, and confidence over their financial lives.
          </p>
        </div>

        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-fort-stone mb-4">Our Mission</h2>
          <p className="text-fort-stone/70 leading-relaxed">
            We believe every Indian family deserves to be the ruler of their own financial kingdom — their own Svarajya. Our platform gamifies the journey of financial literacy and organization, making it engaging, deeply personal, and culturally rooted.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
