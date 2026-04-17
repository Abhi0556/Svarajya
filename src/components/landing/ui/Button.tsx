'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/landing/cn';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  variant = 'gold',
  size = 'md',
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-parchment disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  
  const variants = {
    gold: 'bg-mudra-gold text-white hover:brightness-110 focus:ring-mudra-gold shadow-md hover:shadow-lg gold-button-shimmer',
    outline: 'border-2 border-svarajya-blue text-svarajya-blue hover:bg-svarajya-blue hover:text-white focus:ring-svarajya-blue',
    ghost: 'text-svarajya-blue hover:bg-svarajya-blue/10 focus:ring-svarajya-blue',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'gold' && !disabled && (
        <motion.span 
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="absolute inset-0 gold-shimmer opacity-20" />
        </motion.span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
