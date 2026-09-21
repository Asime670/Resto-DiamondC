'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/reservation', label: t.nav.reservation },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0B0B]/90 backdrop-blur-md py-3 border-b border-[#D4AF37]/25 shadow-xl shadow-black/60'
            : 'bg-gradient-to-b from-[#0B0B0B]/95 via-[#0B0B0B]/70 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#B58D24] via-[#D4AF37] to-[#FCEBB6] shadow-md shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[#0B0B0B] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Diamond C Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-wider gold-gradient-text">
                DIAMOND C
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-zinc-400 uppercase -mt-0.5 sm:-mt-1">
                Luxury Dining
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-[#E5C158] font-semibold'
                      : 'text-zinc-300 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher (EN / FR) */}
            <div className="flex items-center bg-[#1A120B] p-1 rounded-full border border-[#D4AF37]/35 text-xs font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0B0B0B] font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0B0B0B] font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Passer en Français"
              >
                FR
              </button>
            </div>

            {/* Quick Reservation Button */}
            <Link href="/reservation">
              <Button variant="gold" size="sm">
                {t.nav.reserveTable}
              </Button>
            </Link>


          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="text-xs font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/50 text-[#E5C158] bg-[#1A120B]"
              aria-label="Toggle language"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-[#D4AF37] p-2 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#0B0B0B] border-l border-[#D4AF37]/30 p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt="Diamond C Logo"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span className="font-serif text-lg font-bold gold-gradient-text">
                    DIAMOND C
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 py-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#D4AF37]/15 text-[#E5C158] font-bold border-l-2 border-[#D4AF37]'
                          : 'text-zinc-300 hover:text-[#D4AF37] hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

              </nav>
            </div>

            {/* Bottom Controls in Drawer */}
            <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Language / Langue:</span>
                <div className="flex items-center bg-[#1A120B] p-0.5 rounded-full border border-[#D4AF37]/30 text-xs">
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-full font-semibold ${
                      lang === 'en'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('fr')}
                    className={`px-3 py-1 rounded-full font-semibold ${
                      lang === 'fr'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    Français
                  </button>
                </div>
              </div>

              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="gold" className="w-full">
                  {t.nav.reserveTable}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
