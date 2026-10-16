import { ConfirmedAppointment, DriveFileItem, Language } from '../types/clinic';
import { toBanglaNumeral } from '../utils/clinicLogic';

/**
 * Thrown when Google rejects the access token (expired, 401) or the token lacks Drive
 * permission (403 insufficient scope), so the UI can ask the patient to sign in again.
 */
export class DriveAuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'DriveAuthError';
    this.status = status;
  }
}

/** Max time to wait for Google to answer before giving up (slow or dropped mobile networks). */
const DRIVE_REQUEST_TIMEOUT_MS = 30000;

/**
 * fetch() with a timeout. Without it a hung request leaves the "Uploading..." state on forever
 * (its Cancel button is disabled while uploading), so the patient would have to reload the page.
 */
async function driveFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DRIVE_REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function throwDriveError(response: Response, action: string): Promise<never> {
  const body = await response.text();
  const message = `${action}: ${response.status} - ${body}`;
  const missingScope =
    response.status === 403 && /insufficientPermissions|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(body);
  if (response.status === 401 || missingScope) {
    throw new DriveAuthError(response.status, message);
  }
  throw new Error(message);
}

/**
 * Escapes text before it is placed into the receipt HTML, so patient-entered
 * values (name, phone...) can never inject markup or scripts into the saved file.
 */
function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Builds printable HTML content for the appointment confirmation token
 */
export function generateAppointmentReceiptHtml(
  appointment: ConfirmedAppointment,
  lang: Language = 'en'
): string {
  const isBn = lang === 'bn';
  const serialDisplay = isBn ? toBanglaNumeral(appointment.serialNumber) : appointment.serialNumber;
  const feeDisplay = isBn ? `৳${toBanglaNumeral(appointment.feeBDT)}` : `BDT ৳${appointment.feeBDT}`;
  const dateDisplay = isBn ? toBanglaNumeral(appointment.appointmentDate) : appointment.appointmentDate;
  const ageDisplay = isBn ? toBanglaNumeral(appointment.patientAge) : appointment.patientAge;

  return `<!DOCTYPE html>
<html lang="${isBn ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>Padma Care Clinic Serial - ${escapeHtml(appointment.serialNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; background: #f8fafc; color: #0f172a; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border: 2px solid #0284c7; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px; }
    .clinic-title { font-size: 22px; font-weight: bold; color: #0369a1; margin: 0; }
    .clinic-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .token-box { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; text-align: center; padding: 12px; margin: 16px 0; }
    .token-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #15803d; font-weight: bold; }
    .token-number { font-size: 32px; font-weight: 800; color: #166534; font-family: monospace; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; border-bottom: 1px dotted #e2e8f0; padding-bottom: 6px; }
    .label { color: #64748b; font-weight: 600; }
    .value { font-weight: 600; color: #0f172a; }
    .instructions { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 10px 14px; margin-top: 16px; font-size: 12px; color: #1e40af; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="clinic-title">${isBn ? 'পদ্মা কেয়ার ক্লিনিক ও ডায়াগনস্টিক সেন্টার' : 'Padma Care Clinic & Diagnostic Centre'}</h1>
      <p class="clinic-subtitle">Laxmipur Medical More, Greater Road, Rajshahi-6000 | Emergency: +880 1711-234567</p>
      <div style="font-size: 12px; color: #0284c7; font-weight: bold; margin-top: 4px;">OFFICIAL CONSULTATION APPOINTMENT SLIP</div>
    </div>

    <div class="token-box">
      <div class="token-label">${isBn ? 'সিরিয়াল টোকেন নম্বর' : 'CONSULTATION SERIAL TOKEN'}</div>
      <div class="token-number">${escapeHtml(serialDisplay)}</div>
    </div>

    <div class="row">
      <span class="label">${isBn ? 'রোগীর নাম:' : 'Patient Name:'}</span>
      <span class="value">${escapeHtml(appointment.patientName)}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'মোবাইল নম্বর:' : 'Phone Number:'}</span>
      <span class="value">${escapeHtml(appointment.patientPhone)}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'বয়স ও লিঙ্গ:' : 'Age & Gender:'}</span>
      <span class="value">${escapeHtml(ageDisplay)} YRS / ${escapeHtml(appointment.patientGender.toUpperCase())}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'পরামর্শক ডাক্তার:' : 'Consultant Doctor:'}</span>
      <span class="value">${isBn ? appointment.doctor.nameBn : appointment.doctor.nameEn}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'ডিগ্রি ও পদবী:' : 'Specialty & Degrees:'}</span>
      <span class="value">${isBn ? appointment.doctor.degreesBn : appointment.doctor.degreesEn}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'চেম্বার ও রুম:' : 'Chamber / Room:'}</span>
      <span class="value">${isBn ? appointment.doctor.chamberBn : appointment.doctor.chamberEn}</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'তারিখ ও সময়:' : 'Appointment Date & Slot:'}</span>
      <span class="value">${escapeHtml(dateDisplay)} (${escapeHtml(appointment.preferredSlot)})</span>
    </div>
    <div class="row">
      <span class="label">${isBn ? 'পরামর্শ ফি:' : 'Consultation Fee:'}</span>
      <span class="value">${escapeHtml(feeDisplay)}</span>
    </div>

    <div class="instructions">
      <strong>${isBn ? 'রোগীদের জন্য নির্দেশনাবলী:' : 'Patient Notice:'}</strong><br>
      ${isBn 
        ? '১. অনুগ্রহ করে নির্ধারিত সময়ের ২০ মিনিট পূর্বে চেম্বারে উপস্থিত হয়ে রিসেপশনে এই টোকেনটি প্রদর্শন করুন। ২. পূর্বের সকল প্রেসক্রিপশন ও রিপোর্ট সাথে আনুন।'
        : '1. Please arrive at least 20 minutes prior to your scheduled time slot and show this digital slip at reception. 2. Bring any prior investigation reports.'}
    </div>

    <div class="footer">
      Generated automatically by Padma Care Clinic Portal &bull; Rajshahi, Bangladesh &bull; Saved to Google Drive
    </div>
  </div>
</body>
</html>`;
}

/**
 * Uploads an appointment receipt document to Google Drive using the user's OAuth access token
 */
export async function uploadAppointmentSlipToDrive(
  token: string,
  appointment: ConfirmedAppointment,
  lang: Language = 'en'
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const fileName = `Padma_Care_Slip_${appointment.serialNumber}.html`;
  const htmlContent = generateAppointmentReceiptHtml(appointment, lang);

  const metadata = {
    name: fileName,
    mimeType: 'text/html',
    description: `Padma Care Clinic Rajshahi Appointment Slip for ${appointment.patientName} (Serial: ${appointment.serialNumber})`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    htmlContent +
    closeDelimiter;

  const response = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    await throwDriveError(response, 'Google Drive upload failed');
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink,
  };
}

/**
 * Lists clinic appointment files saved to the user's Google Drive by this app
 */
export async function listClinicFilesFromDrive(token: string): Promise<DriveFileItem[]> {
  const query = encodeURIComponent("name contains 'Padma_Care_Slip_' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,createdTime,size)&orderBy=createdTime desc&pageSize=20`;

  const response = await driveFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await throwDriveError(response, 'Failed to list Google Drive files');
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Deletes a file from Google Drive (Mandatory user confirmation must precede this call)
 */
export async function deleteFileFromDrive(token: string, fileId: string): Promise<void> {
  const response = await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    await throwDriveError(response, 'Failed to delete Google Drive file');
  }
}
