'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-100 py-12 sm:py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#1A120B] text-xs font-semibold text-[#E5C158]">
            <span>✦</span>
            <span>{t.about.tag}</span>
            <span>✦</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif gold-gradient-text tracking-tight">
            {t.about.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* Section 1: Story & Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#E5C158]">
              {t.about.storyHeading}
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] rounded" />
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {t.about.storyText}
            </p>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              From slow-simmered bitterleaf herbs in rich peanut sauce (Royal Ndolé) to volcanic basalt-ground yellow soup (Royal Achu), our culinary philosophy blends ancestral methods with modern luxury plating.
            </p>
          </div>
          <div className="lg:col-span-6 relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl">
            <Image
              src="/images/story-interior.jpg"
              alt="Diamond C Dining Environment"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
        </div>

        {/* Section 2: Culinary Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
          <div className="lg:col-span-6 relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl order-2 lg:order-1">
            <Image
              src="/images/hero-bg.jpg"
              alt="Diamond C VIP Atmosphere"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#E5C158]">
              {t.about.standardsHeading}
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] rounded" />
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {t.about.standardsText}
            </p>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {t.about.experienceText}
            </p>
          </div>
        </div>

        {/* Info Grid: Location, Hours & Reservations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 sm:p-12 rounded-3xl bg-[#1A120B] border border-[#D4AF37]/30 shadow-2xl text-center md:text-left">
          <div className="space-y-3">
            <div className="text-3xl text-[#D4AF37]">📍</div>
            <h3 className="text-lg font-bold font-serif text-[#E5C158]">
              {t.about.locationHeading}
            </h3>
            <p className="text-sm text-zinc-300">
              {t.about.locationDesc}
            </p>
            <p className="text-xs text-zinc-500">
              Easily accessible with secure VIP valet parking.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl text-[#D4AF37]">⏰</div>
            <h3 className="text-lg font-bold font-serif text-[#E5C158]">
              {t.about.hoursHeading}
            </h3>
            <p className="text-sm text-zinc-300">
              {t.about.hoursDesc}
            </p>
            <p className="text-xs text-zinc-500">
              Continuous daily service including weekends and holidays.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl text-[#D4AF37]">👑</div>
            <h3 className="text-lg font-bold font-serif text-[#E5C158]">
              Bespoke Dining
            </h3>
            <p className="text-sm text-zinc-300">
              Private lounges for corporate dinners, birthdays, and banquets.
            </p>
            <div className="pt-2">
              <Link href="/reservation">
                <Button variant="gold" size="sm">
                  {t.nav.reserveTable}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
