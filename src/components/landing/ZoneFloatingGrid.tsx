import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Droplets,
  Swords,
  Landmark,
  Users,
  FileText,
  X,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useLanguage } from '@/context/landing/LanguageContext'

// ============================================
// TYPES
// ============================================

interface ZoneContent {
  id: string
  name: string
  subtitle: string
  icon: React.ElementType
  color: string
  summary: string
  opening: string
  governs: string[]
  strengthens: string[]
  closing: string
}

// ============================================
// ZONE DATA (Static IDs + Icons + Colors only)
// ============================================

interface ZoneBase {
  id: string
  icon: React.ElementType
  color: string
}

const ZONE_CONFIG: ZoneBase[] = [
  { id: 'raksha', icon: Shield, color: '#4C6B4E' },
  { id: 'vyaya', icon: Droplets, color: '#B56A3F' },
  { id: 'rin', icon: Swords, color: '#8B4513' },
  { id: 'kosh', icon: Landmark, color: '#C6A24F' },
  { id: 'mitra', icon: Users, color: '#2F6F73' },
  { id: 'granthagaar', icon: FileText, color: '#1F3A5F' },
]

// Hook to get translated zone content
const useZoneContent = () => {
  const { t, tArray } = useLanguage()

  return ZONE_CONFIG.map((zone) => ({
    ...zone,
    name: t(`solution.zones.${zone.id}.name`),
    subtitle: t(`solution.zones.${zone.id}.subtitle`),
    summary: t(`solution.zones.${zone.id}.summary`),
    opening: t(`solution.zones.${zone.id}.opening`),
    governs: tArray(`solution.zones.${zone.id}.governs`),
    strengthens: tArray(`solution.zones.${zone.id}.strengthens`),
    closing: t(`solution.zones.${zone.id}.closing`),
  }))
}

// ============================================
// ANIMATION CONFIG - Premium & Smooth
// ============================================

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ============================================
// SCROLL LOCK HOOK - No jumping
// ============================================

const useScrollLock = (isLocked: boolean) => {
  const scrollRef = useRef<number>(0)

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollRef.current = window.scrollY

      // Prevent scroll without moving body
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    } else {
      // Restore scroll
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isLocked])
}

// ============================================
// ZONE CARD (Grid Item) - Clean Design with layoutId
// ============================================

