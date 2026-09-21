'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getMenuItems } from '@/lib/menuStore';
import { DAYS_OF_WEEK, getCurrentDay, getDayLabel } from '@/utils/days';
import FoodCard from '@/components/public/FoodCard';

export default function MenuPage() {
  const { lang, t } = useLanguage();
  const [menuItems, setMenuItems] = useState(() => getMenuItems());
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const todayName = getCurrentDay();

  // Scroll containers refs for horizontal scrolling buttons
  const rowRefs = useRef({});

  useEffect(() => {
    setMenuItems(getMenuItems());
    const handleMenuUpdated = () => {
      setMenuItems(getMenuItems());
    };
    window.addEventListener('menu_updated', handleMenuUpdated);
    return () => window.removeEventListener('menu_updated', handleMenuUpdated);
  }, []);

  const handleScrollRow = (day, direction) => {
    const el = rowRefs.current[day];
    if (el) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter dishes by search and category
  const filterDish = (dish) => {
    const matchesCategory =
      selectedCategory === 'all' || dish.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const name = (dish.name || '').toLowerCase();
    const nameFr = (dish.nameFr || '').toLowerCase();
    const desc = (dish.description || '').toLowerCase();
    const descFr = (dish.descriptionFr || '').toLowerCase();

    const matchesQuery =
      name.includes(query) ||
      nameFr.includes(query) ||
      desc.includes(query) ||
      descFr.includes(query);

    return matchesCategory && matchesQuery;
  };

  // Days to display based on selectedDay filter
  const displayedDays = selectedDay === 'All' ? DAYS_OF_WEEK : [selectedDay];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-100 py-10 sm:py-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif gold-gradient-text tracking-tight">
          {t.menu.title}
        </h1>
      </div>

      {/* Control Bar: Day Tabs, Search & Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 space-y-6">
        {/* Days of Week Navigation Bar */}
        <div className="p-2 rounded-2xl bg-[#1A120B] border border-[#D4AF37]/30 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto luxury-scrollbar pb-1">
            {/* All Days Tab */}
            <button
              type="button"
              onClick={() => setSelectedDay('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedDay === 'All'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md shadow-[#D4AF37]/25 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {t.menu.allDays}
            </button>

            {/* Individual Day Tabs */}
            {DAYS_OF_WEEK.map((day) => {
              const isToday = day === todayName;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md shadow-[#D4AF37]/25 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span>{getDayLabel(day, lang)}</span>
                  {isToday && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isSelected
                        ? 'bg-black text-[#E5C158]'
                        : 'bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40'
                        }`}
                    >
                      {t.menu.today}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full bg-[#121212] border border-[#D4AF37]/30 rounded-full px-4 py-2 pl-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
            <svg
              className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Day-by-Day Horizontal Rows Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {displayedDays.map((day) => {
          const isToday = day === todayName;
          const dayDishes = menuItems
            .filter((item) => item.days && item.days.includes(day))
            .filter(filterDish);

          return (
            <section
              key={day}
              className="space-y-6 relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#140E08] to-[#0B0B0B] border border-[#D4AF37]/20 shadow-2xl"
            >
              {/* Day Header with Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 bg-gradient-to-b from-[#D4AF37] to-[#8C6D1F] rounded-full" />
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
                        {getDayLabel(day, lang)}
                      </h2>
                      {isToday && (
                        <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md">
                          {t.menu.today}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      {dayDishes.length} {lang === 'fr' ? 'plats disponibles' : 'meals available for this day'}
                    </p>
                  </div>
                </div>

                {/* Horizontal Scroll Arrows for Desktop */}
                {dayDishes.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-zinc-500 mr-2 italic">
                      {t.menu.scrollHint}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleScrollRow(day, 'left')}
                      className="w-9 h-9 rounded-full bg-[#1A120B] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollRow(day, 'right')}
                      className="w-9 h-9 rounded-full bg-[#1A120B] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal Scrollable Row for Food Cards */}
              {dayDishes.length > 0 ? (
                <div
                  ref={(el) => {
                    rowRefs.current[day] = el;
                  }}
                  className="flex overflow-x-auto gap-6 snap-x pb-6 pt-2 luxury-scrollbar scroll-smooth"
                >
                  {dayDishes.map((dish) => (
                    <FoodCard key={`${day}-${dish.id}`} dish={dish} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 text-sm italic">
                  {t.menu.emptyDishes}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
