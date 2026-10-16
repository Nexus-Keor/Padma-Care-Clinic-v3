import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, X, Info, PhoneCall } from 'lucide-react';

export const DemoDisclaimerBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <aside aria-label="Demo notice banner" className="bg-amber-500 text-amber-950 border-b border-amber-600/30 px-4 py-2.5 text-xs sm:text-sm font-medium transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="inline-flex items-center gap-1 bg-amber-900 text-amber-100 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('demoBadge')}
            </span>
            <p className="line-clamp-1 sm:line-clamp-none text-amber-950 font-medium">
              {language === 'bn' 
                ? 'এটি একটি ডেমো প্ল্যাটফর্ম। সকল সিরিয়াল ও তথ্য প্রদর্শনীমূলক।' 
                : 'Interactive Demonstration Clinic Portal for Rajshahi. All appointment tokens are for demonstration.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2 hover:text-black cursor-pointer"
              aria-label="View demo details"
            >
              <Info className="w-3.5 h-3.5" />
              {language === 'bn' ? 'বিস্তারিত তথ্য' : 'How Demo Works'}
            </button>
            <span className="text-amber-700">|</span>
            <a
              href="tel:02588861234"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 hover:text-black"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-700" />
              <span className="hidden sm:inline">RMCH:</span> 025888-61234
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-900/80 hover:text-amber-950 hover:bg-amber-400/50 p-1 rounded-md transition-colors ml-1 cursor-pointer"
              aria-label="Dismiss demo notice banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Demo Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{t('demoNoticeTitle')}</h3>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                  Padma Care Clinic &bull; Rajshahi, Bangladesh
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 font-medium">
                {t('demoNoticeDesc')}
              </p>

              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider pt-2">
                {language === 'bn' ? 'কার্যপ্রণালী ও ডেমো নির্দেশনা:' : 'Demonstration Guidelines:'}
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                <li>
                  <strong>{language === 'bn' ? 'সিরিয়াল বুকিং:' : 'Serial Booking:'}</strong>{' '}
                  {language === 'bn'
                    ? 'যেকোনো ডাক্তারের জন্য পছন্দসই তারিখ নির্বাচন করে ফর্ম পূরণ করলে তাৎক্ষণিক ডিজিটাল টোকেন স্লিপ তৈরি হবে।'
                    : 'Selecting any specialist doctor and submitting the booking form produces an authentic digital chamber token.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? 'গুগল ড্রাইভ ইন্টিগ্রেশন:' : 'Google Drive Integration:'}</strong>{' '}
                  {language === 'bn'
                    ? 'আপনার গুগল অ্যাকাউন্ট দিয়ে সাইন ইন করে সরাসরি আপনার ড্রাইভ স্টোরেজে প্রেসক্রিপশন ও টোকেন রসিদ এইচটিএমএল হিসেবে সেভ করতে পারবেন।'
                    : 'Sign in with your Google account to backup and manage generated appointment slips directly in your personal Google Drive.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? 'জরুরি চিকিৎসা:' : 'Real Medical Emergencies:'}</strong>{' '}
                  {language === 'bn'
                    ? 'জরুরি পরিস্থিতিতে অনলাইন বুকিংয়ের অপেক্ষা না করে সরাসরি রাজশাহী মেডিকেল কলেজ হাসপাতালের ইমার্জেন্সিতে যান।'
                    : 'For real critical health emergencies, proceed directly to Rajshahi Medical College Hospital Emergency Department.'}
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'বুঝেছি, চালিয়ে যান' : 'Understood, Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
