'use client';

import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!message.trim()) {
      errors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setValidationErrors({});

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Failed to send message. Please try again.');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="temple-line w-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-fort-stone mb-4">Contact Us</h1>
          <p className="text-fort-stone/70 text-lg max-w-2xl mx-auto">We would love to hear from you. Reach out to our team.</p>
        </div>

        {success ? (
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200 shadow-sm space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-fort-stone mb-2">Message Sent!</h2>
              <p className="text-fort-stone/70">Thank you for reaching out. We will get back to you as soon as possible.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card-white rounded-2xl p-8 border border-parchment-dark/20 shadow-sm space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-fort-stone mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-colors bg-parchment focus:outline-none ${
                  validationErrors.name
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-parchment-dark/30 focus:border-mudra-gold'
                }`}
                placeholder="Arjun Sharma"
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fort-stone mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-colors bg-parchment focus:outline-none ${
                  validationErrors.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-parchment-dark/30 focus:border-mudra-gold'
                }`}
                placeholder="arjun@example.com"
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-fort-stone mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-colors bg-parchment focus:outline-none resize-none ${
                  validationErrors.message
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-parchment-dark/30 focus:border-mudra-gold'
                }`}
                placeholder="Tell us how we can help..."
              />
              {validationErrors.message && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-svarajya-blue text-white font-medium hover:bg-svarajya-blue/90 disabled:bg-svarajya-blue/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
