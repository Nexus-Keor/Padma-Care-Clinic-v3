import React, { useState, useEffect } from 'react';
import { Doctor, ConfirmedAppointment, Language, AppointmentFormData } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import { TIME_SLOTS } from '../data/clinicData';
import {
  validateAppointment,
  generateSerialToken,
  formatCurrencyBDT,
  toBanglaNumeral,
  toEnglishNumeral,
  getClinicToday,
  addDaysToDateString,
  getNextVisitingDate,
  validateDoctorDate,
} from '../utils/clinicLogic';
import {
  X,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  HardDrive,
  User as UserIcon,
  Phone,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctor: Doctor | null;
  doctors: Doctor[];
  user: User | null;
  onSaveToDrive: (appointment: ConfirmedAppointment) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  initialDoctor,
  doctors,
  user,
  onSaveToDrive,
}) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  // State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  // Default to the first day (from tomorrow, Bangladesh time) that the pre-selected doctor sits
  const [appointmentDate, setAppointmentDate] = useState<string>(() =>
    getNextVisitingDate(
      initialDoctor || doctors[0],
      addDaysToDateString(getClinicToday(), 1)
    )
  );
  const [preferredSlot, setPreferredSlot] = useState<string>('Evening Slot 1 (04:30 PM - 06:30 PM)');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [patientAddress, setPatientAddress] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Confirmed appointment
  const [confirmedSlip, setConfirmedSlip] = useState<ConfirmedAppointment | null>(null);

  // Sync initial doctor
  useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctorId(initialDoctor.id);
    } else if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [initialDoctor, doctors]);

  if (!isOpen) return null;

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleNextToPatient = () => {
    if (!selectedDoctorId) {
      setErrors({ doctorId: isBn ? 'ডাক্তার নির্বাচন করুন' : 'Select a doctor' });
      return;
    }
    if (!appointmentDate) {
      setErrors({ appointmentDate: isBn ? 'তারিখ নির্বাচন করুন' : 'Select a date' });
      return;
    }
    // Date must be real, not in the past, and a day this doctor actually sits
    const dateError = validateDoctorDate(currentDoctor, appointmentDate, language, getClinicToday());
    if (dateError) {
      setErrors({ appointmentDate: dateError });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleConfirmBooking = () => {
    // Accept Bangla-keyboard digits for phone and age; store them as English digits
    const phoneEn = toEnglishNumeral(patientPhone).trim();
    const ageEn = toEnglishNumeral(patientAge).trim();

    const formData: Partial<AppointmentFormData> = {
      doctorId: selectedDoctorId,
      patientName,
      patientPhone: phoneEn,
      patientAge: ageEn,
      patientGender,
      patientAddress,
      appointmentDate,
      preferredSlot,
      symptoms,
      isFirstVisit,
    };

    const validation = validateAppointment(formData, language, currentDoctor, getClinicToday());
    if (!validation.valid) {
      setErrors(validation.errors);
      // Doctor/date errors are only shown on step 1, so send the patient back there
      if (validation.errors.doctorId || validation.errors.appointmentDate) {
        setStep(1);
      }
      return;
    }

    setErrors({});

    // Generate random serial index between 1 and 25 for demo token
    const randomSerial = Math.floor(Math.random() * 20) + 1;
    const token = generateSerialToken(
      currentDoctor.departmentId.slice(0, 4),
      appointmentDate,
      randomSerial
    );

    const newAppointment: ConfirmedAppointment = {
      id: `app_${Date.now()}`,
      serialNumber: token,
      doctor: currentDoctor,
      patientName: patientName.trim(),
      patientPhone: phoneEn,
      patientAge: Number(ageEn),
      patientGender,
      patientAddress: patientAddress.trim() || 'Rajshahi',
      appointmentDate,
      preferredSlot,
      symptoms: symptoms.trim(),
      isFirstVisit,
      feeBDT: currentDoctor.feeBDT,
      createdAt: new Date().toISOString(),
    };

    setConfirmedSlip(newAppointment);
    setStep(3);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedSlip(null);
    setPatientName('');
    setPatientPhone('');
    setPatientAge('');
    setSymptoms('');
    setPatientAddress('');
    setPatientGender('male');
    setIsFirstVisit(true);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{t('bookingModalTitle')}</h3>
            <span className="text-xs text-slate-500 font-medium">
              Padma Care Clinic &bull; Laxmipur Medical More, Rajshahi
            </span>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 my-4 text-center text-xs font-bold">
          <div
            className={`py-2 rounded-xl transition-all ${
              step === 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('step1Doctor')}
          </div>
          <div
            className={`py-2 rounded-xl transition-all ${
              step === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('step2Patient')}
          </div>
          <div
            className={`py-2 rounded-xl transition-all ${
              step === 3
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('step3Confirm')}
          </div>
        </div>

        {/* STEP 1: Select Doctor & Schedule */}
        {step === 1 && (
          <div className="space-y-5 py-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t('formDoctorLabel')}
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {isBn ? doc.nameBn : doc.nameEn} — {isBn ? doc.departmentNameBn : doc.departmentNameEn} ({formatCurrencyBDT(doc.feeBDT, language)})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Doctor Summary Card */}
            {currentDoctor && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-4">
                <img
                  src={currentDoctor.avatarUrl}
                  alt={isBn ? currentDoctor.nameBn : currentDoctor.nameEn}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-emerald-300"
                />
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-sm text-slate-900">
                    {isBn ? currentDoctor.nameBn : currentDoctor.nameEn}
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    {isBn ? currentDoctor.degreesBn : currentDoctor.degreesEn}
                  </div>
                  <div className="text-slate-600 flex items-center gap-2 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {isBn ? currentDoctor.scheduleBn : currentDoctor.scheduleEn}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-emerald-800 font-mono">
                      {t('consultationFee')}: {formatCurrencyBDT(currentDoctor.feeBDT, language)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formDateLabel')}
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  min={getClinicToday()}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {errors.appointmentDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.appointmentDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formSlotLabel')}
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.labelEn}>
                      {isBn ? slot.labelBn : slot.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleNextToPatient}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>{isBn ? 'পরবর্তী: রোগীর তথ্য' : 'Next: Patient Details'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Patient Information */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formPatientNameLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={isBn ? 'রোগীর পূর্ণ নাম' : 'e.g. Md. Mostafa Kamal'}
                  className={`w-full p-3 rounded-xl border ${
                    errors.patientName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50'
                  } text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20`}
                />
                {errors.patientName && (
                  <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formPhoneLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="01711234567"
                  className={`w-full p-3 rounded-xl border ${
                    errors.patientPhone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50'
                  } text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 font-mono`}
                />
                {errors.patientPhone && (
                  <p className="text-xs text-red-600 mt-1">{errors.patientPhone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formAgeLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="35"
                  className={`w-full p-3 rounded-xl border ${
                    errors.patientAge ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50'
                  } text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20`}
                />
                {errors.patientAge && (
                  <p className="text-xs text-red-600 mt-1">{errors.patientAge}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('formGenderLabel')}
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  <option value="male">{t('genderMale')}</option>
                  <option value="female">{t('genderFemale')}</option>
                  <option value="other">{t('genderOther')}</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t('formAddressLabel')}
              </label>
              <input
                type="text"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder={t('formAddressPlaceholder')}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Symptoms / Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t('formSymptomsLabel')}
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                placeholder={t('formSymptomsPlaceholder')}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* First visit toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="firstVisitCheck"
                checked={isFirstVisit}
                onChange={(e) => setIsFirstVisit(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <label htmlFor="firstVisitCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                {t('formFirstVisit')}
              </label>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btnBack')}</span>
              </button>

              <button
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('btnConfirmBooking')}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed Digital Serial Token Card */}
        {step === 3 && confirmedSlip && (
          <div className="space-y-5 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">{t('bookingSuccessTitle')}</h4>
              <p className="text-xs text-slate-500">{t('tokenInstructions')}</p>
            </div>

            {/* Official Token Box */}
            <div
              id="printableSerialSlip"
              className="bg-white border-2 border-emerald-600 rounded-2xl p-5 shadow-md space-y-4 text-slate-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
                    {t('clinicName')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Laxmipur Medical More, Rajshahi &bull; 01711-234567
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                    {isBn ? 'ডিজিটাল সিরিয়াল' : 'Confirmed'}
                  </span>
                </div>
              </div>

              {/* Huge Serial Token Number */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  {t('tokenNumberLabel')}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono tracking-tight">
                  {isBn ? toBanglaNumeral(confirmedSlip.serialNumber) : confirmedSlip.serialNumber}
                </span>
              </div>

              {/* Key details list */}
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'রোগীর নাম:' : 'Patient Name:'}</span>
                  <span className="font-bold text-slate-900">{confirmedSlip.patientName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'ফোন নম্বর:' : 'Phone Number:'}</span>
                  <span className="font-bold text-slate-900 font-mono">{confirmedSlip.patientPhone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'ডাক্তার:' : 'Doctor:'}</span>
                  <span className="font-bold text-emerald-800">
                    {isBn ? confirmedSlip.doctor.nameBn : confirmedSlip.doctor.nameEn}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'চেম্বার ও রুম:' : 'Chamber Room:'}</span>
                  <span className="font-semibold text-slate-900">
                    {isBn ? confirmedSlip.doctor.chamberBn : confirmedSlip.doctor.chamberEn}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'তারিখ ও স্লট:' : 'Date & Slot:'}</span>
                  <span className="font-semibold text-slate-900">
                    {confirmedSlip.appointmentDate} ({confirmedSlip.preferredSlot})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{isBn ? 'পরামর্শ ফি:' : 'Consultation Fee:'}</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {formatCurrencyBDT(confirmedSlip.feeBDT, language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Print, Backup to Drive, Reset */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>{t('btnPrintSlip')}</span>
              </button>

              <button
                onClick={() => onSaveToDrive(confirmedSlip)}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <HardDrive className="w-4 h-4" />
                <span>{t('btnSaveToDrive')}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                &larr; {t('btnBookAnother')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
