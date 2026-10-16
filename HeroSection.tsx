import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { toBanglaNumeral } from '../utils/clinicLogic';
import {
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onBrowseDoctors: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onBrowseDoctors }) => {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-10 pb-16 lg:py-20">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-teal-600 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Location & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('heroBadge')}</span>
              <span className="hidden sm:inline text-emerald-400/40">&bull;</span>
              <span className="hidden sm:inline text-emerald-200">
                {language === 'bn' ? 'লক্ষ্মীপুর, রামেক গেট ২ সংলগ্ন' : 'Laxmipur, RMCH Gate 2'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug">
              {t('heroTitle')}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              {t('heroDescription')}
            </p>

            {/* Bullet features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn' ? 'রামেক হাসপাতালের অধ্যাপক ও বিশেষজ্ঞ' : 'RMCH Professors & Senior Specialists'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn' ? 'তাৎক্ষণিক সিরিয়াল টোকেন ও এসএমএস' : 'Instant Serial Token & Chamber Timing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn' ? 'গুগল ড্রাইভে প্রেসক্রিপশন-স্লিপ ব্যাকআপ' : 'Google Drive Patient Records Cloud'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn' ? '২৪ ঘন্টা ইসিজি, ইউএসজি ও প্যাথলজি ল্যাব' : '24/7 Digital ECG, 4D USG & Diagnostics'}
                </span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <CalendarCheck className="w-5 h-5 text-slate-950" />
                <span>{t('heroBtnBook')}</span>
              </button>

              <button
                onClick={onBrowseDoctors}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                <Stethoscope className="w-5 h-5 text-emerald-300" />
                <span>{t('heroBtnDoctors')}</span>
              </button>
            </div>
          </div>

          {/* Quick Info & Schedule Card Column */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {language === 'bn' ? 'আজকের চেম্বার তথ্য' : 'Chamber Today'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {language === 'bn' ? 'লক্ষ্মীপুর শাখা' : 'Laxmipur Branch'}
                </span>
              </div>

              {/* Chamber Timings */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' ? 'বিশেষজ্ঞ চেম্বার সময়সূচী' : 'Specialist Chamber Timings'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'bn'
                        ? 'প্রতিদিন বিকাল ৩:৩০ হতে রাত ১০:০০ পর্যন্ত (শুক্রবার সীমিত)'
                        : 'Daily 03:30 PM - 10:00 PM (Friday Limited)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' ? 'সরাসরি চেম্বার অবস্থান' : 'Chamber Location in Rajshahi'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'bn'
                        ? 'রামেক হাসপাতালের ২ নং গেটের বিপরীতে, গ্রেটার রোড, রাজশাহী'
                        : 'Opposite RMCH Gate 2, Greater Road, Boalia, Rajshahi'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-red-950/40 p-3.5 rounded-xl border border-red-500/30">
                  <PhoneCall className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-300">
                      {language === 'bn' ? 'জরুরি অ্যাম্বুলেন্স ও হটলাইন' : 'Emergency Ambulance Hotline'}
                    </h4>
                    <p className="text-xs text-red-200 mt-0.5 font-mono font-bold">
                      +880 1712-998877 &bull; 025888-61234
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Notice Snippet */}
              <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-700/50">
                <span className="text-amber-400 font-semibold">Demo Notice:</span>{' '}
                {language === 'bn' 
                  ? 'সিরিয়াল বুকিং সম্পন্ন হলে গুগল ড্রাইভে সংরক্ষণ ও প্রিন্ট কপি পাওয়া যাবে।'
                  : 'Serial confirmation slips can be saved directly to your Google Drive or printed.'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {language === 'bn' ? toBanglaNumeral('12+') : '12+'}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('statDoctors')}</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">
              {language === 'bn' ? toBanglaNumeral('08') : '08'}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('statDepartments')}</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {language === 'bn' ? toBanglaNumeral('24/7') : '24/7'}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('statEmergency')}</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
              {language === 'bn' ? '১০০%' : '100%'}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('statToken')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
