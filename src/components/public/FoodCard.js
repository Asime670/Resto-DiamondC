'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

export default function FoodCard({ dish, className = '' }) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isViewingImage, setIsViewingImage] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsViewingImage(false);
      }
    };
    if (isViewingImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isViewingImage]);

  if (!dish) return null;

  const dishName = lang === 'fr' ? (dish.nameFr || dish.name) : dish.name;
  const dishDesc = lang === 'fr' ? (dish.descriptionFr || dish.description) : dish.description;
  const dishBadge = lang === 'fr' ? (dish.badgeFr || dish.badge) : dish.badge;
  const isInStock = dish.inStock !== false;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isInStock) return;
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenLightbox = (e) => {
    e.stopPropagation();
    setIsViewingImage(true);
  };

  return (
    <>
      {/* Individual Meal Card */}
      <div
        className={`group relative w-[280px] sm:w-[310px] shrink-0 snap-start flex flex-col justify-between rounded-2xl overflow-hidden bg-[#16100A] border border-[#D4AF37]/25 hover:border-[#D4AF37] shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-300 ${className}`}
      >
        {/* Clickable Food Image Container */}
        <div
          onClick={handleOpenLightbox}
          className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#0B0B0B] cursor-pointer"
          title={lang === 'fr' ? 'Cliquez pour agrandir' : 'Click to view full image'}
        >
          <Image
            src={dish.image || '/images/placeholder-food.jpg'}
            alt={dishName}
            fill
            sizes="(max-width: 640px) 280px, 310px"
            className="object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
          />

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E6C8] text-xs font-semibold shadow-lg">
              <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {lang === 'fr' ? 'Voir l’image' : 'View Image'}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {dishBadge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37] text-black shadow-md">
                {dishBadge}
              </span>
            )}
            {dish.isSignature && !dishBadge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md">
                Signature
              </span>
            )}
          </div>

          {/* Stock Status Pill */}
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                isInStock
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/70 border-red-500/40 text-red-300'
              }`}
            >
              {isInStock ? (t.menu?.inStock || 'In Stock') : (t.menu?.soldOut || 'Sold Out')}
            </span>
          </div>
        </div>

        {/* Card Content: Title, Price, Description, Add to Cart */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold font-serif text-white group-hover:text-[#E5C158] transition-colors line-clamp-1">
                {dishName}
              </h3>
            </div>

            <div className="text-base font-bold text-[#D4AF37] tracking-wide">
              {dish.price}
            </div>

            <p className="text-xs text-zinc-300/85 line-clamp-2 leading-relaxed">
              {dishDesc}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-2 border-t border-[#D4AF37]/15">
            {isInStock ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer active:scale-95 ${
                  added
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-black hover:from-[#E5C158] hover:to-[#B58D24] shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t.cart?.addedToCart || 'Added to Cart!'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{t.menu?.addToCart || 'Add to Cart'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-zinc-800/80 text-zinc-500 cursor-not-allowed text-center"
              >
                {t.menu?.soldOut || 'Sold Out'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal when clicking food image */}
      {isViewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsViewingImage(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#16100A] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsViewingImage(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Big Enlarged Food Image */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-black">
              <Image
                src={dish.image || '/images/placeholder-food.jpg'}
                alt={dishName}
                fill
                sizes="(max-width: 768px) 100vw, 680px"
                className="object-cover"
                priority
              />
            </div>

            {/* Dish Info & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {dishName}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md">
                  {dishDesc}
                </p>
                <div className="text-lg font-bold text-[#D4AF37] pt-1">
                  {dish.price}
                </div>
              </div>

              {isInStock && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`shrink-0 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer active:scale-95 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black hover:opacity-95 shadow-lg shadow-[#D4AF37]/20'
                  }`}
                >
                  {added ? `✓ ${t.cart?.addedToCart || 'Added!'}` : (t.menu?.addToCart || 'Add to Cart')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
