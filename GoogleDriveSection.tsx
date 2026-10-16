import React, { useState, useEffect } from 'react';
import { ConfirmedAppointment, DriveFileItem } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import {
  listClinicFilesFromDrive,
  uploadAppointmentSlipToDrive,
  deleteFileFromDrive,
  DriveAuthError,
} from '../services/googleDriveService';
import {
  HardDrive,
  FileText,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDriveSectionProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  pendingSaveAppointment: ConfirmedAppointment | null;
  onClearPendingAppointment: () => void;
  /** Called when Google rejects the token, so the parent can drop it and ask for sign-in again */
  onSessionExpired?: () => void;
}

export const GoogleDriveSection: React.FC<GoogleDriveSectionProps> = ({
  user,
  accessToken,
  onSignIn,
  onSignOut,
  pendingSaveAppointment,
  onClearPendingAppointment,
  onSessionExpired,
}) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mandatory Workspace confirmation modals
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Google token expired (401) or Drive permission missing (403): show a clear message and
  // drop the stale token so the next Refresh / Confirm asks the patient to sign in again.
  const handleDriveAuthError = (err: unknown): boolean => {
    if (!(err instanceof DriveAuthError)) return false;
    setErrorMessage(
      err.status === 401
        ? isBn
          ? 'আপনার গুগল সেশনের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার সাইন ইন করুন।'
          : 'Your Google session has expired. Please sign in again.'
        : isBn
        ? 'গুগল ড্রাইভের অনুমতি দেওয়া হয়নি। আবার সাইন ইন করে ড্রাইভ অ্যাক্সেস অনুমোদন করুন।'
        : 'Google Drive access was not granted. Please sign in again and allow access to Drive.'
    );
    if (onSessionExpired) onSessionExpired();
    return true;
  };

  // Trigger confirmation modal when pendingSaveAppointment arrives, and bring it
  // back after the patient finishes Google sign-in (accessToken arrives)
  useEffect(() => {
    if (pendingSaveAppointment) {
      setShowSaveConfirmModal(true);
    }
  }, [pendingSaveAppointment, accessToken]);

  // Load files from Google Drive when authenticated
  const fetchFiles = async () => {
    if (!accessToken) {
      // Signed in via a restored session (e.g. after page reload) but no Drive token yet:
      // ask Google for permission again instead of silently doing nothing.
      if (user) onSignIn();
      return;
    }
    setLoadingFiles(true);
    setErrorMessage(null);
    try {
      const driveFiles = await listClinicFilesFromDrive(accessToken);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      if (!handleDriveAuthError(err)) {
        setErrorMessage(
          isBn
            ? 'গুগল ড্রাইভ ফাইল লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় সাইন ইন করুন।'
            : 'Could not fetch Google Drive files. Please sign in again.'
        );
      }
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [accessToken]);

  // Handle Confirmed Save to Drive (with explicit user consent)
  const handleConfirmSave = async () => {
    if (!pendingSaveAppointment) return;

    if (!accessToken) {
      setShowSaveConfirmModal(false);
      onSignIn();
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    try {
      const result = await uploadAppointmentSlipToDrive(
        accessToken,
        pendingSaveAppointment,
        language
      );
      setSuccessMessage(
        isBn
          ? `স্লিপ "${result.name}" আপনার গুগল ড্রাইভে সংরক্ষিত হয়েছে!`
          : `Receipt "${result.name}" successfully archived to your Google Drive!`
      );
      setShowSaveConfirmModal(false);
      onClearPendingAppointment();
      await fetchFiles();
    } catch (err: any) {
      console.error('Error uploading to Drive:', err);
      if (!handleDriveAuthError(err)) {
        setErrorMessage(
          isBn
            ? 'গুগল ড্রাইভে আপলোড ব্যর্থ হয়েছে। অনুমতি যাচাই করুন।'
            : 'Upload to Google Drive failed. Check permissions.'
        );
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle Confirmed Deletion (Mandatory Workspace Dialog)
  const handleConfirmDelete = async () => {
    if (!fileToDelete || !accessToken) return;
    setIsDeleting(true);
    try {
      await deleteFileFromDrive(accessToken, fileToDelete.id);
      setSuccessMessage(
        isBn ? 'ফাইলটি গুগল ড্রাইভ থেকে সফলভাবে মুছে ফেলা হয়েছে।' : 'File removed from Google Drive.'
      );
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      console.error('Delete failed:', err);
      if (handleDriveAuthError(err)) {
        setFileToDelete(null);
      } else {
        setErrorMessage(
          isBn ? 'ফাইলটি মুছতে ব্যর্থ হয়েছে।' : 'Failed to delete file from Google Drive.'
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="drive" className="py-16 sm:py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Workspace Integration &bull; Drive Cloud</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t('googleDriveHeader')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('googleDriveDesc')}
          </p>
        </div>

        {/* Status Alerts */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Drive Dashboard Card */}
        <div className="max-w-3xl mx-auto bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* User Sign-In State Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-700">
            {user ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-11 h-11 rounded-full border-2 border-emerald-500 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shrink-0">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-sm text-white">
                  {isBn ? 'গুগল ড্রাইভ সংযুক্ত নয়' : 'Google Drive Disconnected'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isBn
                    ? 'প্রেসক্রিপশন ও সিরিয়াল স্লিপ স্বয়ংক্রিয়ভাবে সংরক্ষণের জন্য সাইন ইন করুন'
                    : 'Sign in to auto-archive your medical slips and diagnostic reports'}
                </p>
              </div>
            )}

            {/* Auth Action Buttons */}
            <div>
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchFiles}
                    disabled={loadingFiles}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  >
                    {loadingFiles ? <Loader2 className="w-4 h-4 animate-spin" /> : (isBn ? 'রিফ্রেশ' : 'Refresh')}
                  </button>
                  <button
                    onClick={onSignOut}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    {t('googleSignOutBtn')}
                  </button>
                </div>
              ) : (
                /* Official Google Sign-in button format matching workspace guidelines */
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-800 transition-all shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{t('googleSignInBtn')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Files List Section */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>
                  {isBn ? 'সংরক্ষিত ক্লিনিক ফাইল ও স্লিপ' : 'Saved Clinic Records on Google Drive'}
                </span>
              </h4>
              {files.length > 0 && (
                <span className="text-xs text-slate-400 font-mono">
                  {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
              )}
            </div>

            {!user ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
                <HardDrive className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  {t('noDriveFilesYet')}
                </p>
              </div>
            ) : loadingFiles ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
                <p className="text-xs">{isBn ? 'ড্রাইভ ফাইল খোঁজা হচ্ছে...' : 'Querying Google Drive files...'}</p>
              </div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
                <HardDrive className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs sm:text-sm text-slate-400">{t('noDriveFilesYet')}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-700/80 rounded-xl hover:border-slate-600 transition-colors text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {file.createdTime
                            ? new Date(file.createdTime).toLocaleDateString()
                            : 'Clinic Slip'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/30 font-semibold text-xs transition-colors"
                        >
                          <span>{t('viewInDrive')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title={t('deleteFromDrive')}
                        aria-label={`Delete ${file.name} from Google Drive`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANDATORY WORKSPACE DIALOG: Save Confirmation */}
      {showSaveConfirmModal && pendingSaveAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {isBn ? 'গুগল ড্রাইভে ফাইল সংরক্ষণ করবেন?' : 'Save Appointment Slip to Google Drive?'}
                </h3>
                <span className="text-xs text-slate-500">
                  {isBn ? 'ব্যবহারকারীর অনুমতি প্রয়োজন' : 'Requires explicit user confirmation'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isBn
                ? `সিরিয়াল টোকেন #${pendingSaveAppointment.serialNumber} এর জন্য একটি অফিশিয়াল রসিদ ডকুমেন্ট Padma_Care_Slip_${pendingSaveAppointment.serialNumber}.html নামে আপনার নিজস্ব গুগল ড্রাইভ স্টোরেজে তৈরি করা হবে।`
                : `A formatted clinical appointment receipt named "Padma_Care_Slip_${pendingSaveAppointment.serialNumber}.html" will be uploaded to your Google Drive for patient ${pendingSaveAppointment.patientName}.`}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700 font-mono">
              <div><strong>File:</strong> Padma_Care_Slip_{pendingSaveAppointment.serialNumber}.html</div>
              <div><strong>Doctor:</strong> {pendingSaveAppointment.doctor.nameEn}</div>
              <div><strong>Fee:</strong> BDT ৳{pendingSaveAppointment.feeBDT}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => {
                  setShowSaveConfirmModal(false);
                  onClearPendingAppointment();
                }}
                disabled={uploading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('uploadingToDrive')}</span>
                  </>
                ) : (
                  <span>{isBn ? 'হ্যাঁ, ড্রাইভে সংরক্ষণ করুন' : 'Confirm & Upload to Drive'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY WORKSPACE DIALOG: Delete Confirmation */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{t('deleteConfirmTitle')}</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {t('deleteConfirmDesc')}
            </p>

            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs font-mono text-red-900 truncate">
              {fileToDelete.name}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t('confirmDeleteBtn')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
