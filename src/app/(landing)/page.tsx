"use client";

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import dynamicImport from 'next/dynamic'
import {
  Shield,
  Wallet,
  FileText,
  Lock,
  CreditCard,
  Users,
  Landmark,
  Swords,
  Menu,
  X,
  Crown,
  Map,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Globe,
  ChevronDown,
  Eye,
  UserPlus,
  Quote,
  Plus,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/landing/ui/Button'
import { Card } from '@/components/landing/ui/Card'
import { Badge } from '@/components/landing/ui/Badge'
import { ProgressRing } from '@/components/landing/ui/ProgressRing'
import ZoneFloatingGrid from '@/components/landing/ZoneFloatingGrid'
import { useLanguage, languageNames, Language } from '@/context/landing/LanguageContext'
import { useRouter } from 'next/navigation'

const DynamicNavbar = dynamicImport(() => import('@/components/landing/Navbar').then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => <div className="h-16" />,
})

const DynamicFooter = dynamicImport(() => import('@/components/landing/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: false,
  loading: () => <div className="h-16" />,
})

export default function LandingPage() {
  const router = useRouter();
  const onCreateSvarajya = () => router.push('/register');

  return (
    <div className="min-h-screen bg-parchment parchment-texture">
      {/* Navbar */}
      <DynamicNavbar />

      {/* Hero Section */}
      <HeroSection onCreateSvarajya={onCreateSvarajya} />

      {/* Problem Section */}
      <ProblemSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Svarajya Concept Section */}
      <SvarajyaConceptSection />

      {/* Family Section */}
      <FamilySection />

      {/* Gamification Section */}
      <GamificationSection />

      {/* Security Section */}
      <SecuritySection />

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection onCreateSvarajya={onCreateSvarajya} />

      {/* Footer */}
      <DynamicFooter />
    </div>
  )
}

