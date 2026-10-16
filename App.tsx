import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DOCTORS, DEPARTMENTS } from './data/clinicData';
import { Doctor, ConfirmedAppointment } from './types/clinic';
import { initAuth, googleSignIn, logout, setCachedToken } from './services/firebaseAuth';
import { User } from 'firebase/auth';

import { DemoDisclaimerBanner } from './components/DemoDisclaimerBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DoctorDirectory } from './components/DoctorDirectory';
import { DepartmentSection } from './components/DepartmentSection';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { GoogleDriveSection } from './components/GoogleDriveSection';
import { RajshahiClinicInfo } from './components/RajshahiClinicInfo';
import { Footer } from './components/Footer';

function ClinicApp() {
  const { language } = useLanguage();

  // Authentication State (Firebase + Google Drive OAuth scope)
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  // Bumped every time the modal opens so each booking starts from a fresh form
  const [bookingSession, setBookingSession] = useState(0);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');

  // Pending Appointment to Save to Google Drive
  const [pendingSaveAppointment, setPendingSaveAppointment] = useState<ConfirmedAppointment | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        if (token) setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Google Sign-in Handler
  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    }
  };

  // Google Sign-out Handler
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  // Open booking modal
  const handleOpenBooking = (doctor?: Doctor) => {
    setBookingDoctor(doctor || null);
    setBookingSession((n) => n + 1);
    setIsBookingOpen(true);
  };

  // Triggered when user clicks "Backup Slip to Google Drive" from the confirmation receipt
  const handleSaveToDrive = (appointment: ConfirmedAppointment) => {
    setPendingSaveAppointment(appointment);
    // Close the booking modal so the Drive confirmation dialog isn't hidden behind it
    setIsBookingOpen(false);
    // Scroll to Google Drive section
    const el = document.getElementById('drive');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
      {/* Top Demo Disclaimer Banner */}
      <DemoDisclaimerBanner />

      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onGoogleSignIn={handleSignIn}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onBrowseDoctors={() => {
            const el = document.getElementById('doctors');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Doctor Directory & Schedules */}
        <DoctorDirectory
          doctors={DOCTORS}
          selectedDepartmentId={selectedDepartmentId}
          onSelectDepartment={(deptId) => setSelectedDepartmentId(deptId)}
          onBookSerial={(doc) => handleOpenBooking(doc)}
        />

        {/* Clinical Departments */}
        <DepartmentSection
          departments={DEPARTMENTS}
          onSelectDepartment={(deptId) => {
            setSelectedDepartmentId(deptId);
          }}
        />

        {/* Google Drive Records Backup (Google Workspace Integration) */}
        <GoogleDriveSection
          user={user}
          accessToken={accessToken}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          pendingSaveAppointment={pendingSaveAppointment}
          onClearPendingAppointment={() => setPendingSaveAppointment(null)}
          onSessionExpired={() => {
            setCachedToken(null);
            setAccessToken(null);
          }}
        />

        {/* Rajshahi Clinic Location & Emergency Transit Guide */}
        <RajshahiClinicInfo />
      </main>

      {/* Global Booking Modal */}
      <AppointmentBookingModal
        key={bookingSession}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDoctor={bookingDoctor}
        doctors={DOCTORS}
        user={user}
        onSaveToDrive={handleSaveToDrive}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ClinicApp />
    </LanguageProvider>
  );
}
