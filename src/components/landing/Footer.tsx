"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/context/landing/LanguageContext';


export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    product: [
      { label: t('footer.links.features'), href: '/features' },
      { label: t('footer.links.map'), href: '/map' },
      { label: t('footer.links.pricing'), href: '/pricing' },
      { label: t('footer.links.roadmap'), href: '/roadmap' },
    ],
    company: [
      { label: t('footer.links.about'), href: '/about' },
      { label: t('footer.links.blog'), href: '/blog' },
      { label: t('footer.links.careers'), href: '/careers' },
      { label: t('footer.links.contact'), href: '/contact' },
    ],
    legal: [
      { label: t('footer.links.privacy'), href: '/privacy' },
      { label: t('footer.links.terms'), href: '/terms' },
      { label: t('footer.links.security'), href: '/security' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-svarajya-blue border-t border-svarajya-blue py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-mudra-gold" />
              </div>
              <span className="font-serif text-xl font-semibold text-white">
                <span className="text-mudra-gold">S</span>varajya
              </span>
            </div>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              {t('footer.tagline')} <span className="italic">"{t('footer.quote')}"</span>
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-mudra-gold hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-white mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-mudra-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-mudra-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-mudra-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">{t('footer.copyright')}</p>
          <p className="text-white/40 text-xs italic">"{t('footer.quote')}"</p>
        </div>
      </div>
    </footer>
  )
}