// ============ HERO SECTION ============
function HeroSection({ onCreateSvarajya }: { onCreateSvarajya: () => void }) {
  const { t } = useLanguage()

  const benefits = [
    { icon: Eye, text: t('hero.benefits.subscriptions') },
    { icon: Users, text: t('hero.benefits.family') },
    { icon: TrendingUp, text: t('hero.benefits.tracking') },
    { icon: Target, text: t('hero.benefits.chaos') },
  ]

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 lg:py-24"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Temple line decoration */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="temple-line w-24 mx-auto lg:mx-0 mb-6"
            />

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-fort-stone leading-tight mb-6"
            >
              {t('hero.headline')}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-fort-stone/70 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {t('hero.subheadline')}
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg bg-palm-green/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-palm-green" />
                  </div>
                  <span className="text-sm text-fort-stone/80">{benefit.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <div className="flex flex-col items-center lg:items-start">
                <Button variant="gold" size="lg" onClick={onCreateSvarajya}>
                  {t('hero.primaryCta')}
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <span className="text-xs text-fort-stone/50 mt-2">{t('hero.noCreditCard')}</span>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Map className="w-5 h-5" />
                {t('hero.secondaryCta')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Illustration - Svarajya Map Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Stylized map preview */}
              <div className="w-96 h-96 rounded-3xl bg-card-white shadow-2xl border border-parchment-dark/20 p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <pattern
                      id="temple-pattern"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M10 0 L20 10 L10 20 L0 10 Z"
                        fill="none"
                        stroke="#1F3A5F"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="100" height="100" fill="url(#temple-pattern)" />
                  </svg>
                </div>

                <div className="relative z-15 grid grid-cols-2 gap-4 h-full">
                  {[
                    { icon: Shield, label: 'Fort', color: 'palm-green', progress: 45 },
                    { icon: Wallet, label: 'Matka', color: 'river-teal', progress: 68 },
                    { icon: Landmark, label: 'Treasury', color: 'mudra-gold', progress: 32 },
                    { icon: Swords, label: 'Battlefield', color: 'matka-clay', progress: 78 },
                    { icon: Users, label: 'Legacy', color: 'river-teal', progress: 20 },
                    { icon: FileText, label: 'Archive', color: 'svarajya-blue', progress: 55 },
                  ].map((zone, i) => (
                    <motion.div
                      key={zone.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className={`bg-parchment rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-${zone.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <zone.icon className={`w-5 h-5 text-${zone.color}`} />
                      </div>
                      <span className="text-xs font-medium text-fort-stone">{zone.label}</span>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-parchment-dark/20">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.progress}%` }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                          className={`h-full bg-${zone.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2 }}
                className="relative right-0 top-2 w-[180px] bg-card-white rounded-xl p-4 shadow-xl border border-parchment-dark/20"
              >
                <div className="flex items-center gap-3">
                  <Badge icon="Crown" earned size="sm" />
                  <div>
                    <p className="text-xs text-fort-stone/60">Svarajya Points</p>
                    <p className="font-mono text-lg font-semibold text-mudra-gold">420</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating stability score */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.4 }}
                className="relative left-48 bottom-17 w-[180px] h-[78] bg-card-white rounded-xl p-4 shadow-xl border border-parchment-dark/20"
              >
                <div className="flex items-center gap-3">
                  <ProgressRing progress={78} size={48} strokeWidth={4} />
                  <div>
                    <p className="text-xs text-fort-stone/60">Stability</p>
                    <p className="font-serif text-lg font-semibold text-fort-stone">Rising</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============ PROBLEM SECTION ============
function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, tArray } = useLanguage()

  const problems = [
    {
      icon: CreditCard,
      titleKey: 'problem.cards.subscriptions.title',
      pointsKey: 'problem.cards.subscriptions.points',
      quoteKey: 'problem.cards.subscriptions.quote',
    },
    {
      icon: Shield,
      titleKey: 'problem.cards.insurance.title',
      pointsKey: 'problem.cards.insurance.points',
      quoteKey: 'problem.cards.insurance.quote',
    },
    {
      icon: Users,
      titleKey: 'problem.cards.family.title',
      pointsKey: 'problem.cards.family.points',
      quoteKey: 'problem.cards.family.quote',
    },
  ]

  return (
    <section ref={ref} id="problem" className="py-24 px-6 bg-card-white/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('problem.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('problem.title')}
          </h2>
          <p className="text-fort-stone/70 mb-4 max-w-2xl mx-auto">{t('problem.intro')}</p>
          <div className="temple-line w-16 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Card variant="warning" className="h-full hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-matka-clay/10 flex items-center justify-center mb-5">
                  <problem.icon className="w-7 h-7 text-matka-clay" />
                </div>
                <h3 className="font-serif text-xl font-medium text-fort-stone mb-4">
                  {t(problem.titleKey)}
                </h3>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-4">
                  {tArray(problem.pointsKey).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-fort-stone/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-matka-clay/60 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Quote */}
                <div className="pt-3 border-t border-parchment-dark/10">
                  <p className="text-xs text-fort-stone/50 italic">"{t(problem.quoteKey)}"</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-fort-stone/70 mt-12 text-lg"
        >
          {t('problem.closing')}
        </motion.p>
      </div>
    </section>
  )
}

// ============ HOW IT WORKS SECTION ============
function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const steps = [
    {
      icon: Crown,
      number: '01',
      titleKey: 'howItWorks.steps.step1.title',
      descKey: 'howItWorks.steps.step1.description',
    },
    {
      icon: UserPlus,
      number: '02',
      titleKey: 'howItWorks.steps.step2.title',
      descKey: 'howItWorks.steps.step2.description',
    },
    {
      icon: Eye,
      number: '03',
      titleKey: 'howItWorks.steps.step3.title',
      descKey: 'howItWorks.steps.step3.description',
    },
  ]

  return (
    <section ref={ref} id="how-it-works" className="py-24 px-6 bg-parchment">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('howItWorks.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('howItWorks.title')}
          </h2>
          <div className="temple-line w-16 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-mudra-gold/40 to-mudra-gold/10" />
              )}

              <div className="bg-card-white rounded-2xl p-8 text-center border border-parchment-dark/10 hover:shadow-lg transition-shadow relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-svarajya-blue/10 flex items-center justify-center mx-auto mb-6 relative">
                  <step.icon className="w-8 h-8 text-svarajya-blue" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-mudra-gold text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-fort-stone mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-fort-stone/70 text-sm">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ SVARAJYA CONCEPT SECTION ============
function SvarajyaConceptSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  return (
    <section ref={ref} id="concept" className="py-16 md:py-24 px-6 md:px-20 bg-card-white/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('solution.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('solution.title')}
          </h2>
          <p className="text-fort-stone/70 max-w-2xl mx-auto mb-4">{t('solution.intro')}</p>
          <div className="temple-line w-16 mx-auto mt-6" />
        </motion.div>

        {/* Zone Intelligence Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <ZoneFloatingGrid />
        </motion.div>
      </div>
    </section>
  )
}

// ============ FAMILY SECTION ============
function FamilySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const features = [
    {
      icon: Users,
      titleKey: 'family.features.sharing.title',
      descKey: 'family.features.sharing.description',
    },
    {
      icon: Shield,
      titleKey: 'family.features.access.title',
      descKey: 'family.features.access.description',
    },
    {
      icon: TrendingUp,
      titleKey: 'family.features.tracking.title',
      descKey: 'family.features.tracking.description',
    },
    {
      icon: Award,
      titleKey: 'family.features.nominees.title',
      descKey: 'family.features.nominees.description',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-parchment">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('family.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('family.title')}
          </h2>
          <p className="text-fort-stone/70 max-w-2xl mx-auto">{t('family.intro')}</p>
          <div className="temple-line w-16 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-card-white rounded-2xl p-6 border border-parchment-dark/10 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-river-teal/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-river-teal" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-fort-stone mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-fort-stone/70 text-sm">{t(feature.descKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ GAMIFICATION SECTION ============
function GamificationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const features = [
    {
      titleKey: 'gamification.features.chapters.title',
      descKey: 'gamification.features.chapters.description',
      icon: Shield,
      progress: 45,
    },
    {
      titleKey: 'gamification.features.strengthen.title',
      descKey: 'gamification.features.strengthen.description',
      icon: Target,
      progress: 68,
    },
    {
      titleKey: 'gamification.features.recognition.title',
      descKey: 'gamification.features.recognition.description',
      icon: Award,
      progress: 78,
    },
    {
      titleKey: 'gamification.features.effort.title',
      descKey: 'gamification.features.effort.description',
      icon: TrendingUp,
      progress: 32,
    },
  ]

  return (
    <section ref={ref} id="story" className="py-24 px-6 bg-svarajya-blue relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M10 0 L0 0 L0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('gamification.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
            {t('gamification.title')}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">{t('gamification.intro')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mudra-gold/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-mudra-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-white mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-white/60 text-sm mb-4">{t(feature.descKey)}</p>

                  {/* Progress bar */}
                  <div className="relative">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${feature.progress}%` } : {}}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full bg-linear-to-r from-mudra-gold to-yellow-400 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-white/50">Progress</span>
                      <span className="text-xs font-mono text-mudra-gold">{feature.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white/60 text-sm mb-6 italic">"{t('gamification.quote')}"</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="text-center">
              <Badge icon="Crown" earned size="lg" />
              <p className="text-sm text-white/70 mt-2">{t('gamification.badges.founder')}</p>
            </div>
            <div className="text-center">
              <Badge icon="Shield" earned size="lg" />
              <p className="text-sm text-white/70 mt-2">{t('gamification.badges.guardian')}</p>
            </div>
            <div className="text-center">
              <Badge icon="Trophy" earned size="lg" />
              <p className="text-sm text-white/70 mt-2">{t('gamification.badges.conqueror')}</p>
            </div>
            <div className="text-center">
              <Badge icon="Star" size="lg" />
              <p className="text-sm text-white/50 mt-2">{t('gamification.badges.master')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============ SECURITY SECTION ============
function SecuritySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const features = [
    {
      icon: Lock,
      titleKey: 'security.features.encryption.title',
      descKey: 'security.features.encryption.description',
    },
    {
      icon: Shield,
      titleKey: 'security.features.cloud.title',
      descKey: 'security.features.cloud.description',
    },
    {
      icon: Users,
      titleKey: 'security.features.access.title',
      descKey: 'security.features.access.description',
    },
    {
      icon: Eye,
      titleKey: 'security.features.logs.title',
      descKey: 'security.features.logs.description',
    },
    {
      icon: Award,
      titleKey: 'security.features.privacy.title',
      descKey: 'security.features.privacy.description',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-card-white/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
          >
            <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
              {t('security.badge')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
              {t('security.title')}
            </h2>
            <p className="text-fort-stone/70 mb-8 text-lg">{t('security.intro')}</p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-card-white rounded-xl p-4 border border-parchment-dark/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-palm-green/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-palm-green" />
                  </div>
                  <div>
                    <h3 className="font-medium text-fort-stone">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-fort-stone/60">{t(feature.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy Statement */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-svarajya-blue/5 rounded-xl border border-svarajya-blue/20"
            >
              <p className="text-svarajya-blue font-medium text-center">
                {t('security.statement')}
              </p>
            </motion.div>
          </motion.div>

          {/* Royal Seal Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                className="absolute inset-0 w-56 h-56 rounded-full border-2 border-dashed border-mudra-gold/30"
              />

              {/* Middle ring */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute inset-4 rounded-full border border-mudra-gold/20"
              />

              {/* Seal */}
              <motion.div
                initial={{ scale: 2, rotate: -10, opacity: 0 }}
                animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-56 h-56 rounded-full bg-linear-to-br from-mudra-gold via-yellow-500 to-mudra-gold flex items-center justify-center shadow-2xl relative"
              >
                {/* Inner pattern */}
                <div className="absolute inset-4 rounded-full border-2 border-white/30" />
                <div className="absolute inset-8 rounded-full border border-white/20" />

                <div className="text-center">
                  <Crown className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-white font-serif font-semibold text-lg">Royal Seal</p>
                  <p className="text-white/70 text-xs">Verified & Secure</p>
                </div>
              </motion.div>

              {/* Glow effect */}
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-mudra-gold/20 blur-xl -z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============ SOCIAL PROOF SECTION ============
function SocialProofSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const testimonials = [
    {
      quoteKey: 'socialProof.testimonials.testimonial1.quote',
      nameKey: 'socialProof.testimonials.testimonial1.name',
      locationKey: 'socialProof.testimonials.testimonial1.location',
    },
    {
      quoteKey: 'socialProof.testimonials.testimonial2.quote',
      nameKey: 'socialProof.testimonials.testimonial2.name',
      locationKey: 'socialProof.testimonials.testimonial2.location',
    },
    {
      quoteKey: 'socialProof.testimonials.testimonial3.quote',
      nameKey: 'socialProof.testimonials.testimonial3.name',
      locationKey: 'socialProof.testimonials.testimonial3.location',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-parchment">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('socialProof.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('socialProof.title')}
          </h2>
          <div className="temple-line w-16 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.nameKey}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="bg-card-white rounded-2xl p-6 border border-parchment-dark/10 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-mudra-gold/30 mb-4" />
              <p className="text-fort-stone/80 mb-6 italic">"{t(testimonial.quoteKey)}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-svarajya-blue/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-svarajya-blue" />
                </div>
                <div>
                  <p className="font-medium text-fort-stone">{t(testimonial.nameKey)}</p>
                  <p className="text-sm text-fort-stone/60">{t(testimonial.locationKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ FAQ SECTION ============
function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { questionKey: 'faq.questions.q1.question', answerKey: 'faq.questions.q1.answer' },
    { questionKey: 'faq.questions.q2.question', answerKey: 'faq.questions.q2.answer' },
    { questionKey: 'faq.questions.q3.question', answerKey: 'faq.questions.q3.answer' },
    { questionKey: 'faq.questions.q4.question', answerKey: 'faq.questions.q4.answer' },
    { questionKey: 'faq.questions.q5.question', answerKey: 'faq.questions.q5.answer' },
    { questionKey: 'faq.questions.q6.question', answerKey: 'faq.questions.q6.answer' },
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-card-white/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-mudra-gold text-sm font-medium uppercase tracking-wider mb-3">
            {t('faq.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
            {t('faq.title')}
          </h2>
          <div className="temple-line w-16 mx-auto" />
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.questionKey}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-card-white rounded-xl border border-parchment-dark/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-parchment/30 transition-colors"
              >
                <span className="font-medium text-fort-stone pr-4">{t(faq.questionKey)}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  {openIndex === i ? (
                    <Minus className="w-5 h-5 text-mudra-gold" />
                  ) : (
                    <Plus className="w-5 h-5 text-fort-stone/50" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-fort-stone/70">{t(faq.answerKey)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ FINAL CTA SECTION ============
function FinalCTASection({ onCreateSvarajya }: { onCreateSvarajya: () => void }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  return (
    <section ref={ref} className="py-24 px-6 bg-parchment">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="temple-line w-24 mx-auto mb-8" />

        <motion.div
          initial={{ scale: 0.9 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-linear-to-br from-svarajya-blue to-svarajya-blue/80 flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-mudra-gold" />
        </motion.div>

        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fort-stone mb-4">
          {t('finalCta.title')}
        </h2>
        <p className="text-fort-stone/70 mb-8 text-lg">{t('finalCta.subtitle')}</p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="gold" size="lg" onClick={onCreateSvarajya}>
            {t('finalCta.cta')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

