export type Language = 'en' | 'bn';

export interface Doctor {
  id: string;
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  degreesEn: string;
  degreesBn: string;
  designationEn: string;
  designationBn: string;
  departmentId: string;
  departmentNameEn: string;
  departmentNameBn: string;
  chamberEn: string;
  chamberBn: string;
  scheduleEn: string;
  scheduleBn: string;
  visitingDays: string[]; // e.g. ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
  timeSlotEn: string;
  timeSlotBn: string;
  feeBDT: number;
  experienceYears: number;
  avatarUrl: string;
  phone: string;
  availableToday: boolean;
  bioEn: string;
  bioBn: string;
}

export interface Department {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconName: string;
  headOfDepartmentEn: string;
  headOfDepartmentBn: string;
  servicesEn: string[];
  servicesBn: string[];
  equipmentEn: string[];
  equipmentBn: string[];
  roomEn: string;
  roomBn: string;
  timingEn: string;
  timingBn: string;
  color: string;
}

export interface AppointmentFormData {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: 'male' | 'female' | 'other';
  patientAddress: string;
  appointmentDate: string;
  preferredSlot: string;
  symptoms: string;
  isFirstVisit: boolean;
}

export interface ConfirmedAppointment {
  id: string;
  serialNumber: string;
  doctor: Doctor;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientAddress: string;
  appointmentDate: string;
  preferredSlot: string;
  symptoms?: string;
  isFirstVisit: boolean;
  feeBDT: number;
  createdAt: string;
  savedToDrive?: boolean;
  driveFileId?: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
  webViewLink?: string;
}
