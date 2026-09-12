'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getReservationUrl, DEFAULT_PHONE } from '@/utils/whatsapp';
import Button from '@/components/ui/Button';

export default function ReservationPage() {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    dateTime: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastUrl, setLastUrl] = useState('');

  const guestOptions = [
    { value: '1', label: t.reservation.guest1 },
    { value: '2', label: t.reservation.guest2 },
    { value: '4', label: t.reservation.guest3 },
    { value: '6', label: t.reservation.guestVIP },
    { value: '10+', label: t.reservation.guestEvent },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const guestLabel =
      guestOptions.find((g) => g.value === formData.guests)?.label ||
      `${formData.guests} persons`;

    const url = getReservationUrl(
      {
        name: formData.name,
        phone: formData.phone,
        guests: guestLabel,
        dateTime: formData.dateTime,
        notes: formData.notes,
      },
      lang
    );

    setLastUrl(url);
    setSubmitted(true);

    // Open WhatsApp in a new browser tab
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-100 py-12 sm:py-20 relative overflow-hidden">
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif gold-gradient-text tracking-tight">
            {t.reservation.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t.reservation.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reservation Form Column */}
          <div className="lg:col-span-7 bg-[#1A120B] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-md">
            {submitted ? (
              <div className="py-12 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E5C158] text-black flex items-center justify-center text-3xl mx-auto shadow-lg shadow-[#D4AF37]/30">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#E5C158]">
                    {lang === 'fr'
                      ? 'Redirection vers WhatsApp en cours...'
                      : 'Redirecting to WhatsApp...'}
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto">
                    {lang === 'fr'
                      ? 'Si la fenêtre ne s’est pas ouverte automatiquement, cliquez sur le bouton ci-dessous pour transmettre votre réservation au concierge Diamond C.'
                      : 'If WhatsApp did not open automatically, click the button below to send your reservation directly to the Diamond C Concierge.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <a
                    href={lastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-colors shadow-md"
                  >
                    <span>{lang === 'fr' ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}</span>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    {lang === 'fr' ? 'Modifier la réservation' : 'Modify Reservation'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                      {t.reservation.fullName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t.reservation.namePlaceholder}
                      className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                      {t.reservation.phoneNumber} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t.reservation.phonePlaceholder}
                      className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                {/* Guests & Date/Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                      {t.reservation.guests} <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {guestOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#121212]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                      {t.reservation.dateTime} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.dateTime}
                      onChange={(e) =>
                        setFormData({ ...formData, dateTime: e.target.value })
                      }
                      className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                {/* Special Notes (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
                    {t.reservation.notes}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder={t.reservation.notesPlaceholder}
                    className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full py-4 text-sm font-bold tracking-wider"
                  >
                    <span>{t.reservation.submitBtn}</span>
                  </Button>
                  <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                    {t.reservation.instantNotice}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Information & Lounge Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Telephone Concierge Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A120B] to-[#2C1E12] border border-[#D4AF37]/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-lg text-[#D4AF37]">
                  📞
                </div>
                <div>
                  <h4 className="text-sm font-bold font-serif text-[#E5C158]">
                    {t.reservation.directCallTitle}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {t.reservation.directCallDesc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
                <span className="font-mono text-base font-bold text-white tracking-wider">
                  +237 670 19 98 59
                </span>
                <a
                  href={`tel:+${DEFAULT_PHONE}`}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#D4AF37]/15 border border-[#D4AF37] text-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Opening Hours Summary */}
            <div className="p-6 rounded-3xl bg-[#140E08] border border-[#D4AF37]/20 text-xs text-zinc-400 space-y-2">
              <p className="font-bold text-[#E5C158] uppercase tracking-wider">
                Service Schedule
              </p>
              <p>• Monday – Sunday: 8:00 AM – 11:00 PM</p>
              <p>• Group Banquets & Events: Reservations recommended in advance</p>
              <p>• Dedicated event maître d&apos; provided upon request</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
