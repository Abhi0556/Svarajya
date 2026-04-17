import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Security | Svarajya',
  description: 'How Svarajya keeps your financial data secure.',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Security at Svarajya</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">Your financial data deserves royal protection. Here is how we keep your Svarajya safe.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'End-to-End Encryption', desc: 'All data in transit and at rest is encrypted using AES-256 standard.' },
            { title: 'Local-First Vault', desc: 'Sensitive documents stay on your device. Cloud backup is always opt-in.' },
            { title: 'Row-Level Security', desc: 'Database-level policies ensure you can only access your own data.' },
            { title: 'Audit Logs', desc: 'Every login and data change is logged for your transparency and security.' },
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
