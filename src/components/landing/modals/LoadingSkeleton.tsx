import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-rajya-blue to-rajya-blue/80 flex items-center justify-center shadow-lg"
        >
          <Shield className="w-10 h-10 text-mudra-gold" />
        </motion.div>
        
        {/* Loading Text */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="font-serif text-xl font-medium text-fort-stone mb-2"
        >
          Preparing Your Svarajya
        </motion.h2>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-parchment-dark rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-mudra-gold"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ width: '50%' }}
          />
        </div>
        
        <p className="text-sm text-fort-stone/50 mt-4">
          Ancient wisdom loading...
        </p>
      </motion.div>
    </div>
  );
}

// Skeleton components for content loading states
export function CardSkeleton() {
  return (
    <div className="bg-card-white rounded-xl p-6 shadow-md border border-parchment-dark/20 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-parchment-dark" />
        <div className="flex-1">
          <div className="h-4 bg-parchment-dark rounded w-1/3 mb-2" />
          <div className="h-3 bg-parchment-dark rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ZoneCardSkeleton() {
  return (
    <div className="bg-card-white rounded-xl p-4 shadow-md border border-parchment-dark/20 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-parchment-dark" />
        <div className="w-12 h-12 rounded-full bg-parchment-dark" />
      </div>
      <div className="h-5 bg-parchment-dark rounded w-2/3 mb-2" />
      <div className="h-3 bg-parchment-dark rounded w-1/2 mb-3" />
      <div className="h-4 bg-parchment-dark rounded w-full" />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="min-h-screen bg-parchment parchment-texture pb-24">
      {/* Header Skeleton */}
      <div className="bg-card-white/80 border-b border-parchment-dark/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-parchment-dark animate-pulse" />
            <div>
              <div className="h-4 bg-parchment-dark rounded w-32 mb-1 animate-pulse" />
              <div className="h-3 bg-parchment-dark rounded w-24 animate-pulse" />
            </div>
          </div>
          <div className="w-24 h-8 rounded-full bg-parchment-dark animate-pulse" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Banner Skeleton */}
        <div className="bg-card-white rounded-2xl shadow-lg p-6 mb-6 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-parchment-dark" />
            <div className="flex-1">
              <div className="h-4 bg-parchment-dark rounded w-24 mb-2" />
              <div className="h-6 bg-parchment-dark rounded w-16" />
            </div>
          </div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ZoneCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Shield,
  action,
  onAction
}: { 
  title: string; 
  description: string; 
  icon?: typeof Shield;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-parchment flex items-center justify-center">
        <Icon className="w-8 h-8 text-fort-stone/30" />
      </div>
      <h3 className="font-serif text-lg font-medium text-fort-stone mb-2">{title}</h3>
      <p className="text-fort-stone/60 text-sm max-w-sm mx-auto mb-4">{description}</p>
      {action && onAction && (
        <button 
          onClick={onAction}
          className="text-rajya-blue text-sm font-medium hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  );
}
