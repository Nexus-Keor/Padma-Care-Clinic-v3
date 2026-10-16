import type { Doctor, AppointmentFormData, Language } from '../types/clinic.ts';

const BANGLA_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English numerals in a string or number to Bengali numerals
 */
export function toBanglaNumeral(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => BANGLA_NUMERALS[digit] || digit);
}

/**
 * Converts Bengali numerals (০-৯) in a string back to English digits (0-9).
 * Lets patients type phone numbers and ages with a Bangla keyboard.
 */
export function toEnglishNumeral(input: string | number): string {
  return String(input).replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
}

/**
 * Formats currency amount in Bangladeshi Taka (৳)
 */
export function formatCurrencyBDT(amount: number, lang: Language = 'en'): string {
  if (lang === 'bn') {
    return `৳${toBanglaNumeral(amount)}`;
  }
  return `৳${amount}`;
}

/**
 * Validates Bangladeshi mobile phone numbers:
 * Must be 11 digits starting with 013, 014, 015, 016, 017, 018, or 019
 * or optionally prefixed with +8801...
 */
export function isBangladeshiPhoneValid(phone: string): boolean {
  if (!phone) return false;
  const cleaned = toEnglishNumeral(phone).replace(/[\s-]/g, '');
  // Matches 01[3-9]\d{8} or +8801[3-9]\d{8} or 8801[3-9]\d{8}
  const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(cleaned);
}

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_BN: Record<string, string> = {
  Sunday: 'রবিবার',
  Monday: 'সোমবার',
  Tuesday: 'মঙ্গলবার',
  Wednesday: 'বুধবার',
  Thursday: 'বৃহস্পতিবার',
  Friday: 'শুক্রবার',
  Saturday: 'শনিবার',
};

/**
 * Normalizes a stored day name ("Saturday", "sat", "শনিবার") to the English full name,
 * so a schedule written in Bangla can never be wrongly reported as "doctor unavailable".
 */
export function normalizeDayName(day: string): string {
  const trimmed = (day || '').trim();
  const fromBangla = Object.keys(WEEKDAYS_BN).find((en) => WEEKDAYS_BN[en] === trimmed);
  if (fromBangla) return fromBangla;
  if (trimmed.length === 3) {
    const fromShort = WEEKDAYS_EN.find((en) => en.slice(0, 3).toLowerCase() === trimmed.toLowerCase());
    if (fromShort) return fromShort;
  }
  return trimmed;
}

/** The clinic is in Rajshahi, so "today" is always counted in Bangladesh time. */
export const CLINIC_TIME_ZONE = 'Asia/Dhaka';

/**
 * Returns today's date (YYYY-MM-DD) in Bangladesh time, regardless of the
 * visitor's device time zone (and without the UTC shift of toISOString()).
 */
export function getClinicToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CLINIC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Adds (or subtracts) whole days to a YYYY-MM-DD string. Returns '' for invalid input. */
export function addDaysToDateString(dateStr: string, days: number): string {
  if (!getWeekdayName(dateStr)) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

/** Returns the English weekday name for a YYYY-MM-DD string, or null if the date is invalid. */
export function getWeekdayName(dateStr: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null;
  }
  return WEEKDAYS_EN[date.getUTCDay()];
}

/** True when the doctor sits in chamber on the weekday of the given YYYY-MM-DD date. */
export function isDoctorAvailableOnDate(doctor: Doctor, dateStr: string): boolean {
  const weekday = getWeekdayName(dateStr);
  if (!weekday) return false;
  return doctor.visitingDays.some(
    (day) => normalizeDayName(day).toLowerCase() === weekday.toLowerCase()
  );
}

/** True when the doctor sits in chamber today (Bangladesh time). Replaces the static availableToday flag. */
export function isDoctorAvailableToday(doctor: Doctor, now: Date = new Date()): boolean {
  return isDoctorAvailableOnDate(doctor, getClinicToday(now));
}

/** First date on or after fromDate (YYYY-MM-DD) on which the doctor sits; falls back to fromDate. */
export function getNextVisitingDate(doctor: Doctor | undefined, fromDate: string): string {
  if (!doctor) return fromDate;
  for (let i = 0; i < 7; i++) {
    const candidate = addDaysToDateString(fromDate, i);
    if (candidate && isDoctorAvailableOnDate(doctor, candidate)) return candidate;
  }
  return fromDate;
}

/**
 * Checks that the chosen date is a real date, not in the past (when `today` is given),
 * and falls on one of the doctor's visiting days. Returns a localized error, or null if OK.
 */
