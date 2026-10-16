import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toBanglaNumeral,
  formatCurrencyBDT,
  isBangladeshiPhoneValid,
  validateAppointment,
  generateSerialToken,
  filterDoctors,
  toEnglishNumeral,
  getClinicToday,
  getWeekdayName,
  addDaysToDateString,
  isDoctorAvailableOnDate,
  isDoctorAvailableToday,
  getNextVisitingDate,
  validateDoctorDate,
  normalizeDayName,
} from './clinicLogic.ts';
import type { Doctor } from '../types/clinic.ts';

test('toBanglaNumeral converts English digits to Bengali digits', () => {
  assert.equal(toBanglaNumeral(1234567890), '১২৩৪৫৬৭৮৯০');
  assert.equal(toBanglaNumeral('Room 302'), 'Room ৩০২');
  assert.equal(toBanglaNumeral('PCC-007'), 'PCC-০০৭');
});

test('formatCurrencyBDT formats Bangladeshi Taka properly', () => {
  assert.equal(formatCurrencyBDT(800, 'en'), '৳800');
  assert.equal(formatCurrencyBDT(800, 'bn'), '৳৮০০');
});

test('isBangladeshiPhoneValid validates standard BD operators correctly', () => {
  assert.equal(isBangladeshiPhoneValid('01711223344'), true); // Grameenphone
  assert.equal(isBangladeshiPhoneValid('+8801812345678'), true); // Robi
  assert.equal(isBangladeshiPhoneValid('01912345678'), true); // Banglalink
  assert.equal(isBangladeshiPhoneValid('01512345678'), true); // Teletalk
  assert.equal(isBangladeshiPhoneValid('01212345678'), false); // Invalid operator prefix
  assert.equal(isBangladeshiPhoneValid('017123'), false); // Too short
  assert.equal(isBangladeshiPhoneValid('abc'), false);
});

test('validateAppointment catches missing required fields and validates age', () => {
  const invalidResult = validateAppointment({}, 'en');
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.doctorId);
  assert.ok(invalidResult.errors.patientName);
  assert.ok(invalidResult.errors.patientPhone);
  assert.ok(invalidResult.errors.patientAge);
  assert.ok(invalidResult.errors.appointmentDate);

  const validResult = validateAppointment(
    {
      doctorId: 'doc-1',
      patientName: 'Md. Tareq Hasan',
      patientPhone: '01711234567',
      patientAge: '32',
      patientGender: 'male',
      appointmentDate: '2026-10-20',
      preferredSlot: 'Evening (5:00 PM)',
    },
    'en'
  );
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});

test('generateSerialToken creates standardized chamber tokens', () => {
  const token = generateSerialToken('CARD', '2026-10-20', 7);
  assert.equal(token, 'PCC-CARD-261020-007');
});

