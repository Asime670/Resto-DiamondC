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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
            ? 'bg-dark-950/90 backdrop-blur-md py-3 border-b border-gold-500/20 shadow-xl shadow-black/50'
            : 'bg-gradient-to-b from-dark-950/90 via-dark-950/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-dark-950 overflow-hidden flex items-center justify-center">
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
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text">
                DIAMOND C
              </span>
              <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase -mt-1">
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
                      ? 'text-gold-400 font-semibold'
                      : 'text-zinc-300 hover:text-gold-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher (EN / FR) */}
            <div className="flex items-center bg-dark-900/80 p-1 rounded-full border border-gold-500/30 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  lang === 'fr'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-sm'
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

            {/* Link to Admin */}
            <Link
              href="/admin/login"
              className="text-xs text-zinc-400 hover:text-gold-400 transition-colors p-2 rounded-lg hover:bg-white/5"
              title="Admin Portal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu & Language Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="text-xs font-bold px-2.5 py-1 rounded-full border border-gold-500/40 text-gold-400 bg-dark-900"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-gold-400 p-2 rounded-lg focus:outline-none"
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
        <div className="fixed inset-0 z-30 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-dark-950 border-l border-gold-500/30 p-6 flex flex-col justify-between shadow-2xl z-40 overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-gold-500/20">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt="Diamond C Logo"
                    width={38}
                    height={38}
                    className="rounded-full"
                  />
                  <span className="font-serif text-lg font-bold gold-gradient-text">
                    DIAMOND C
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-4 py-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-serif transition-colors py-2 border-b border-white/5 ${
                        isActive ? 'text-gold-400 font-bold' : 'text-zinc-300 hover:text-gold-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Language Switcher in Drawer */}
              <div className="py-4">
                <span className="text-xs text-zinc-400 block mb-2 font-medium">Language / Langue:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLang('en')}
                    className={`py-2 text-sm rounded-lg border font-semibold ${
                      lang === 'en'
                        ? 'bg-gold-500 text-dark-950 border-gold-400'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => setLang('fr')}
                    className={`py-2 text-sm rounded-lg border font-semibold ${
                      lang === 'fr'
                        ? 'bg-gold-500 text-dark-950 border-gold-400'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    Français (FR)
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gold-500/20 flex flex-col gap-3">
              <Link href="/reservation" className="w-full">
                <Button variant="gold" size="md" className="w-full">
                  {t.nav.reserveTable}
                </Button>
              </Link>
              <Link
                href="/admin/login"
                className="text-center text-xs text-zinc-500 hover:text-gold-400 py-2 transition-colors flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t.nav.admin} Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
