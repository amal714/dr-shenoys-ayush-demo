export type AyushBranchKey = 'ayurveda' | 'yoga' | 'unani' | 'siddha' | 'heiki';

export interface AyushBranch {
  id: AyushBranchKey;
  name: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday
  dayName: string;
  shortDesc: string;
  fullDesc: string;
  focusAreas: string[];
  icon: string;
  accentColor: string;
  badgeColor: string;
}

export type ConsultationTrack = 'ayush' | 'counselling';

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'lunch';

export interface TimeSlot {
  time: string; // e.g. "09:00 AM"
  slotIndex: number;
  isLunch?: boolean;
}

export interface Booking {
  id: string;
  tokenNumber: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  track: ConsultationTrack;
  branch?: AyushBranchKey;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  reasonForVisit: string;
  photoIdUrl?: string; // Data URL or filename
  photoIdName?: string;
  bookingSource: 'online' | 'telephone' | 'walk-in';
  status: 'confirmed' | 'arrived' | 'in-consultation' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface ClinicConfig {
  name: string;
  doctorName: string;
  counsellorName: string;
  phone: string;
  displayPhone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  lunchStart: string;
  lunchEnd: string;
}
