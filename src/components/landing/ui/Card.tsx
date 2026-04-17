'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/landing/cn';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'warning' | 'success' | 'glow';
  onClick?: () => void;
  animate?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  onClick,
  animate = false,
}: CardProps) {
  const variants = {
    default: 'bg-card-white border border-parchment-dark/30',
    warning: 'bg-card-white border-l-4 border-l-matka-clay border-t border-r border-b border-parchment-dark/30',
    success: 'bg-card-white border-l-4 border-l-palm-green border-t border-r border-b border-parchment-dark/30',
    glow: 'bg-card-white border border-mudra-gold zone-complete',
  };

  const Component = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  } : {};

  return (
    <Component
      className={cn(
        'rounded-xl shadow-md p-6',
        variants[variant],
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow duration-200',
        className
      )}
      onClick={onClick}
      {...animateProps}
    >
      {children}
    </Component>
  );
}