export function validateDoctorDate(
  doctor: Doctor | undefined,
  dateStr: string,
  lang: Language = 'en',
  today?: string
): string | null {
  const isBn = lang === 'bn';
  const weekday = getWeekdayName(dateStr);
  if (!weekday) {
    return isBn ? 'সঠিক তারিখ নির্বাচন করুন' : 'Please select a valid date';
  }
  if (today && dateStr < today) {
    return isBn ? 'অতীতের তারিখে সিরিয়াল নেওয়া যাবে না' : 'Appointment date cannot be in the past';
  }
  if (doctor && !isDoctorAvailableOnDate(doctor, dateStr)) {
    const days = doctor.visitingDays;
    return isBn
      ? `${doctor.nameBn} ${WEEKDAYS_BN[weekday]} চেম্বারে বসেন না। বসার দিন: ${days
          .map((d) => WEEKDAYS_BN[d] || d)
          .join(', ')}`
      : `${doctor.nameEn} does not sit on ${weekday}s. Visiting days: ${days.join(', ')}`;
  }
  return null;
}

/**
 * Validates the appointment booking form with localized error messages
 */
export function validateAppointment(
  data: Partial<AppointmentFormData>,
  lang: Language = 'en',
  doctor?: Doctor,
  today?: string
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.doctorId || data.doctorId.trim() === '') {
    errors.doctorId = lang === 'bn' ? 'অনুগ্রহ করে একজন ডাক্তার নির্বাচন করুন' : 'Please select a doctor';
  }

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName =
      lang === 'bn'
        ? 'রোগীর পূর্ণ নাম প্রদান করুন (কমপক্ষে ২ অক্ষর)'
        : 'Please enter patient full name (at least 2 letters)';
  }

  if (!data.patientPhone || !isBangladeshiPhoneValid(data.patientPhone)) {
    errors.patientPhone =
      lang === 'bn'
        ? 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)'
        : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017xxxxxxxx)';
  }

  const ageText = toEnglishNumeral(data.patientAge ?? '').trim();
  const ageNum = Number(ageText);
  if (!/^\d{1,3}$/.test(ageText) || ageNum <= 0 || ageNum > 125) {
    errors.patientAge =
      lang === 'bn' ? 'রোগীর সঠিক বয়স দিন (১ থেকে ১২৫ বছর)' : 'Please enter a valid age (1 to 125 years)';
  }

  if (!data.patientGender) {
    errors.patientGender = lang === 'bn' ? 'রোগীর লিঙ্গ নির্বাচন করুন' : 'Please select gender';
  }

  if (!data.appointmentDate) {
    errors.appointmentDate = lang === 'bn' ? 'সাক্ষাতের তারিখ নির্বাচন করুন' : 'Please select appointment date';
  } else {
    const dateError = validateDoctorDate(doctor, data.appointmentDate, lang, today);
    if (dateError) errors.appointmentDate = dateError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates an authentic serial token number for Bangladeshi clinic chambers
 * Format: PCC-{DOCTOR_CODE}-{YYYYMMDD}-{SERIAL}
 * e.g., PCC-CARD-261016-007
 */
export function generateSerialToken(
  doctorDeptCode: string,
  dateStr: string,
  serialIndex: number
): string {
  const code = (doctorDeptCode || 'GEN').toUpperCase().slice(0, 4);
  const cleanDate = dateStr ? dateStr.replace(/[^0-9]/g, '').slice(2, 8) : 'TODAY';
  const paddedSerial = String(serialIndex).padStart(3, '0');
  return `PCC-${code}-${cleanDate}-${paddedSerial}`;
}

/**
 * Filters doctor records based on department, query string, and day of week
 */
export function filterDoctors(
  doctors: Doctor[],
  departmentId: string,
  searchQuery: string,
  selectedDay?: string
): Doctor[] {
  return doctors.filter((doc) => {
    // Department filter
    if (departmentId && departmentId !== 'all' && doc.departmentId !== departmentId) {
      return false;
    }

    // Day of week filter
    if (selectedDay && selectedDay !== 'all') {
      const matchDay = doc.visitingDays.some(
        (day) => normalizeDayName(day).toLowerCase() === normalizeDayName(selectedDay).toLowerCase()
      );
      if (!matchDay) return false;
    }

    // Search query filter (matches nameEn, nameBn, degreesEn, degreesBn, chamber)
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase();
      const matchesEn = doc.nameEn.toLowerCase().includes(query) ||
        doc.departmentNameEn.toLowerCase().includes(query) ||
        doc.degreesEn.toLowerCase().includes(query) ||
        doc.designationEn.toLowerCase().includes(query);
      const matchesBn = doc.nameBn.includes(searchQuery.trim()) ||
        doc.departmentNameBn.includes(searchQuery.trim()) ||
        doc.degreesBn.includes(searchQuery.trim()) ||
        doc.designationBn.includes(searchQuery.trim());
      return matchesEn || matchesBn;
    }

    return true;
  });
}
