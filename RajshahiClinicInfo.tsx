import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_INFO } from '../data/clinicData';
import {
  MapPin,
  PhoneCall,
  Clock,
  Compass,
  Navigation,
  Car,
  AlertCircle,
  Building,
} from 'lucide-react';

export const RajshahiClinicInfo: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="rajshahi" className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isBn ? 'লক্ষ্মীপুর, রাজশাহী' : 'Laxmipur Healthcare District'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('rajshahiGuideTitle')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('rajshahiGuideSubtitle')}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Location & Transit Guide */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {isBn ? 'ক্লিনিকের সুনির্দিষ্ট ঠিকানা ও অবস্থান' : 'Exact Clinic Address & Location'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Laxmipur Medical More, Rajshahi-6000
                  </p>
                </div>
              </div>

              {/* Simulated Map Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white p-6 shadow-inner">
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {isBn ? 'রাজশাহী মেডিকেল মোড় জোন' : 'Rajshahi Laxmipur Medical Zone'}
                    </span>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Prime Location
                    </span>
                  </div>

                  <div className="space-y-2 py-2">
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <strong className="text-white block font-semibold">
                          {isBn ? 'পদ্মা কেয়ার ক্লিনিক ও ডায়াগনস্টিক' : 'Padma Care Clinic & Diagnostic'}
                        </strong>
                        <span className="text-slate-300">
                          {isBn ? 'গ্রেটার রোড, লক্ষ্মীপুর মোড়' : 'Greater Road, Laxmipur Intersection'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5 text-slate-300 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                      <span>
                        {isBn
                          ? 'রামেক হাসপাতাল প্রধান ফটক ও ইমার্জেন্সি (রাস্তা পার হলেই)'
                          : 'RMCH Main Gate & Emergency (Across the street)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5 text-slate-300 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <span>
                        {isBn
                          ? 'সিঅ্যান্ডবি মোড় ও কোর্ট এলাকা (৫ মিনিট দূরত্ব)'
                          : 'C&B More & Rajshahi Court Area (5 mins away)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit & Commute Guide for Patients from Outside Rajshahi */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isBn
                      ? 'দূরবর্তী জেলা (নাটোর, নওগাঁ, চাঁপাইনবাবগঞ্জ) হতে যাতায়াত নির্দেশিকা:'
                      : 'Commute for Patients from Natore, Naogaon & Chapainawabganj:'}
                  </span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong>{isBn ? 'রাজশাহী রেলওয়ে স্টেশন / শিরোইল বাস টার্মিনাল হতে:' : 'From Rajshahi Railway Station / Shiroil:'}</strong>{' '}
                    {isBn
                      ? 'অটোরিকশা বা সিএনজি যোগে সরাসরি লক্ষ্মীপুর মোড়ে নামুন (ভাড়া ১৫-২০ টাকা, সময় ১০ মিনিট)।'
                      : 'Take a battery-operated auto-rickshaw directly to Laxmipur More (approx. 10 minutes).'}
                  </li>
                  <li>
                    <strong>{isBn ? 'চাঁপাইনবাবগঞ্জ ও গোদাগাড়ী রুট:' : 'From Chapainawabganj / Godagari:'}</strong>{' '}
                    {isBn
                      ? 'কাশিয়াডাঙ্গা মোড় হয়ে গ্রেটার রোড দিয়ে সরাসরি ক্লিনিকের সামনে গাড়ি পার্কিং ব্যবস্থা রয়েছে।'
                      : 'Via Kashiadanga crossing straight onto Greater Road with dedicated patient drop-off.'}
                  </li>
                </ul>
              </div>
            </div>

            {/* Address Banner */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              <strong>{isBn ? 'পূর্ণ ঠিকানা:' : 'Postal Address:'}</strong>{' '}
              {isBn ? CLINIC_INFO.addressBn : CLINIC_INFO.addressEn}
            </div>
          </div>

          {/* Right Column: Emergency & Hotlines */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {isBn ? 'জরুরি হেল্পলাইন ও সিরিয়াল ডেস্ক' : 'Emergency & Serial Hotline'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Direct Doctor Chamber Booking Line
                  </p>
                </div>
              </div>

              {/* Contacts List */}
              <div className="space-y-3 text-xs sm:text-sm">
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                >
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">
                      {t('receptionLabel')}
                    </span>
                    <span className="font-extrabold text-slate-900 group-hover:text-emerald-700 font-mono text-base">
                      {CLINIC_INFO.phone}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </a>

                <a
                  href={`tel:${CLINIC_INFO.ambulance}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-red-50/70 border border-red-200 hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                  <div>
                    <span className="text-xs text-red-700 block font-bold">
                      {t('ambulanceLabel')}
                    </span>
                    <span className="font-extrabold text-red-900 group-hover:text-red-700 font-mono text-base">
                      {CLINIC_INFO.ambulance}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'সিরিয়াল কাউন্টার খোলার সময়:' : 'Chamber Serial Counter Timings:'}</span>
                  </div>
                  <p className="text-slate-600 pl-6">
                    {isBn
                      ? 'প্রতিদিন সকাল ৮:০০ টা হতে রাত ১০:০০ টা পর্যন্ত। ফোনে অথবা অনলাইনে সিরিয়াল দেওয়া হয়।'
                      : 'Every day 8:00 AM to 10:00 PM. Serials booked online receive instant token priority.'}
                  </p>
                </div>
              </div>
            </div>

            {/* RMCH Direct Emergency Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{isBn ? 'রামেক হাসপাতাল জরুরি বিভাগ:' : 'RMCH Emergency Ward Notice:'}</span>
              </div>
              <p className="leading-relaxed">
                {isBn
                  ? 'তীব্র ট্রমা বা জরুরি আইসিইউ রোগীর জন্য নিকটস্থ রাজশাহী মেডিকেল কলেজ হাসপাতাল জরুরি বিভাগে দ্রুত যোগাযোগ করুন।'
                  : 'For acute polytrauma or intensive ICU needs, proceed to the adjacent RMCH Emergency Ward.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
