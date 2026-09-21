'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { DAYS_OF_WEEK } from '@/utils/days';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// Preset Cameroonian dish images for fast selection if desired
const IMAGE_PRESETS = [
  { label: 'Achu (Yellow Soup)', url: '/images/food/achu.jpg' },
  { label: 'Wild Eru & Fufu', url: '/images/food/eru.jpg' },
  { label: 'Poisson Braisé / Tilapia', url: '/images/food/grilled-fish.jpg' },
  { label: 'Royal Ndolé & Gambas', url: '/images/food/ndole.jpg' },
  { label: 'Kati Kati Chicken', url: '/images/food/katikati.jpg' },
  { label: 'Special Meal', url: '/images/placeholder-food.jpg' },
];

export default function AdminPage() {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Menu State
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const fileInputRef = useRef(null);

  // Form State inside Modal (Simplified: No assigned days!)
  const [formData, setFormData] = useState({
    name: '',
    nameFr: '',
    price: '',
    category: 'cameroonian',
    image: '/images/food/achu.jpg',
    description: '',
    descriptionFr: '',
    inStock: true,
    isSignature: false,
    badge: '',
    badgeFr: '',
  });

  // Load auth & dishes
  const refreshDishes = () => {
    setDishes(getMenuItems());
  };

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAdminAuthenticated());
    setDishes(getMenuItems());

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
      description: dish.description || '',
      descriptionFr: dish.descriptionFr || '',
      inStock: dish.inStock !== false,
      isSignature: Boolean(dish.isSignature),
      badge: dish.badge || '',
      badgeFr: dish.badgeFr || '',
    });
    setIsModalOpen(true);
  };

  // Handle Image File Upload (converts & compresses to Base64)
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Compress using off-screen canvas to keep base64 compact
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scaleSize = MAX_WIDTH / img.width;
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle Save (Create or Update)
  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    // Automatically make dish available on all days
    const dishPayload = {
      ...formData,
      days: DAYS_OF_WEEK,
    };

    if (editingDish) {
      updateMenuItem(editingDish.id, dishPayload);
    } else {
      createMenuItem(dishPayload);
    }

    setIsModalOpen(false);
    refreshDishes();
  };

  // Handle Delete
  const handleDeleteDish = (id) => {
    if (window.confirm(t.admin?.confirmDelete || 'Are you sure you want to delete this meal item?')) {
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
    if (window.confirm(t.admin?.resetConfirm || 'Reset menu to original restaurant items?')) {
      resetMenuToDefaults();
      refreshDishes();
    }
  };

  // Filter Dishes by search
  const filteredDishes = dishes.filter((dish) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const name = (dish.name || '').toLowerCase();
    const nameFr = (dish.nameFr || '').toLowerCase();
    const desc = (dish.description || '').toLowerCase();
    return name.includes(query) || nameFr.includes(query) || desc.includes(query);
  });

  // Stats calculation
  const totalCount = dishes.length;
  const inStockCount = dishes.filter((d) => d.inStock !== false).length;
  const soldOutCount = dishes.filter((d) => d.inStock === false).length;

  // ---------------- HYDRATION GUARD ----------------
  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0B0B0B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

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
              {t.admin?.loginTitle || 'Admin Portal'}
            </h1>
            <p className="text-xs text-zinc-400">
              {t.admin?.loginSubtitle || 'Sign in to manage meals and restaurant inventory'}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs text-center">
              {t.admin?.invalidCredentials || 'Invalid username or password'}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin?.username || 'Username'}
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
                {t.admin?.password || 'Password'}
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
              Default credentials: username <strong>admin</strong> / password <strong>diamond2026</strong>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3 text-sm font-bold tracking-wider"
            >
              {t.admin?.signIn || 'Sign In'}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              ← {t.admin?.viewSite || 'Back to Website'}
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
              {t.admin?.dashboardTitle || 'Diamond C | Menu Administration'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t.admin?.webStorageNotice || 'Upload meals, update pricing, and toggle dish availability.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37]/10 transition-colors"
          >
            {t.admin?.viewSite || 'View Site'}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/60 border border-red-800/50 text-red-300 hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            {t.admin?.logout || 'Logout'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#1A120B] border border-[#D4AF37]/30 space-y-1 shadow-md">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              {t.admin?.totalDishes || 'Total Dishes'}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-[#D4AF37]">
              {totalCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A120B] border border-emerald-900/40 space-y-1 shadow-md">
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">
              {t.admin?.inStock || 'In Stock (Available)'}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-300">
              {inStockCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A120B] border border-red-900/40 space-y-1 shadow-md">
            <span className="text-xs text-red-400 uppercase tracking-wider font-medium">
              {t.admin?.soldOut || 'Sold Out'}
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-red-300">
              {soldOutCount}
            </p>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#140E08] border border-[#D4AF37]/25">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 font-bold shadow-md shadow-[#D4AF37]/20"
            >
              <span>+</span>
              <span>{t.admin?.addDish || 'Add Food Item'}</span>
            </Button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-[#D4AF37] hover:text-[#E5C158] transition-colors cursor-pointer"
            >
              ↺ {t.admin?.resetDefaults || 'Reset Defaults'}
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.admin?.searchPlaceholder || 'Search meals...'}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Dishes Table (Clean & Simple) */}
        <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/30 bg-[#1A120B] shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0B0B0B] text-zinc-400 uppercase text-[11px] tracking-wider border-b border-[#D4AF37]/20 font-serif">
              <tr>
                <th className="py-4 px-4">{t.admin?.tableImage || 'Food Image'}</th>
                <th className="py-4 px-4">{t.admin?.tableName || 'Dish Details'}</th>
                <th className="py-4 px-4">{t.admin?.tablePrice || 'Price'}</th>
                <th className="py-4 px-4">{t.admin?.tableStock || 'Status'}</th>
                <th className="py-4 px-4 text-right">{t.admin?.tableActions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10 text-zinc-200">
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <tr
                    key={dish.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Food Image */}
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black">
                        <Image
                          src={dish.image || '/images/placeholder-food.jpg'}
                          alt={dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Dish Details */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-serif text-sm">
                        {dish.name}
                      </div>
                      {dish.nameFr && dish.nameFr !== dish.name && (
                        <div className="text-[11px] text-zinc-400 italic">
                          {dish.nameFr}
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#2C1E12] text-[#E5C158] border border-[#D4AF37]/20">
                          {dish.category || 'cameroonian'}
                        </span>
                        {dish.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
                            {dish.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#D4AF37] whitespace-nowrap text-sm">
                      {dish.price}
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
                            ? (t.admin?.inStock || 'In Stock')
                            : (t.admin?.soldOut || 'Sold Out')}
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
                          {t.admin?.edit || 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/50 border border-red-800/40 text-red-400 hover:bg-red-900/60 transition-colors cursor-pointer"
                          title="Delete dish"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 italic">
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
        title={editingDish ? (t.admin?.modalEditTitle || 'Edit Food Item') : (t.admin?.modalAddTitle || 'Add Food Item')}
      >
        <form onSubmit={handleSaveDish} className="space-y-5">
          {/* FOOD IMAGE UPLOAD SECTION */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#0B0B0B] border border-[#D4AF37]/30">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E5C158]">
              {t.admin?.fieldImage || 'Food Image'} *
            </label>

            {/* Current Image Preview & Upload Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-black shadow-lg">
                <Image
                  src={formData.image || '/images/placeholder-food.jpg'}
                  alt="Food Preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 font-bold text-xs"
                >
                  📁 Upload Food Photo
                </Button>

                <p className="text-[11px] text-zinc-400">
                  Select an image file (PNG, JPG, WebP) from your device. It will be uploaded and stored automatically.
                </p>
              </div>
            </div>

            {/* Optional Fast Presets */}
            <div className="pt-2 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Or select from gallery presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                    className={`px-2 py-1 rounded-lg border text-[11px] text-left truncate transition-all cursor-pointer ${
                      formData.image === preset.url
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#E5C158] font-bold'
                        : 'border-zinc-800 bg-[#16100A] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dish Name EN & FR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin?.fieldDishNameEn || 'Dish Name (EN)'} *
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
                {t.admin?.fieldDishNameFr || 'Dish Name (FR)'}
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
                {t.admin?.fieldPrice || 'Price (e.g. 7,500 FCFA)'} *
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
                {t.admin?.fieldCategory || 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="cameroonian">Cameroonian Traditional</option>
                <option value="continental">Chef Specialty / Continental</option>
                <option value="beverages">Beverage / Wine & Cocktail</option>
              </select>
            </div>
          </div>

          {/* Description EN & FR */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin?.fieldDescEn || 'Description (EN)'}
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief appetizing description of this meal..."
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                {t.admin?.fieldDescFr || 'Description (FR)'}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionFr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionFr: e.target.value })
                }
                placeholder="Description en français..."
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
            <span className="text-xs text-zinc-300 font-semibold">
              {formData.inStock
                ? (t.admin?.inStock || 'In Stock (Available for ordering)')
                : (t.admin?.soldOut || 'Sold Out')}
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.admin?.cancel || 'Cancel'}
            </button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              className="px-6 py-2.5 font-bold text-xs shadow-md shadow-[#D4AF37]/20"
            >
              {editingDish ? (t.admin?.updateDish || 'Save Changes') : (t.admin?.saveDish || 'Add Dish')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
