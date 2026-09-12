'use client';

import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'gold',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide';

  const variants = {
    gold: 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-dark-950 font-semibold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:from-gold-300 hover:to-gold-500 border border-gold-300/40',
    outline: 'bg-transparent text-gold-400 border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-300 shadow-sm',
    dark: 'bg-dark-800 text-white border border-dark-700 hover:border-gold-500/30 hover:bg-dark-750 shadow-sm',
    danger: 'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60 hover:border-red-600 shadow-sm',
    ghost: 'bg-transparent text-zinc-300 hover:text-gold-400 hover:bg-white/5',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.gold} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
