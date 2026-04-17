import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface RoyalSealModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export function RoyalSealModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}: RoyalSealModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-fort-stone/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-card-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            {/* Seal Icon */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <motion.div
                initial={{ scale: 2, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-24 h-24 rounded-full bg-linear-to-br from-mudra-gold to-yellow-600 flex items-center justify-center shadow-lg"
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-palm-green rounded-full flex items-center justify-center shadow-md"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Decorative line */}
            <div className="temple-line w-full mb-6" />

            <h3 className="font-serif text-2xl font-semibold text-fort-stone mb-3">
              {title}
            </h3>
            <p className="text-fort-stone/70 mb-8 leading-relaxed">
              {message}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Not Yet
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                onClick={onConfirm}
              >
                Apply Royal Seal
              </Button>
            </div>

            <p className="text-xs text-fort-stone/50 mt-4">
              Your consent is required to proceed.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
