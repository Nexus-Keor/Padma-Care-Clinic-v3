import React from 'react';
import { Department } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartPulse,
  Stethoscope,
  Baby,
  Smile,
  Activity,
  Brain,
  Microscope,
  Ambulance,
  Clock,
  MapPin,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';

interface DepartmentSectionProps {
  departments: Department[];
  onSelectDepartment: (deptId: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Stethoscope,
  Baby,
  Smile,
  Activity,
  Brain,
  Microscope,
  Ambulance,
};

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({
  departments,
  onSelectDepartment,
}) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="departments" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <Shield className="w-3.5 h-3.5 text-teal-700" />
            <span>{isBn ? 'আধুনিক চিকিৎসা সেবা' : 'Multidisciplinary Medical Care'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('departmentsHeading')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('departmentsSubheading')}
          </p>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = ICON_MAP[dept.iconName] || Stethoscope;
            return (
              <div
                key={dept.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Department Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {isBn ? dept.nameBn : dept.nameEn}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {isBn ? dept.descriptionBn : dept.descriptionEn}
                    </p>
                  </div>

                  {/* Room & Timing */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">{isBn ? dept.roomBn : dept.roomEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{isBn ? dept.timingBn : dept.timingEn}</span>
                    </div>
                  </div>

                  {/* Key Services Pill List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t('servicesOffered')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isBn ? dept.servicesBn : dept.servicesEn).slice(0, 3).map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Doctors Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      const el = document.getElementById('doctors');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                  >
                    <span>{isBn ? 'বিশেষজ্ঞ ডাক্তার দেখুন' : 'View Specialists'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
