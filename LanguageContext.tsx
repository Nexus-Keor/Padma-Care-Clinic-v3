import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/clinic';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  // Navigation & Branding
  clinicName: {
    en: 'Padma Care Clinic',
    bn: 'পদ্মা কেয়ার ক্লিনিক',
  },
  clinicSubtitle: {
    en: 'Laxmipur, Rajshahi',
    bn: 'লক্ষ্মীপুর, রাজশাহী',
  },
  navHome: {
    en: 'Home',
    bn: 'হোম',
  },
  navDoctors: {
    en: 'Doctors & Schedule',
    bn: 'ডাক্তার ও শিডিউল',
  },
  navDepartments: {
    en: 'Departments',
    bn: 'বিভাগসমূহ',
  },
  navBooking: {
    en: 'Book Serial',
    bn: 'সিরিয়াল বুকিং',
  },
  navDriveFiles: {
    en: 'Drive Records',
    bn: 'ড্রাইভ রেকর্ড',
  },
  navRajshahiInfo: {
    en: 'Rajshahi Clinic Guide',
    bn: 'রাজশাহী ক্লিনিক নির্দেশিকা',
  },
  emergencyHotline: {
    en: '24/7 Emergency',
    bn: '২৪/৭ জরুরি সেবা',
  },

  // Hero Section
  heroBadge: {
    en: 'Premier Healthcare Center in Rajshahi',
    bn: 'রাজশাহীর শীর্ষস্থানীয় স্বাস্থ্যসেবা কেন্দ্র',
  },
  heroTitle: {
    en: 'Advanced Medical Care & Specialist Doctor Chambers in Rajshahi',
    bn: 'রাজশাহীতে আধুনিক স্বাস্থ্যসেবা ও বিশেষজ্ঞ চিকিৎসকের চেম্বার',
  },
  heroDescription: {
    en: 'Located at Laxmipur Medical More, right opposite Rajshahi Medical College Hospital (Gate 2). Providing trusted multi-specialty consultations, digital serial tokens, modern diagnostics, and secure Google Drive patient slip backup.',
    bn: 'রাজশাহী মেডিকেল কলেজ হাসপাতালের গেট-২ এর ঠিক বিপরীতে লক্ষ্মীপুর মেডিকেল মোড়ে অবস্থিত। অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক, ডিজিটাল সিরিয়াল বুকিং, উন্নত প্যাথলজি ও গুগল ড্রাইভে প্রেসক্রিপশন-টোকেন সংরক্ষণের নির্ভরযোগ্য ঠিকানা।',
  },
  heroBtnBook: {
    en: 'Book Doctor Serial Now',
    bn: 'ডাক্তারের সিরিয়াল বুক করুন',
  },
  heroBtnDoctors: {
    en: 'View Doctor Directory',
    bn: 'ডাক্তারদের তালিকা দেখুন',
  },
  statDoctors: {
    en: 'Specialist Consultants',
    bn: 'অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক',
  },
  statDepartments: {
    en: 'Clinical Departments',
    bn: 'ক্লিনিক্যাল বিভাগসমূহ',
  },
  statEmergency: {
    en: '24/7 Trauma & Lab',
    bn: '২৪/৭ ট্রমা ও ডায়াগনস্টিক',
  },
  statToken: {
    en: 'Instant Digital Token',
    bn: 'তাৎক্ষণিক ডিজিটাল সিরিয়াল',
  },

  // Demo Banner & Modal
  demoBadge: {
    en: 'Prototype & Demo Mode',
    bn: 'ডেমো ও প্রোটোটাইপ সংস্করণ',
  },
  demoNoticeTitle: {
    en: 'Interactive Demonstration Notice',
    bn: 'ইন্টারঅ্যাক্টিভ ডেমো সংক্রান্ত বিজ্ঞপ্তি',
  },
  demoNoticeDesc: {
    en: 'This website is a demonstration portal designed for medical clinics in Rajshahi, Bangladesh. Serial tokens generated here are for demonstration, workflow verification, and testing Google Drive backup. For actual real-life medical emergencies, please immediately visit Rajshahi Medical College Hospital (RMCH) Emergency or call 999.',
    bn: 'এই ওয়েবসাইটটি রাজশাহী শহরের ক্লিনিকসমূহের জন্য তৈরি একটি পরীক্ষামূলক ডেমো পোর্টাল। এখানে তৈরি সিরিয়াল টোকেনগুলো ডেমো প্রেজেন্টেশন ও গুগল ড্রাইভ ব্যাকআপ পরীক্ষার উদ্দেশ্যে কাজ করে। বাস্তব জরুরি প্রয়োজনে অনুগ্রহ করে সরাসরি রাজশাহী মেডিকেল কলেজ হাসপাতাল (রামেক) জরুরি বিভাগে যোগাযোগ করুন অথবা ৯৯৯ এ কল করুন।',
  },
  demoFeatureBadge: {
    en: 'Demo Feature',
    bn: 'ডেমো ফিচার',
  },

  // Doctors Section
  doctorsHeading: {
    en: 'Our Specialist Doctors & Chamber Schedules',
    bn: 'আমাদের বিশেষজ্ঞ ডাক্তারবৃন্দ ও চেম্বার শিডিউল',
  },
  doctorsSubheading: {
    en: 'Renowned professors, consultants, and specialists from Rajshahi Medical College Hospital and top institutions.',
    bn: 'রাজশাহী মেডিকেল কলেজ হাসপাতাল ও স্বনামধন্য স্বাস্থ্য প্রতিষ্ঠানের অভিজ্ঞ অধ্যাপক ও কনসালট্যান্টবৃন্দ।',
  },
  searchPlaceholder: {
    en: 'Search doctor name, specialty, or qualifications...',
    bn: 'ডাক্তারের নাম, বিভাগ বা ডিগ্রি লিখে খুঁজুন...',
  },
  filterAllDepts: {
    en: 'All Departments',
    bn: 'সকল বিভাগ',
  },
  availableTodayOnly: {
    en: 'Available Today',
    bn: 'আজ চেম্বার আছে',
  },
  allDays: {
    en: 'Any Day',
    bn: 'যে কোন দিন',
  },
  visitingHours: {
    en: 'Chamber Time',
    bn: 'চেম্বারের সময়',
  },
  chamberRoom: {
    en: 'Chamber Room',
    bn: 'চেম্বার রুম',
  },
  consultationFee: {
    en: 'Consultation Fee',
    bn: 'পরামর্শ ফি',
  },
  bookSerialWithDoctor: {
    en: 'Book Serial',
    bn: 'সিরিয়াল নিন',
  },
  doctorDetails: {
    en: 'View Profile',
    bn: 'প্রোফাইল দেখুন',
  },
  noDoctorsFound: {
    en: 'No doctors match your filter criteria. Try clearing the search or choosing another department.',
    bn: 'আপনার অনুসন্ধানের সাথে কোনো ডাক্তারের তথ্য মেলেনি। অনুগ্রহ করে ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।',
  },

  // Departments Section
  departmentsHeading: {
    en: 'Comprehensive Clinical & Diagnostic Departments',
    bn: 'ক্লিনিক্যাল ও ডায়াগনস্টিক বিভাগসমূহ',
  },
  departmentsSubheading: {
    en: 'Equipped with modern Japanese and German diagnostic systems and staffed by specialist medical officers.',
    bn: 'জাপানি ও জার্মান আধুনিক প্রযুক্তির ডায়াগনস্টিক যন্ত্রপাতি এবং নিবেদিত মেডিকেল অফিসার দ্বারা পরিচালিত।',
  },
  servicesOffered: {
    en: 'Key Services:',
    bn: 'মূল সেবাসমূহ:',
  },
  equipmentAvailable: {
    en: 'Diagnostics & Equipment:',
    bn: 'ডায়াগনস্টিক ও সরঞ্জাম:',
  },
  departmentHead: {
    en: 'Head of Department:',
    bn: 'বিভাগীয় প্রধান:',
  },
  departmentHours: {
    en: 'Operational Hours:',
    bn: 'সেবার সময়:',
  },
  viewDeptDoctors: {
    en: 'View Specialists in this Department',
    bn: 'এই বিভাগের বিশেষজ্ঞ ডাক্তার দেখুন',
  },

  // Booking Form & Modal
  bookingModalTitle: {
    en: 'Doctor Serial Token Booking',
    bn: 'ডাক্তারের সিরিয়াল টোকেন বুকিং',
  },
  step1Doctor: {
    en: '1. Select Doctor & Date',
    bn: '১. ডাক্তার ও তারিখ',
  },
  step2Patient: {
    en: '2. Patient Information',
    bn: '২. রোগীর তথ্য',
  },
  step3Confirm: {
    en: '3. Serial Token Receipt',
    bn: '৩. সিরিয়াল রসিদ',
  },
  formDoctorLabel: {
    en: 'Select Doctor & Department',
    bn: 'ডাক্তার ও বিভাগ নির্বাচন করুন',
  },
  formDateLabel: {
    en: 'Appointment Date',
    bn: 'সাক্ষাতের তারিখ',
  },
  formSlotLabel: {
    en: 'Preferred Time Slot',
    bn: 'পছন্দসই সময় স্লট',
  },
  formPatientNameLabel: {
    en: 'Patient Full Name',
    bn: 'রোগীর পূর্ণ নাম',
  },
  formPhoneLabel: {
    en: 'Bangladeshi Mobile Number',
    bn: 'মোবাইল নম্বর (১১ ডিজিট)',
  },
  formAgeLabel: {
    en: 'Patient Age (Years)',
    bn: 'রোগীর বয়স (বছর)',
  },
  formGenderLabel: {
    en: 'Gender',
    bn: 'লিঙ্গ',
  },
  genderMale: {
    en: 'Male',
    bn: 'পুরুষ',
  },
  genderFemale: {
    en: 'Female',
    bn: 'মহিলা',
  },
  genderOther: {
    en: 'Other',
    bn: 'অন্যান্য',
  },
  formAddressLabel: {
    en: 'Address / Thana (Rajshahi & Surrounding)',
    bn: 'ঠিকানা / থানা (যেমন: বোয়ালিয়া, মতিহার, পবা)',
  },
  formAddressPlaceholder: {
    en: 'e.g. Boalia, Motihar, Laxmipur, Natore...',
    bn: 'যেমন: বোয়ালিয়া, লক্ষ্মীপুর, মতিহার, বাঘা...',
  },
  formSymptomsLabel: {
    en: 'Brief Health Concern / Symptoms (Optional)',
    bn: 'প্রধান সমস্যা বা লক্ষণসমূহ (ঐচ্ছিক)',
  },
  formSymptomsPlaceholder: {
    en: 'e.g. Chest discomfort, high blood pressure check, fever for 3 days...',
    bn: 'যেমন: বুকে অস্বস্তি, উচ্চ রক্তচাপ পরীক্ষা, ৩ দিনের জ্বর...',
  },
  formFirstVisit: {
    en: 'Is this the patient\'s first visit with this doctor?',
    bn: 'রোগী কি এই ডাক্তারের কাছে প্রথমবার আসছেন?',
  },
  btnConfirmBooking: {
    en: 'Generate Confirmed Serial Token',
    bn: 'কনফার্ম সিরিয়াল টোকেন তৈরি করুন',
  },
  btnBack: {
    en: 'Back',
    bn: 'পেছনে',
  },
  btnCancel: {
    en: 'Cancel',
    bn: 'বাতিল',
  },
  btnSaveToDrive: {
    en: 'Backup Slip to Google Drive',
    bn: 'গুগল ড্রাইভে স্লিপ সংরক্ষণ করুন',
  },
  btnPrintSlip: {
    en: 'Print / Download Slip',
    bn: 'স্লিপ প্রিন্ট / ডাউনলোড',
  },
  btnBookAnother: {
    en: 'Book Another Serial',
    bn: 'নতুন সিরিয়াল নিন',
  },

  // Token Success Card
  bookingSuccessTitle: {
    en: 'Appointment Serial Confirmed!',
    bn: 'সাক্ষাতের সিরিয়াল কনফার্ম হয়েছে!',
  },
  tokenNumberLabel: {
    en: 'Your Serial Token Number:',
    bn: 'আপনার সিরিয়াল টোকেন নম্বর:',
  },
  tokenInstructions: {
    en: 'Please show this digital serial slip at the reception counter upon arrival. Patients are requested to report 20 minutes before chamber timing.',
    bn: 'ক্লিনিকে পৌঁছানোর পর রিসেপশন কাউন্টারে এই ডিজিটাল স্লিপটি প্রদর্শন করুন। চেম্বারের নির্ধারিত সময়ের ২০ মিনিট পূর্বে উপস্থিত হওয়ার জন্য অনুরোধ করা হচ্ছে।',
  },

  // Google Drive Section
  googleDriveHeader: {
    en: 'Google Drive Clinic Record Cloud',
    bn: 'গুগল ড্রাইভ ক্লিনিক রেকর্ড ব্যাকআপ',
  },
  googleDriveDesc: {
    en: 'Securely archive your appointment slips, consultation receipts, and digital prescription files to your own personal Google Drive storage.',
    bn: 'আপনার সাক্ষাতের সিরিয়াল স্লিপ ও প্রেসক্রিপশন সরাসরি আপনার ব্যক্তিগত গুগল ড্রাইভে নিরাপদে ক্লাউড সংরক্ষণ করুন।',
  },
  googleSignInBtn: {
    en: 'Sign in with Google',
    bn: 'গুগল দিয়ে সাইন ইন করুন',
  },
  googleSignOutBtn: {
    en: 'Sign Out of Google',
    bn: 'গুগল সাইন আউট',
  },
  googleDriveConnectedAs: {
    en: 'Connected with Google Drive as',
    bn: 'গুগল ড্রাইভে সংযুক্ত আছেন',
  },
  noDriveFilesYet: {
    en: 'No clinic appointment slips saved to your Google Drive yet. Book a doctor serial above and click "Backup Slip to Google Drive".',
    bn: 'আপনার গুগল ড্রাইভে এখনও কোনো স্লিপ সংরক্ষিত নেই। উপরে ডাক্তারের সিরিয়াল বুক করে "গুগল ড্রাইভে স্লিপ সংরক্ষণ করুন" বাটনে ক্লিক করুন।',
  },
  viewInDrive: {
    en: 'Open in Google Drive',
    bn: 'গুগল ড্রাইভে খুলুন',
  },
  deleteFromDrive: {
    en: 'Delete from Drive',
    bn: 'ড্রাইভ থেকে মুছুন',
  },
  deleteConfirmTitle: {
    en: 'Delete file from Google Drive?',
    bn: 'গুগল ড্রাইভ থেকে ফাইল মুছে ফেলবেন?',
  },
  deleteConfirmDesc: {
    en: 'Are you sure you want to permanently delete this clinic receipt file from your Google Drive? This action cannot be undone.',
    bn: 'আপনি কি নিশ্চিত যে আপনার গুগল ড্রাইভ থেকে এই ক্লিনিক রসিদ ফাইলটি স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।',
  },
  confirmDeleteBtn: {
    en: 'Yes, Delete File',
    bn: 'হ্যাঁ, ফাইলটি মুছুন',
  },
  uploadingToDrive: {
    en: 'Uploading slip to your Google Drive...',
    bn: 'গুগল ড্রাইভে স্লিপ আপলোড হচ্ছে...',
  },
  savedToDriveSuccess: {
    en: 'Successfully saved to your Google Drive!',
    bn: 'আপনার গুগল ড্রাইভে সফলভাবে সংরক্ষিত হয়েছে!',
  },

  // Rajshahi Location Guide
  rajshahiGuideTitle: {
    en: 'Rajshahi Clinic Location & Contact Information',
    bn: 'রাজশাহী ক্লিনিক লোকেশন ও যোগাযোগ তথ্য',
  },
  rajshahiGuideSubtitle: {
    en: 'Conveniently located in the healthcare district of Laxmipur, Rajshahi.',
    bn: 'রাজশাহীর স্বাস্থ্যসেবার কেন্দ্রবিন্দু লক্ষ্মীপুরে সহজ যোগাযোগ ব্যবস্থা।',
  },
  landmarkRMCH: {
    en: 'Directly Opposite RMCH Gate 2',
    bn: 'রামেক হাসপাতাল গেট-২ এর সরাসরি বিপরীতে',
  },
  landmarkLaxmipur: {
    en: 'Laxmipur Medical More Intersection',
    bn: 'লক্ষ্মীপুর মেডিকেল মোড় ইন্টারসেকশন',
  },
  landmarkCNB: {
    en: '5 Minutes from C&B More & Court Road',
    bn: 'সিঅ্যান্ডবি মোড় ও কোর্ট রোড হতে ৫ মিনিট',
  },
  emergencyHotlineLabel: {
    en: 'Emergency Hotline (24/7):',
    bn: 'জরুরি হটলাইন (২৪/৭):',
  },
  ambulanceLabel: {
    en: 'Cardiac Ambulance Service:',
    bn: 'কার্ডিয়াক অ্যাম্বুলেন্স সার্ভিস:',
  },
  receptionLabel: {
    en: 'Chamber Reception Desk:',
    bn: 'চেম্বার রিসেপশন ডেস্ক:',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return localStorage.getItem('padma_clinic_lang') === 'bn' ? 'bn' : 'en';
    } catch {
      // Storage blocked (private mode, strict privacy settings) - fall back to English
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('padma_clinic_lang', lang);
    } catch {
      // Ignore: the language still switches for this session
    }
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
