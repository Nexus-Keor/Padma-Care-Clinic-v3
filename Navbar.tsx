import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartPulse,
  Globe,
  PhoneCall,
  Menu,
  X,
  CalendarCheck,
  Stethoscope,
  Building2,
  HardDrive,
  MapPin,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onOpenBooking: () => void;
  user: User | null;
  onGoogleSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, user, onGoogleSignIn }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: t('navHome'), icon: HeartPulse },
    { href: '#doctors', label: t('navDoctors'), icon: Stethoscope },
    { href: '#departments', label: t('navDepartments'), icon: Building2 },
    { href: '#booking', label: t('navBooking'), icon: CalendarCheck, onClick: onOpenBooking },
    { href: '#drive', label: t('navDriveFiles'), icon: HardDrive },
    { href: '#rajshahi', label: t('navRajshahiInfo'), icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <a href="#home" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('clinicName')}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {language === 'bn' ? 'রাজশাহী' : 'Rajshahi'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                {t('clinicSubtitle')} &bull; RMCH Gate 2
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1.5 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language English or Bengali"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all shadow-2xs cursor-pointer focus:ring-2 focus:ring-emerald-500/30"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className={language === 'en' ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                EN
              </span>
              <span className="text-slate-300">|</span>
              <span className={language === 'bn' ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                বাংলা
              </span>
            </button>

            {/* Google Drive Status Button */}
            {user ? (
              <a
                href="#drive"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title={`Signed in as ${user.email}`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
              </a>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                title="Connect Google Drive to save appointment slips"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Drive</span>
              </button>
            )}

            {/* Book Serial Primary Button */}
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t('navBooking')}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Language toggle + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-300 bg-slate-50 text-slate-800"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">
              {language === 'bn' ? 'ভাষা নির্বাচন করুন:' : 'Interface Language:'}
            </div>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"
            >
              {language === 'en' ? 'বাংলা সংস্করণ চালু করুন' : 'Switch to English'}
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t('navBooking')}</span>
            </button>

            <a
              href="tel:+8801711234567"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-red-50 text-red-700 border border-red-200"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>{t('emergencyHotline')}: +880 1711-234567</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
