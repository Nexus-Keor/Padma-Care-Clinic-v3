import React from 'react';
import { Doctor } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrencyBDT, toBanglaNumeral, isDoctorAvailableToday } from '../utils/clinicLogic';
import {
  X,
  CalendarCheck,
  Clock,
  MapPin,
  GraduationCap,
  Award,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookSerial: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookSerial,
}) => {
  const { language, t } = useLanguage();
  if (!doctor) return null;

  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close doctor details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Header Profile */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
          <img
            src={doctor.avatarUrl}
            alt={isBn ? doctor.nameBn : doctor.nameEn}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md shrink-0"
          />
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {isBn ? doctor.departmentNameBn : doctor.departmentNameEn}
              </span>
              {isDoctorAvailableToday(doctor) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  {t('availableTodayOnly')}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isBn ? doctor.nameBn : doctor.nameEn}
            </h3>

            <p className="text-sm font-semibold text-emerald-700">
              {isBn ? doctor.titleBn : doctor.titleEn}
            </p>

            <p className="text-xs text-slate-500">
              {isBn ? doctor.designationBn : doctor.designationEn}
            </p>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="py-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {isBn ? 'শিক্ষাগত যোগ্যতা ও ডিগ্রি' : 'Degrees & Medical Qualifications'}
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {isBn ? doctor.degreesBn : doctor.degreesEn}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {isBn ? 'চেম্বার সময় ও বসার দিন' : 'Visiting Schedule & Days'}
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {isBn ? doctor.scheduleBn : doctor.scheduleEn}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {isBn ? 'চেম্বার ও রুম নম্বর' : 'Chamber Room Location'}
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {isBn ? doctor.chamberBn : doctor.chamberEn}
                </p>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="text-sm text-slate-600 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              {isBn ? 'চিকিৎসকের পরিচিতি ও অভিজ্ঞতা' : 'Doctor Background & Clinical Focus'}
            </h4>
            <p>{isBn ? doctor.bioBn : doctor.bioEn}</p>
          </div>

          {/* Fees and Serial Counter Details */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {t('consultationFee')}
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {formatCurrencyBDT(doctor.feeBDT, language)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">
                {isBn ? 'চেম্বার হেল্পলাইন' : 'Serial Phone Inquiry'}
              </span>
              <a
                href={`tel:${doctor.phone}`}
                className="text-sm font-bold text-white hover:text-emerald-300 font-mono flex items-center gap-1 justify-end"
              >
                <Phone className="w-3.5 h-3.5" />
                {isBn ? toBanglaNumeral(doctor.phone) : doctor.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {t('btnCancel')}
          </button>
          <button
            onClick={() => {
              onClose();
              onBookSerial(doctor);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{t('bookSerialWithDoctor')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
