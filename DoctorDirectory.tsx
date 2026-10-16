import React, { useState } from 'react';
import { Doctor } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import { filterDoctors, formatCurrencyBDT, toBanglaNumeral, isDoctorAvailableToday } from '../utils/clinicLogic';
import { DEPARTMENTS, DAYS_OF_WEEK } from '../data/clinicData';
import { DoctorProfileModal } from './DoctorProfileModal';
import {
  Search,
  Filter,
  CalendarCheck,
  Eye,
  Clock,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  selectedDepartmentId: string;
  onSelectDepartment: (deptId: string) => void;
  onBookSerial: (doctor: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  selectedDepartmentId,
  onSelectDepartment,
  onBookSerial,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  const isBn = language === 'bn';

  // Filter doctors
  const filteredDoctors = filterDoctors(
    doctors,
    selectedDepartmentId,
    searchQuery,
    selectedDay
  );

  return (
    <section id="doctors" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isBn ? 'রাজশাহীর স্বনামধন্য চিকিৎসকবৃন্দ' : 'Renowned Specialists of Rajshahi'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('doctorsHeading')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('doctorsSubheading')}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                aria-label="Search doctors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Day of Week Selector */}
            <div className="md:col-span-4">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full py-3 px-3.5 rounded-xl border border-slate-300 bg-slate-50/50 text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                aria-label="Filter by visiting day"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.id} value={day.id}>
                    {isBn ? day.labelBn : day.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => onSelectDepartment('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedDepartmentId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('filterAllDepts')}
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => onSelectDepartment(dept.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedDepartmentId === dept.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isBn ? dept.nameBn : dept.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 max-w-lg mx-auto">
            <p className="text-slate-600 font-medium text-sm">{t('noDoctorsFound')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectDepartment('all');
                setSelectedDay('all');
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatarUrl}
                      alt={isBn ? doc.nameBn : doc.nameEn}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {isBn ? doc.departmentNameBn : doc.departmentNameEn}
                        </span>
                        {isDoctorAvailableToday(doc) && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {t('availableTodayOnly')}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {isBn ? doc.nameBn : doc.nameEn}
                      </h3>

                      <p className="text-xs font-semibold text-emerald-700 line-clamp-1">
                        {isBn ? doc.titleBn : doc.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Degrees & Designation */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 line-clamp-1">
                      {isBn ? doc.degreesBn : doc.degreesEn}
                    </p>
                    <p className="text-slate-500 line-clamp-1">
                      {isBn ? doc.designationBn : doc.designationEn}
                    </p>
                  </div>

                  {/* Chamber details & Time */}
                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">
                        {isBn ? doc.scheduleBn : doc.scheduleEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">
                        {isBn ? doc.chamberBn : doc.chamberEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Action Row */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      {t('consultationFee')}
                    </span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {formatCurrencyBDT(doc.feeBDT, language)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingDoctor(doc)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
                      title={t('doctorDetails')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onBookSerial(doc)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>{t('bookSerialWithDoctor')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Details Modal */}
      <DoctorProfileModal
        doctor={viewingDoctor}
        onClose={() => setViewingDoctor(null)}
        onBookSerial={(doc) => {
          setViewingDoctor(null);
          onBookSerial(doc);
        }}
      />
    </section>
  );
};
