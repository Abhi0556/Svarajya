import { motion } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConsentModalProps {
  onAccept: () => void;
}

export function ConsentModal({ onAccept }: ConsentModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-fort-stone/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-svarajya-blue/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-svarajya-blue" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="font-serif text-2xl font-semibold text-fort-stone text-center mb-4">
            Welcome to Svarajya
          </h2>
          
          <p className="text-fort-stone/70 text-center mb-6">
            Before you begin your governance journey, please review how we protect your data.
          </p>
          
          {/* Trust Points */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-palm-green/10 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-palm-green" />
              </div>
              <div>
                <p className="font-medium text-fort-stone text-sm">Encrypted & Secure</p>
                <p className="text-xs text-fort-stone/60">Your data is encrypted at rest and in transit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-svarajya-blue/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-svarajya-blue" />
              </div>
              <div>
                <p className="font-medium text-fort-stone text-sm">Privacy by Design</p>
                <p className="text-xs text-fort-stone/60">We never sell your data to third parties</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-mudra-gold/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-mudra-gold" />
              </div>
              <div>
                <p className="font-medium text-fort-stone text-sm">GDPR Compliant</p>
                <p className="text-xs text-fort-stone/60">Your rights are respected and protected</p>
              </div>
            </div>
          </div>
          
          {/* Action */}
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={onAccept}
          >
            I Understand & Accept
          </Button>
          
          <p className="text-xs text-fort-stone/50 text-center mt-4">
            <a href="/landing/privacy" className="underline hover:text-fort-stone">Privacy Policy</a>
            {' '} • {' '}
            <a href="/landing/terms" className="underline hover:text-fort-stone">Terms of Service</a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