test('filterDoctors filters by department, query, and day of week', () => {
  const mockDoctors: Doctor[] = [
    {
      id: 'doc-1',
      nameEn: 'Prof. Dr. M. A. Jalil',
      nameBn: 'অধ্যাপক ডাঃ এম এ জলিল',
      titleEn: 'Senior Cardiologist',
      titleBn: 'সিনিয়র হৃদরোগ বিশেষজ্ঞ',
      degreesEn: 'MBBS, FCPS (Cardiology), MD',
      degreesBn: 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি), এমডি',
      designationEn: 'Ex-Head, Dept of Cardiology, RMCH',
      designationBn: 'সাবেক বিভাগীয় প্রধান, হৃদরোগ বিভাগ, রামেক হাসপাতাল',
      departmentId: 'cardiology',
      departmentNameEn: 'Cardiology',
      departmentNameBn: 'হৃদরোগ বিভাগ',
      chamberEn: 'Chamber 201, 2nd Floor',
      chamberBn: 'চেম্বার ২০১, ২য় তলা',
      scheduleEn: 'Sat - Thu (5:00 PM - 9:00 PM)',
      scheduleBn: 'শনিবার - বৃহস্পতিবার (বিকাল ৫:০০ - রাত ৯:০০)',
      visitingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      timeSlotEn: '5:00 PM - 9:00 PM',
      timeSlotBn: 'বিকাল ৫:০০ - রাত ৯:০০',
      feeBDT: 1000,
      experienceYears: 24,
      avatarUrl: '',
      phone: '01711234567',
      availableToday: true,
      bioEn: '',
      bioBn: '',
    },
    {
      id: 'doc-2',
      nameEn: 'Dr. Nusrat Jahan',
      nameBn: 'ডাঃ নুসরত জাহান',
      titleEn: 'Gynecologist & Obstetrician',
      titleBn: 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
      degreesEn: 'MBBS, DGO, FCPS',
      degreesBn: 'এমবিবিএস, ডিজিও, এফসিপিএস',
      designationEn: 'Associate Professor, RMCH',
      designationBn: 'সহযোগী অধ্যাপক, রামেক হাসপাতাল',
      departmentId: 'gynecology',
      departmentNameEn: 'Gynecology & Obstetrics',
      departmentNameBn: 'স্ত্রীরোগ ও প্রসূতি বিভাগ',
      chamberEn: 'Chamber 104, 1st Floor',
      chamberBn: 'চেম্বার ১০৪, ১ম তলা',
      scheduleEn: 'Sat, Mon, Wed (4:00 PM - 8:00 PM)',
      scheduleBn: 'শনি, সোম, বুধ (বিকাল ৪:০০ - রাত ৮:০০)',
      visitingDays: ['Saturday', 'Monday', 'Wednesday'],
      timeSlotEn: '4:00 PM - 8:00 PM',
      timeSlotBn: 'বিকাল ৪:০০ - রাত ৮:০০',
      feeBDT: 800,
      experienceYears: 15,
      avatarUrl: '',
      phone: '01722334455',
      availableToday: false,
      bioEn: '',
      bioBn: '',
    },
  ];

  // Test department filter
  const cardiologyOnly = filterDoctors(mockDoctors, 'cardiology', '');
  assert.equal(cardiologyOnly.length, 1);
  assert.equal(cardiologyOnly[0].id, 'doc-1');

  // Test text search in English
  const searchJahan = filterDoctors(mockDoctors, 'all', 'Jahan');
  assert.equal(searchJahan.length, 1);
  assert.equal(searchJahan[0].id, 'doc-2');

  // Test text search in Bangla
  const searchBangla = filterDoctors(mockDoctors, 'all', 'জলিল');
  assert.equal(searchBangla.length, 1);
  assert.equal(searchBangla[0].id, 'doc-1');

  // Test day filter
  const sundayDoctors = filterDoctors(mockDoctors, 'all', '', 'Sunday');
  assert.equal(sundayDoctors.length, 1);
  assert.equal(sundayDoctors[0].id, 'doc-1');
});

// ---- Regression tests for booking date / digit handling ----

const sampleDoctor = {
  id: 'doc-x',
  nameEn: 'Dr. Test',
  nameBn: 'ডাঃ টেস্ট',
  visitingDays: ['Saturday', 'Monday', 'Wednesday'],
} as unknown as Doctor;

test('getClinicToday returns Bangladesh date, not the UTC date', () => {
  // 2026-10-16 20:00 UTC is already 2026-10-17 02:00 in Dhaka (UTC+6)
  assert.equal(getClinicToday(new Date('2026-10-16T20:00:00Z')), '2026-10-17');
  // 2026-10-17 03:00 Dhaka (= 2026-10-16 21:00 UTC) must be the 17th
  assert.equal(getClinicToday(new Date('2026-10-16T21:00:00Z')), '2026-10-17');
  assert.equal(getClinicToday(new Date('2026-10-16T05:00:00Z')), '2026-10-16');
});

test('getWeekdayName and addDaysToDateString handle real and invalid dates', () => {
  assert.equal(getWeekdayName('2026-10-16'), 'Friday');
  assert.equal(getWeekdayName('2026-10-17'), 'Saturday');
  assert.equal(getWeekdayName('2026-02-30'), null);
  assert.equal(getWeekdayName('not-a-date'), null);
  assert.equal(addDaysToDateString('2026-12-31', 1), '2027-01-01');
  assert.equal(addDaysToDateString('bad', 1), '');
});

test('isDoctorAvailableOnDate / Today use the real weekday', () => {
  assert.equal(isDoctorAvailableOnDate(sampleDoctor, '2026-10-17'), true); // Saturday
  assert.equal(isDoctorAvailableOnDate(sampleDoctor, '2026-10-18'), false); // Sunday
  assert.equal(isDoctorAvailableToday(sampleDoctor, new Date('2026-10-16T05:00:00Z')), false); // Friday
  assert.equal(isDoctorAvailableToday(sampleDoctor, new Date('2026-10-17T05:00:00Z')), true); // Saturday
});