interface ZoneCardProps {
  zone: ZoneContent
  isExpanded: boolean
  isAnyExpanded: boolean
  onExpand: () => void
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, isExpanded, isAnyExpanded, onExpand }) => {
  const Icon = zone.icon

  return (
    <motion.div
      layoutId={`zone-card-${zone.id}`}
      className="bg-white rounded-2xl p-6 cursor-pointer relative overflow-hidden border border-gray-100"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        visibility: isExpanded ? 'hidden' : 'visible',
      }}
      whileHover={
        !isAnyExpanded
          ? {
              scale: 1.02,
              y: -4,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            }
          : {}
      }
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      onClick={onExpand}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${zone.color}12` }}
      >
        <Icon className="w-7 h-7" style={{ color: zone.color }} />
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-semibold text-fort-stone mb-1">{zone.name}</h3>
      <p className="text-sm text-fort-stone/50 mb-3">{zone.subtitle}</p>

      {/* Summary */}
      <p className="text-sm text-fort-stone/70 leading-relaxed mb-4">{zone.summary}</p>

      {/* Click indicator */}
      <div className="flex items-center gap-2 text-xs text-fort-stone/40 group-hover:text-fort-stone/60 transition-colors">
        <span>Click to explore</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  )
}

// ============================================
// EXPANDED MODAL with layoutId - Animates to/from card
// ============================================

interface ExpandedModalProps {
  zone: ZoneContent
  onClose: () => void
  ctaText: string
}

const ExpandedModal: React.FC<ExpandedModalProps> = ({ zone, onClose, ctaText }) => {
  const Icon = zone.icon

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Floating Card - Uses layoutId to animate from grid card */}
      <motion.div
        layoutId={`zone-card-${zone.id}`}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl relative"
        style={{
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
        }}
        transition={springConfig}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content container - hidden scrollbar */}
        <motion.div
          className="p-6 md:p-8 overflow-y-auto hide-scrollbar"
          style={{
            maxHeight: '80vh',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${zone.color}12` }}
                layoutId={`zone-icon-${zone.id}`}
                transition={springConfig}
              >
                <Icon className="w-8 h-8" style={{ color: zone.color }} />
              </motion.div>

              {/* Title */}
              <div>
                <motion.h2
                  className="font-serif text-2xl font-semibold text-fort-stone"
                  layoutId={`zone-title-${zone.id}`}
                  transition={springConfig}
                >
                  {zone.name}
                </motion.h2>
                <motion.p
                  className="text-sm text-fort-stone/50"
                  layoutId={`zone-subtitle-${zone.id}`}
                  transition={springConfig}
                >
                  {zone.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.15 }}
            >
              <X className="w-5 h-5 text-fort-stone/50" />
            </motion.button>
          </div>
          {/* Summary */}
          <motion.p
            className="text-base text-fort-stone/70 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {zone.summary}
          </motion.p>
          {/* Opening quote */}
          <motion.div
            className="py-4 px-5 rounded-xl mb-6"
            style={{ backgroundColor: `${zone.color}08` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <p className="font-serif text-lg italic text-fort-stone/80 leading-relaxed">
              "{zone.opening}"
            </p>
          </motion.div>
          {/* Divider */}
          <motion.div
            className="h-px bg-gray-100 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
          {/* Two column content */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            {/* What This Area Governs */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-fort-stone mb-4">
                What This Area Governs
              </h4>
              <ul className="space-y-3">
                {zone.governs.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05, duration: 0.2 }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${zone.color}15` }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                    </div>
                    <span className="text-sm text-fort-stone/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* How Svarajya Strengthens It */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-fort-stone mb-4">
                How Svarajya Strengthens It
              </h4>
              <ul className="space-y-3">
                {zone.strengthens.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + idx * 0.05, duration: 0.2 }}
                  >
                    <CheckCircle2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: zone.color }}
                    />
                    <span className="text-sm text-fort-stone/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          {/* Divider */}
          <motion.div
            className="h-px bg-gray-100 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
          {/* Closing quote */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            <div className="w-1 h-12 rounded-full" style={{ backgroundColor: zone.color }} />
            <p className="font-serif text-base italic text-fort-stone/70">"{zone.closing}"</p>
          </motion.div>
          {/* CTA Button */}
          <motion.a
            href="/register"
            className="w-full py-4 rounded-xl font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] block text-center"
            style={{
              backgroundColor: '#C6A24F',
              boxShadow: '0 4px 12px rgba(198, 162, 79, 0.3)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {ctaText}
          </motion.a>{' '}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// BACKDROP COMPONENT
// ============================================

const Backdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.div
    className="fixed inset-0 z-40"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: easeOutExpo }}
    onClick={onClick}
    style={{
      backgroundColor: 'rgba(31, 58, 95, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}
  />
)

// ============================================
// MOBILE ACCORDION CARD - Clean Design
// ============================================

interface MobileCardProps {
  zone: ZoneContent
  isExpanded: boolean
  onToggle: () => void
  ctaText: string
}

const MobileCard: React.FC<MobileCardProps> = ({ zone, isExpanded, onToggle, ctaText }) => {
  const Icon = zone.icon

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header - Always visible, clickable */}
      <button className="w-full p-5 flex items-center justify-between text-left" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${zone.color}12` }}
          >
            <Icon className="w-6 h-6" style={{ color: zone.color }} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-fort-stone">{zone.name}</h3>
            <p className="text-xs text-fort-stone/50">{zone.subtitle}</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <ChevronDown className="w-5 h-5 text-fort-stone/40" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.28,
              ease: 'easeOut',
            }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {/* Summary */}
              <p className="text-sm text-fort-stone/70 mb-4">{zone.summary}</p>

              {/* Opening quote */}
              <div
                className="py-3 px-4 rounded-lg mb-4"
                style={{ backgroundColor: `${zone.color}08` }}
              >
                <p className="font-serif text-sm italic text-fort-stone/80">"{zone.opening}"</p>
              </div>

              {/* What This Area Governs */}
              <div className="mb-4">
                <h4 className="font-serif text-sm font-semibold text-fort-stone mb-3">
                  What This Area Governs
                </h4>
                <ul className="space-y-2">
                  {zone.governs.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-sm text-fort-stone/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How Svarajya Strengthens It */}
              <div className="mb-4">
                <h4 className="font-serif text-sm font-semibold text-fort-stone mb-3">
                  How Svarajya Strengthens It
                </h4>
                <ul className="space-y-2">
                  {zone.strengthens.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: zone.color }} />
                      <span className="text-sm text-fort-stone/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Closing quote */}
              <p className="font-serif text-sm italic text-fort-stone/60 mb-4">"{zone.closing}"</p>

              {/* CTA Button */}
              <button
                className="w-full py-3 rounded-xl font-medium text-white text-sm active:scale-[0.98] transition-transform"
                style={{
                  backgroundColor: '#C6A24F',
                }}
              >
                {ctaText}
              </button>

              {/* Close hint */}
              <p className="text-center text-xs text-fort-stone/30 mt-3">Tap header to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// MAIN COMPONENT: ZoneFloatingGrid
// ============================================

const ZoneFloatingGrid: React.FC = () => {
  const [expandedZone, setExpandedZone] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useLanguage()

  // Get translated zones
  const zones = useZoneContent()

  // Check viewport size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Lock scroll when modal is open (no jumping!)
  useScrollLock(expandedZone !== null && !isMobile)

  // Close handler
  const handleClose = useCallback(() => {
    setExpandedZone(null)
  }, [])

  // Toggle for mobile
  const handleToggle = useCallback((zoneId: string) => {
    setExpandedZone((prev) => (prev === zoneId ? null : zoneId))
  }, [])

  const expandedZoneData = zones.find((z) => z.id === expandedZone)

  return (
    <>
      {/* MOBILE: Accordion Layout */}
      {isMobile ? (
        <div className="space-y-4">
          {zones.map((zone) => (
            <MobileCard
              key={zone.id}
              zone={zone}
              isExpanded={expandedZone === zone.id}
              onToggle={() => handleToggle(zone.id)}
              ctaText={t('solution.cta')}
            />
          ))}
        </div>
      ) : (
        /* DESKTOP: Grid Layout with Floating Modal */
        <>
          {/* Grid - Always maintains structure */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isExpanded={expandedZone === zone.id}
                isAnyExpanded={expandedZone !== null}
                onExpand={() => setExpandedZone(zone.id)}
              />
            ))}
          </div>

          {/* Floating Modal System */}
          <AnimatePresence mode="wait">
            {expandedZone && expandedZoneData && (
              <>
                {/* Backdrop */}
                <Backdrop onClick={handleClose} />

                {/* Floating Modal - Shares layoutId with grid card */}
                <ExpandedModal
                  zone={expandedZoneData}
                  onClose={handleClose}
                  ctaText={t('solution.cta')}
                />
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}

export default ZoneFloatingGrid
