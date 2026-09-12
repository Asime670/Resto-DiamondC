'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { getFoodOrderUrl } from '@/utils/whatsapp';

export default function FoodCard({ dish, className = '' }) {
  const { lang, t } = useLanguage();

  if (!dish) return null;

  const dishName = lang === 'fr' ? (dish.nameFr || dish.name) : dish.name;
  const dishDesc = lang === 'fr' ? (dish.descriptionFr || dish.description) : dish.description;
  const dishBadge = lang === 'fr' ? (dish.badgeFr || dish.badge) : dish.badge;
  const orderUrl = getFoodOrderUrl(dish, lang);
  const isInStock = dish.inStock !== false;

  return (
    <div
      className={`group relative w-[290px] sm:w-[320px] shrink-0 snap-start flex flex-col justify-between rounded-2xl overflow-hidden bg-[#1A120B] border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-300 ${className}`}
    >
      {/* Top Image Section */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0B0B0B]">
        <Image
          src={dish.image || '/images/placeholder-food.jpg'}
          alt={dishName}
          fill
          sizes="(max-width: 640px) 290px, 320px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B] via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {dishBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[#D4AF37] text-black shadow-md shadow-black/40">
              {dishBadge}
            </span>
          )}
          {dish.isSignature && !dishBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md">
              Signature
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
              isInStock
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/70 border-red-500/40 text-red-300'
            }`}
          >
            {isInStock ? t.menu.inStock : t.menu.soldOut}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#E5C158] transition-colors line-clamp-1">
              {dishName}
            </h3>
          </div>

          <div className="text-base sm:text-lg font-bold text-[#D4AF37] tracking-wide">
            {dish.price}
          </div>

          <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-3 leading-relaxed">
            {dishDesc}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#D4AF37]/15">
          {isInStock ? (
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-black hover:from-[#E5C158] hover:to-[#B58D24] shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 active:scale-98"
            >
              <span>{t.menu.orderNow}</span>
              <span className="text-sm">💬</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-full font-medium text-xs sm:text-sm bg-zinc-900 border border-zinc-700 text-zinc-500 cursor-not-allowed text-center"
            >
              {t.menu.soldOut}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
