import type { Booking, ConsultationTrack } from '../types/clinic';

const STORAGE_KEY_BOOKINGS = 'shenoy_ayush_bookings_v1';
const STORAGE_KEY_BLOCKED = 'shenoy_ayush_blocked_v1';
const STORAGE_KEY_ADMIN_AUTH = 'shenoy_ayush_admin_auth_v1';

// Format date YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const formatDateToReadable = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

// Seed initial bookings if empty
const getSeedBookings = (): Booking[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'seed-1',
      tokenNumber: 'AYU-101',
      date: today,
      timeSlot: '09:00 AM',
      track: 'ayush',
      branch: 'ayurveda',
      patientName: 'Kavitha Nambiar',
      patientPhone: '9847123456',
      patientAge: 42,
      patientGender: 'female',
      reasonForVisit: 'Chronic cervical spondylosis & neck stiffness',
      bookingSource: 'online',
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: 'seed-2',
      tokenNumber: 'COU-102',
      date: today,
      timeSlot: '09:30 AM',
      track: 'counselling',
      patientName: 'Rahul Rajan',
      patientPhone: '9495112233',
      patientAge: 29,
      patientGender: 'male',
      reasonForVisit: 'Workplace burnout, anxiety & sleep disruption',
      bookingSource: 'telephone',
      status: 'in-consultation',
      createdAt: new Date().toISOString()
    },
    {
      id: 'seed-3',
      tokenNumber: 'AYU-103',
      date: today,
      timeSlot: '10:00 AM',
      track: 'ayush',
      branch: 'ayurveda',
      patientName: 'Suresh Kumar P.',
      patientPhone: '9744009988',
      patientAge: 58,
      patientGender: 'male',
      reasonForVisit: 'Diabetes management & neuropathy consultation',
      bookingSource: 'walk-in',
      status: 'arrived',
      createdAt: new Date().toISOString()
    },
    {
      id: 'seed-4',
      tokenNumber: 'AYU-104',
      date: today,
      timeSlot: '11:00 AM',
      track: 'ayush',
      branch: 'ayurveda',
      patientName: 'Anjana Menon',
      patientPhone: '9656223344',
      patientAge: 34,
      patientGender: 'female',
      reasonForVisit: 'Digestive reflux and metabolic sluggishness',
      bookingSource: 'online',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ];
};

export const getStoredBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!data) {
      const seeds = getSeedBookings();
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(data);
  } catch {
    return getSeedBookings();
  }
};

export const saveBooking = (newBooking: Booking): Booking[] => {
  const current = getStoredBookings();
  const updated = [newBooking, ...current];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return updated;
};

export const updateBookingStatus = (
  id: string,
  status: Booking['status']
): Booking[] => {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return updated;
};

export const deleteBooking = (id: string): Booking[] => {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return updated;
};

// Blocked slots for emergency or doctor unavailable
export interface BlockedSlot {
  date: string;
  timeSlot: string;
  track: ConsultationTrack;
  reason: string;
}

export const getStoredBlockedSlots = (): BlockedSlot[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BLOCKED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleBlockSlot = (
  date: string,
  timeSlot: string,
  track: ConsultationTrack,
  reason: string = 'Doctor on Emergency Call'
): BlockedSlot[] => {
  const current = getStoredBlockedSlots();
  const exists = current.some(
    (b) => b.date === date && b.timeSlot === timeSlot && b.track === track
  );
  let updated: BlockedSlot[];
  if (exists) {
    updated = current.filter(
      (b) => !(b.date === date && b.timeSlot === timeSlot && b.track === track)
    );
  } else {
    updated = [...current, { date, timeSlot, track, reason }];
  }
  localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(updated));
  return updated;
};

// Admin authentication helpers
export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
};

export const setAdminLoggedIn = (status: boolean) => {
  if (status) {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
};

// Generate token number (e.g. AYU-2603, COU-4819)
export const generateToken = (track: ConsultationTrack): string => {
  const prefix = track === 'ayush' ? 'AYU' : 'COU';
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randomNum}`;
};
