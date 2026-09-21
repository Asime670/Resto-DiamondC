'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getCartOrderUrl } from '@/utils/whatsapp';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, isOpen, setIsOpen } = useCart();
  const { lang, t } = useLanguage();
  const drawerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    const url = getCartOrderUrl(cartItems, lang);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const ct = t.cart;
  const itemLabel = totalItems === 1 ? ct.items : ct.itemsPlural;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#E5C158] to-[#B58D24] text-black shadow-2xl shadow-[#D4AF37]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        {/* Cart Icon */}
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {/* Badge */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md border border-[#0B0B0B]">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity" />
      )}

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[#0F0A05] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/20 bg-[#140E08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E5C158] flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold font-serif gold-gradient-text">{ct.title}</h2>
              {totalItems > 0 && (
                <p className="text-[11px] text-zinc-400">
                  {totalItems} {itemLabel}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                {ct.clearCart}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-[#1A120B] border border-[#D4AF37]/20 flex items-center justify-center text-2xl">
                🍽️
              </div>
              <div>
                <p className="text-zinc-300 font-semibold font-serif">{ct.empty}</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">{ct.emptyHint}</p>
              </div>
            </div>
          ) : (
            cartItems.map(({ dish, quantity }) => {
              const dishName = lang === 'fr' ? (dish.nameFr || dish.name) : dish.name;
              return (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A120B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors"
                >
                  {/* Dish Image */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0B0B0B] border border-[#D4AF37]/20">
                    <Image
                      src={dish.image || '/images/placeholder-food.jpg'}
                      alt={dishName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold font-serif text-white truncate">{dishName}</p>
                    <p className="text-[#D4AF37] text-xs font-semibold mt-0.5">{dish.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.id, -1)}
                      className="w-7 h-7 rounded-full bg-[#0B0B0B] border border-zinc-700 text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.id, +1)}
                      className="w-7 h-7 rounded-full bg-[#0B0B0B] border border-zinc-700 text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(dish.id)}
                      className="w-7 h-7 rounded-full bg-red-950/50 border border-red-800/40 text-red-400 hover:bg-red-900/60 flex items-center justify-center transition-colors cursor-pointer ml-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer — Place Order */}
        {cartItems.length > 0 && (
          <div className="px-4 py-4 border-t border-[#D4AF37]/20 bg-[#140E08] space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-widest font-semibold">{ct.total}</span>
              <span className="text-[#E5C158] font-bold">
                {totalItems} {itemLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-black hover:from-[#E5C158] hover:to-[#B58D24] shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/35 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>{ct.placeOrder}</span>
              <span className="text-base">💬</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
