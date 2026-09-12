'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1A120B] border-t border-[#D4AF37]/30 text-zinc-300 relative overflow-hidden">
      {/* Subtle gold glow background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#B58D24] via-[#D4AF37] to-[#FCEBB6]">
                <div className="w-full h-full rounded-full bg-[#0B0B0B] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="Diamond C Logo"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text">
                DIAMOND C
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#D4AF37] font-serif">
              {t.footer.headline}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <p className="text-xs italic text-[#E5C158]/80 font-serif">
              &ldquo;{t.footer.tagline}&rdquo;
            </p>
          </div>

          {/* Opening Hours Column */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2 inline-block">
              {t.footer.hoursTitle}
            </h4>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-medium text-white">{t.footer.hoursSchedule}</p>
              <p className="text-xs text-zinc-400">{t.footer.kitchenNotice}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2C1E12] text-[#E5C158] border border-[#D4AF37]/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open Daily
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2 inline-block">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  {t.nav.menu}
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  {t.nav.reservation}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-xs text-zinc-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-zinc-500">⚙</span> {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Essential Info Column */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2 inline-block">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] mt-0.5">📍</span>
                <span>{t.footer.location}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] mt-0.5">📞</span>
                <a
                  href="https://wa.me/237670199859"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E5C158] transition-colors underline decoration-[#D4AF37]/40"
                >
                  {t.footer.phone}
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] mt-0.5">🌐</span>
                <Link href="/" className="hover:text-[#E5C158] transition-colors">
                  {t.footer.website}
                </Link>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/237670199859"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-colors shadow-md shadow-[#D4AF37]/20"
                >
                  <span>Chat with Concierge</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-500">Ancienne route, Douala, Cameroon</span>
            <span>•</span>
            <span className="text-[#D4AF37]">High Luxury Dining</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
