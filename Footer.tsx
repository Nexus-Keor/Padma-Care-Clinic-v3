import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_INFO } from '../data/clinicData';
import { HeartPulse, MapPin, PhoneCall, Mail, AlertCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                {t('clinicName')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isBn ? CLINIC_INFO.taglineBn : CLINIC_INFO.taglineEn}
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{isBn ? CLINIC_INFO.addressBn : CLINIC_INFO.addressEn}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isBn ? 'প্রয়োজনীয় লিংক' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">
                  {t('navHome')}
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-emerald-400 transition-colors">
                  {t('navDoctors')}
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t('navDepartments')}
                </a>
              </li>
              <li>
                <a href="#drive" className="hover:text-emerald-400 transition-colors">
                  {t('navDriveFiles')}
                </a>
              </li>
              <li>
                <a href="#rajshahi" className="hover:text-emerald-400 transition-colors">
                  {t('navRajshahiInfo')}
                </a>
              </li>
            </ul>
          </div>

          {/* Key Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isBn ? 'প্রধান বিভাগসমূহ' : 'Specialized Clinics'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>{isBn ? 'হৃদরোগ বিভাগ (কার্ডিওলজি)' : 'Cardiology & Echo'}</li>
              <li>{isBn ? 'মেডিসিন ও ডায়াবেটিস কেয়ার' : 'Medicine & Diabetology'}</li>
              <li>{isBn ? 'স্ত্রীরোগ ও প্রসূতি বিভাগ' : 'Gynecology & Antenatal'}</li>
              <li>{isBn ? 'শিশু ও কিশোর বিভাগ' : 'Pediatrics & Newborn Care'}</li>
              <li>{isBn ? 'অর্থোপেডিক ও ট্রমা সার্জারি' : 'Orthopedics & Spine'}</li>
              <li>{isBn ? 'ডিজিটাল প্যাথলজি ল্যাব' : 'Digital Pathology & Lab'}</li>
            </ul>
          </div>

          {/* Hotlines & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isBn ? 'জরুরি যোগাযোগ' : 'Emergency & Helplines'}
            </h4>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-slate-400 block">{isBn ? 'সিরিয়াল বুকিং ডেস্ক:' : 'Chamber Serial Booking:'}</span>
                <span className="font-bold text-white font-mono">{CLINIC_INFO.phone}</span>
              </p>
              <p>
                <span className="text-slate-400 block">{isBn ? 'কার্ডিয়াক অ্যাম্বুলেন্স:' : 'Cardiac Ambulance:'}</span>
                <span className="font-bold text-red-400 font-mono">{CLINIC_INFO.ambulance}</span>
              </p>
              <p>
                <span className="text-slate-400 block">{isBn ? 'রামেক হাসপাতাল জরুরি:' : 'RMCH Emergency:'}</span>
                <span className="font-bold text-white font-mono">{CLINIC_INFO.emergencyLandline}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Demo Notice */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Padma Care Clinic &bull; Laxmipur, Rajshahi, Bangladesh.
          </p>
          <div className="flex items-center gap-2 text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isBn ? 'ডেমো ও প্রোটোটাইপ সংস্করণ' : 'Prototype Demonstration Portal for Rajshahi Clinics'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
