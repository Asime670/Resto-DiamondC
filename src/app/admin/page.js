'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemStock,
  resetMenuToDefaults,
} from '@/lib/menuStore';
import {
  checkAdminCredentials,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from '@/lib/auth';
import { DAYS_OF_WEEK, getCurrentDay, getDayLabel } from '@/utils/days';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// Preset Cameroonian dish images for fast selection
const IMAGE_PRESETS = [
  { label: 'Achu (Yellow Soup)', url: '/images/food/achu.jpg' },
  { label: 'Wild Eru & Fufu', url: '/images/food/eru.jpg' },
  { label: 'Poisson Braisé / Tilapia', url: '/images/food/grilled-fish.jpg' },
  { label: 'Royal Ndolé & Gambas', url: '/images/food/ndole.jpg' },
  { label: 'Kati Kati Chicken', url: '/images/food/katikati.jpg' },
  { label: 'Poulet DG / Meat Special', url: '/images/placeholder-food.jpg' },
  { label: 'Gold Cocktail / Bar', url: '/images/story-interior.jpg' },
  { label: 'Palm Wine / VIP Lounge', url: '/images/hero-bg.jpg' },
];

export default function AdminPage() {
  const { lang, t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Menu State
  const [dishes, setDishes] = useState(() => getMenuItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDay, setFilterDay] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Form State inside Modal
  const [formData, setFormData] = useState({
    name: '',
    nameFr: '',
    price: '',
    category: 'cameroonian',
    image: '/images/food/achu.jpg',
    days: ['Monday'],
    description: '',
    descriptionFr: '',
    inStock: true,
    isSignature: false,
    badge: '',
    badgeFr: '',
  });

  const todayName = getCurrentDay();

  // Load auth & dishes
  const refreshDishes = () => {
    setDishes(getMenuItems());
  };

  useEffect(() => {
    const handleMenuSync = () => refreshDishes();
    window.addEventListener('menu_updated', handleMenuSync);
    return () => window.removeEventListener('menu_updated', handleMenuSync);
  }, []);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (checkAdminCredentials(usernameInput, passwordInput)) {
      setAdminSession({ username: usernameInput });
      setAuthenticated(true);
      setLoginError(false);
      refreshDishes();
    } else {
      setLoginError(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearAdminSession();
    setAuthenticated(false);
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      nameFr: '',
      price: '',
      category: 'cameroonian',
      image: '/images/food/achu.jpg',
      days: ['Monday', 'Wednesday', 'Friday'],
      description: '',
      descriptionFr: '',
      inStock: true,
      isSignature: false,
      badge: '',
      badgeFr: '',
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name || '',
      nameFr: dish.nameFr || '',
      price: dish.price || '',
      category: dish.category || 'cameroonian',
      image: dish.image || '/images/food/achu.jpg',
      days: dish.days || ['Monday'],
      description: dish.description || '',
      descriptionFr: dish.descriptionFr || '',
      inStock: dish.inStock !== false,
      isSignature: Boolean(dish.isSignature),
      badge: dish.badge || '',
      badgeFr: dish.badgeFr || '',
    });
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingDish) {
      updateMenuItem(editingDish.id, formData);
    } else {
      createMenuItem(formData);
    }

    setIsModalOpen(false);
    refreshDishes();
  };

  // Handle Delete
  const handleDeleteDish = (id) => {
    if (window.confirm(t.admin.confirmDelete)) {
      deleteMenuItem(id);
      refreshDishes();
    }
  };

  // Handle Quick Stock Toggle
  const handleToggleStock = (id) => {
    toggleItemStock(id);
    refreshDishes();
  };

  // Handle Reset Defaults
  const handleResetDefaults = () => {
    if (window.confirm(t.admin.resetConfirm)) {
      resetMenuToDefaults();
      refreshDishes();
    }
  };

  // Toggle Day Selection
  const toggleDaySelection = (day) => {
    setFormData((prev) => {
      const exists = prev.days.includes(day);
      const newDays = exists
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return {
        ...prev,
        days: newDays.length > 0 ? newDays : ['Monday'],
      };
    });
  };

  // Filter Dishes
  const filteredDishes = dishes.filter((dish) => {
    const matchesDay =
      filterDay === 'All' || (dish.days && dish.days.includes(filterDay));
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesDay;
    const name = (dish.name || '').toLowerCase();
    const nameFr = (dish.nameFr || '').toLowerCase();
    return matchesDay && (name.includes(query) || nameFr.includes(query));
  });

  // Stats calculation
  const totalCount = dishes.length;
  const activeTodayCount = dishes.filter(
    (d) => d.days && d.days.includes(todayName)
  ).length;
  const inStockCount = dishes.filter((d) => d.inStock !== false).length;
  const soldOutCount = dishes.filter((d) => d.inStock === false).length;

  // ---------------- LOGIN FORM ----------------
  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#0B0B0B]">
        <div className="w-full max-w-md bg-[#1A120B] border border-[#D4AF37]/35 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-2xl">
              👑
            </div>
            <h1 className="text-2xl font-serif font-bold gold-gradient-text">
              {t.admin.loginTitle}
            </h1>
            <p className="text-xs text-zinc-400">
              {t.admin.loginSubtitle}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs text-center">
              {t.admin.invalidCredentials}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.username}
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.password}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="diamond2026"
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="text-[11px] text-zinc-500 italic text-center">
              Default demo credentials: username <strong>admin</strong> / password <strong>diamond2026</strong>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3 text-sm font-bold tracking-wider"
            >
              {t.admin.signIn}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              ← {t.admin.viewSite}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Navigation & Status Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif gold-gradient-text">
              {t.admin.dashboardTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#E5C158]">
              Web Storage Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t.admin.webStorageNotice}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37]/10 transition-colors"
          >
            {t.admin.viewSite}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/60 border border-red-800/50 text-red-300 hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            {t.admin.logout}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#1A120B] border border-[#D4AF37]/30 space-y-1 shadow-md">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              {t.admin.totalDishes}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-[#D4AF37]">
              {totalCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A120B] border border-[#D4AF37]/30 space-y-1 shadow-md">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              {t.admin.activeToday} ({getDayLabel(todayName, lang)})
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {activeTodayCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A120B] border border-emerald-900/40 space-y-1 shadow-md">
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">
              {t.admin.inStock}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-300">
              {inStockCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A120B] border border-red-900/40 space-y-1 shadow-md">
            <span className="text-xs text-red-400 uppercase tracking-wider font-medium">
              {t.admin.soldOut}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-red-300">
              {soldOutCount}
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#140E08] border border-[#D4AF37]/25">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 font-bold"
            >
              <span>+</span>
              <span>{t.admin.addDish}</span>
            </Button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-[#D4AF37] hover:text-[#E5C158] transition-colors cursor-pointer"
            >
              ↺ {t.admin.resetDefaults}
            </button>
          </div>

          {/* Search & Day Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Filter by Day dropdown */}
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="w-full sm:w-auto bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">{t.admin.filterAll}</option>
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {getDayLabel(d, lang)}
                </option>
              ))}
            </select>

            {/* Search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.admin.searchPlaceholder}
              className="w-full sm:w-60 bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dishes Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/30 bg-[#1A120B] shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0B0B0B] text-zinc-400 uppercase text-[11px] tracking-wider border-b border-[#D4AF37]/20 font-serif">
              <tr>
                <th className="py-4 px-4">{t.admin.tableImage}</th>
                <th className="py-4 px-4">{t.admin.tableName}</th>
                <th className="py-4 px-4">{t.admin.tablePrice}</th>
                <th className="py-4 px-4">{t.admin.tableDays}</th>
                <th className="py-4 px-4">{t.admin.tableStock}</th>
                <th className="py-4 px-4 text-right">{t.admin.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10 text-zinc-200">
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <tr
                    key={dish.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Image Preview */}
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black">
                        <Image
                          src={dish.image || '/images/placeholder-food.jpg'}
                          alt={dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Names */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-serif">
                        {dish.name}
                      </div>
                      {dish.nameFr && dish.nameFr !== dish.name && (
                        <div className="text-[11px] text-zinc-400 italic">
                          {dish.nameFr}
                        </div>
                      )}
                      <div className="mt-1">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#2C1E12] text-[#E5C158] border border-[#D4AF37]/20">
                          {dish.category || 'cameroonian'}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#D4AF37] whitespace-nowrap">
                      {dish.price}
                    </td>

                    {/* Days Assigned */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(dish.days || []).map((d) => (
                          <span
                            key={d}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              d === todayName
                                ? 'bg-[#D4AF37] text-black font-bold'
                                : 'bg-[#0B0B0B] text-zinc-400 border border-zinc-800'
                            }`}
                          >
                            {d.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(dish.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          dish.inStock !== false
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                            : 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900/80'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dish.inStock !== false ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span>
                          {dish.inStock !== false
                            ? t.admin.inStock
                            : t.admin.soldOut}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(dish)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
                        >
                          {t.admin.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/50 border border-red-800/40 text-red-400 hover:bg-red-900/60 transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                    No dishes found. Click &quot;Add Food Item&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- ADD / EDIT DISH MODAL ---------------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDish ? t.admin.modalEditTitle : t.admin.modalAddTitle}
      >
        <form onSubmit={handleSaveDish} className="space-y-5">
          {/* Dish Name EN & FR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldDishNameEn} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Royal Achu Delicacy"
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldDishNameFr}
              </label>
              <input
                type="text"
                value={formData.nameFr}
                onChange={(e) =>
                  setFormData({ ...formData, nameFr: e.target.value })
                }
                placeholder="e.g. Achu Royal au Bouillon Doré"
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldPrice} *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="7,500 FCFA"
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldCategory}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="cameroonian">Cameroonian Traditional (90%)</option>
                <option value="continental">Chef Specialty / Continental</option>
                <option value="beverages">Beverage / Wine & Cocktail</option>
              </select>
            </div>
          </div>

          {/* Image Presets or Custom URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
              {t.admin.fieldImage}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`p-1.5 rounded-lg border text-[11px] text-left transition-all truncate cursor-pointer ${
                    formData.image === preset.url
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#E5C158] font-bold'
                      : 'border-zinc-800 bg-[#0B0B0B] text-zinc-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="/images/food/achu.jpg or external https URL"
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none"
            />
          </div>

          {/* Assigned Days of the Week */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
              {t.admin.fieldDays} *
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((d) => {
                const checked = formData.days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDaySelection(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      checked
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-sm font-bold'
                        : 'bg-[#0B0B0B] text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {getDayLabel(d, lang)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description EN & FR */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldDescEn}
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Delicious tender traditional meal seasoned with Penja pepper..."
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin.fieldDescFr}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionFr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionFr: e.target.value })
                }
                placeholder="Mets traditionnel délicat préparé aux épices de montagne..."
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* In Stock & Signature Checkboxes */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-black border-zinc-700"
              />
              <span className="font-semibold text-white">{t.admin.fieldInStock}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSignature}
                onChange={(e) =>
                  setFormData({ ...formData, isSignature: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-black border-zinc-700"
              />
              <span>Signature Dish</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              {t.admin.cancel}
            </Button>
            <Button
              type="submit"
              variant="gold"
              className="px-6 font-bold"
            >
              {t.admin.save}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
