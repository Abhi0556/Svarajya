import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Contact | Svarajya',
  description: 'Get in touch with the Svarajya team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Contact Us</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">We would love to hear from you. Reach out to our team.</p>
        </div>
        <div className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-fort-stone mb-2">Your Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-parchment-dark/30 bg-parchment focus:outline-none focus:border-mudra-gold transition-colors" placeholder="Arjun Sharma" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fort-stone mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-parchment-dark/30 bg-parchment focus:outline-none focus:border-mudra-gold transition-colors" placeholder="arjun@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fort-stone mb-2">Message</label>
            <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-parchment-dark/30 bg-parchment focus:outline-none focus:border-mudra-gold transition-colors resize-none" placeholder="Tell us how we can help..." />
          </div>
          <button className="w-full py-3 rounded-xl bg-svarajya-blue text-white font-medium hover:bg-svarajya-blue/90 transition-colors">
            Send Message
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
