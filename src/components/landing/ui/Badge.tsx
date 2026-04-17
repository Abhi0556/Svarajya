'use client';

import { motion } from 'framer-motion';
import { Crown, Footprints, Shield, Star, Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/landing/cn';

interface BadgeProps {
  name?: string;
  icon: string;
  earned?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const iconMap: Record<string, typeof Crown> = {
  Crown,
  Footprints,
  Shield,
  Star,
  Trophy,
  Award,
};

export function Badge({
  icon,
  earned = false,
  className,
  size = 'md',
  animate = false,
}: BadgeProps) {
  const Icon = iconMap[icon] || Star;
  
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };
  
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <motion.div
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={animate ? { scale: 1, rotate: 0 } : false}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={cn(
        'relative flex items-center justify-center rounded-full',
        sizes[size],
        earned ? 'bg-linear-to-br from-mudra-gold to-yellow-600 badge-glow' : 'bg-parchment-dark',
        className
      )}
    >
      <Icon 
        size={iconSizes[size]} 
        className={earned ? 'text-white' : 'text-fort-stone/30'}
      />
      {earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-palm-green rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

export function BadgeUnlockModal({
  badge,
  onClose,
}: {
  badge: { name: string; description: string; icon: string };
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-fort-stone/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-card-white rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-mudra-gold uppercase tracking-wider mb-4"
        >
          Badge Unlocked!
        </motion.div>
        
        <div className="flex justify-center mb-6">
          <Badge name={badge.name} icon={badge.icon} earned animate size="lg" />
        </div>
        
        <h3 className="font-serif text-2xl font-semibold text-fort-stone mb-2">
          {badge.name}
        </h3>
        <p className="text-fort-stone/70 mb-6">{badge.description}</p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-3 bg-mudra-gold text-white rounded-xl font-medium"
        >
          Continue Your Journey
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