test('getNextVisitingDate skips days the doctor does not sit', () => {
  assert.equal(getNextVisitingDate(sampleDoctor, '2026-10-18'), '2026-10-19'); // Sun -> Mon
  assert.equal(getNextVisitingDate(sampleDoctor, '2026-10-17'), '2026-10-17'); // already Sat
  assert.equal(getNextVisitingDate(undefined, '2026-10-18'), '2026-10-18');
});

test('validateDoctorDate rejects past dates and non-visiting days (en + bn)', () => {
  assert.equal(validateDoctorDate(sampleDoctor, '2026-10-19', 'en', '2026-10-16'), null); // Monday
  assert.match(validateDoctorDate(sampleDoctor, '2026-10-15', 'en', '2026-10-16') as string, /past/);
  assert.match(validateDoctorDate(sampleDoctor, '2026-10-18', 'en', '2026-10-16') as string, /does not sit on Sundays/);
  assert.match(validateDoctorDate(sampleDoctor, '2026-10-18', 'bn', '2026-10-16') as string, /রবিবার/);
  assert.ok(validateDoctorDate(sampleDoctor, '2026-13-01', 'en'));
  // Without `today`, past dates are not checked (keeps old behaviour for callers that omit it)
  assert.equal(validateDoctorDate(sampleDoctor, '2020-01-06', 'en'), null); // a Monday
});

test('validateAppointment enforces doctor visiting day and past dates when given', () => {
  const base = {
    doctorId: 'doc-x',
    patientName: 'Md. Tareq Hasan',
    patientPhone: '01711234567',
    patientAge: '32',
    patientGender: 'male' as const,
  };
  const sunday = validateAppointment({ ...base, appointmentDate: '2026-10-18' }, 'en', sampleDoctor, '2026-10-16');
  assert.equal(sunday.valid, false);
  assert.ok(sunday.errors.appointmentDate);
  const monday = validateAppointment({ ...base, appointmentDate: '2026-10-19' }, 'en', sampleDoctor, '2026-10-16');
  assert.equal(monday.valid, true);
  const past = validateAppointment({ ...base, appointmentDate: '2026-10-12' }, 'en', sampleDoctor, '2026-10-16');
  assert.equal(past.valid, false);
});

test('Bangla digits are accepted for phone and age', () => {
  assert.equal(toEnglishNumeral('০১৭১১২৩৪৫৬৭'), '01711234567');
  assert.equal(isBangladeshiPhoneValid('০১৭১১-২২৩৩৪৪'), true);
  const res = validateAppointment({
    doctorId: 'doc-x',
    patientName: 'রহিম',
    patientPhone: '০১৭১১২২৩৩৪৪',
    patientAge: '৩২',
    patientGender: 'male',
    appointmentDate: '2026-10-19',
  });
  assert.equal(res.valid, true);
});

test('validateAppointment rejects fractional and out-of-range ages', () => {
  const mk = (age: string) =>
    validateAppointment({
      doctorId: 'd', patientName: 'Ab', patientPhone: '01711234567',
      patientAge: age, patientGender: 'male', appointmentDate: '2026-10-19',
    }).errors.patientAge;
  assert.ok(mk('32.5'));
  assert.ok(mk('0'));
  assert.ok(mk('126'));
  assert.ok(mk('1e2'));
  assert.equal(mk('125'), undefined);
});

test('day names written in Bangla or short English still match the real weekday', () => {
  assert.equal(normalizeDayName('শনিবার'), 'Saturday');
  assert.equal(normalizeDayName('Sat'), 'Saturday');
  assert.equal(normalizeDayName(' monday '), 'monday');
  const bnDoctor = { id: 'd', nameEn: 'Dr', nameBn: 'ডাঃ', visitingDays: ['শনিবার', 'Mon'] } as unknown as Doctor;
  assert.equal(isDoctorAvailableOnDate(bnDoctor, '2026-10-17'), true); // Saturday
  assert.equal(isDoctorAvailableOnDate(bnDoctor, '2026-10-19'), true); // Monday
  assert.equal(isDoctorAvailableOnDate(bnDoctor, '2026-10-18'), false); // Sunday
  assert.equal(filterDoctors([bnDoctor] as Doctor[], 'all', '', 'Saturday').length, 0 + 1);
});
