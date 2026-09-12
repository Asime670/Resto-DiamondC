'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getMenuItems } from '@/lib/menuStore';
import FoodCard from '@/components/public/FoodCard';
import Button from '@/components/ui/Button';

export default function Home() {
  const { t } = useLanguage();
  const [signatureDishes, setSignatureDishes] = useState(() => {
    const items = getMenuItems();
    const preview = items.filter((d) => d.isSignature || d.badge).slice(0, 4);
    return preview.length > 0 ? preview : items.slice(0, 4);
  });

  useEffect(() => {
    const handleMenuSync = () => {
      const items = getMenuItems();
      const preview = items.filter((d) => d.isSignature || d.badge).slice(0, 4);
      setSignatureDishes(preview.length > 0 ? preview : items.slice(0, 4));
    };

    window.addEventListener('menu_updated', handleMenuSync);
    return () => window.removeEventListener('menu_updated', handleMenuSync);
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#0B0B0B] text-zinc-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Image with Dark Brown Shade Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Diamond C Luxury Restaurant Interior"
            fill
            priority
            className="object-cover object-center filter brightness-45 scale-105 animate-pulse-slow"
          />
          {/* Multi-layered dark & warm brown gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/90 via-[#1A120B]/80 to-[#0B0B0B]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          {/* Primary Gold Headings */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight gold-gradient-text drop-shadow-2xl">
              {t.hero.welcome}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#F4E6B3] font-serif italic tracking-wide">
              {t.hero.tagline}
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed font-light">
            {t.hero.subtitle}
          </p>

          {/* Location & Opening Hours Pill */}
          <div className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium tracking-wider uppercase border-y border-[#D4AF37]/20 py-1.5 px-6">
            {t.hero.signatureNotice}
          </div>

          {/* Call-To-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link href="/menu">
              <Button variant="gold" size="lg" className="w-full sm:w-auto px-8">
                {t.hero.exploreMenu}
              </Button>
            </Link>
            <Link href="/reservation">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                {t.hero.reserveTable}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DIAMOND C STORY SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#1A120B] border-t border-b border-[#D4AF37]/25 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-wide">
              {t.story.title}
            </h2>

            <p className="text-base sm:text-lg text-[#E5C158] font-serif italic">
              &ldquo;{t.story.subtitle}&rdquo;
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded" />

            <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              <p>{t.story.p3}</p>
            </div>

            <div className="pt-2">
              <Link href="/menu">
                <Button variant="gold">
                  {t.story.button}
                </Button>
              </Link>
            </div>
          </div>

          {/* Restaurant Space Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl shadow-black/80 group">
              <Image
                src="/images/story-interior.jpg"
                alt="Diamond C Interior Space and VIP Dining"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Image Overlaid Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-[#0B0B0B]/80 border border-[#D4AF37]/30">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Fine Dining Douala</p>
                <p className="text-sm font-bold text-white font-serif">A Sanctuary of Cameroonian Gastronomy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE MENU PREVIEW SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold font-serif gold-gradient-text">
              {t.preview.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              {t.preview.subtitle}
            </p>
          </div>

          {/* Preview Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {signatureDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} className="w-full max-w-[340px]" />
            ))}
          </div>

          {/* View Full Menu CTA */}
          <div className="text-center pt-8">
            <Link href="/menu">
              <Button variant="gold" size="lg" className="px-10 shadow-xl shadow-[#D4AF37]/20">
                {t.preview.viewFullMenu}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOSPITALITY HIGHLIGHTS BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1A120B] via-[#2C1E12] to-[#1A120B] border-t border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-6 rounded-2xl bg-[#0B0B0B]/60 border border-[#D4AF37]/20 flex items-center gap-4">
            <div>
              <h4 className="text-base font-bold font-serif text-[#E5C158]">Authentic Cameroonian Terroir</h4>
              <p className="text-xs text-zinc-400">Royal Achu, Eru, Poisson Braisé & Ndolé cooked with genuine ancestral spices.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B0B]/60 border border-[#D4AF37]/20 flex items-center gap-4">

            <div>
              <h4 className="text-base font-bold font-serif text-[#E5C158]">Royal Wine & Cigar Lounge</h4>
              <p className="text-xs text-zinc-400">Exclusive private suites, fine cognac cocktails, and sommelier-selected vintages.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B0B]/60 border border-[#D4AF37]/20 flex items-center gap-4">
            <div>
              <h4 className="text-base font-bold font-serif text-[#E5C158]">Instant WhatsApp Concierge</h4>
              <p className="text-xs text-zinc-400">Instant table reservations and meal pre-orders directly with our dedicated maître d&apos;.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}