import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Partner With Us | Svarajya',
  description: 'Explore partnership opportunities with Svarajya.',
};

export default function PartnerWithUsPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Partner With Us</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">Banks, NBFCs, wealth managers, and financial advisors — let us build together.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Financial Institutions', desc: 'Integrate Svarajya with your existing banking and investment products.' },
            { title: 'Wealth Managers', desc: 'Give your clients a unified view of their financial life.' },
            { title: 'Chartered Accountants', desc: 'Help your clients organize and secure their documents with our vault.' },
            { title: 'Corporates', desc: 'Offer Svarajya as an employee financial wellness benefit.' },
          ].map((item) => (
            <div key={item.title} className="bg-card-white rounded-2xl p-6 border border-parchment-dark/20 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-fort-stone mb-3">{item.title}</h2>
              <p className="text-fort-stone/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
