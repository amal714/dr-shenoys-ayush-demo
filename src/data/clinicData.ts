import type { AyushBranch, ClinicConfig, TimeSlot } from '../types/clinic';

export const CLINIC_INFO: ClinicConfig = {
  name: "Dr Satyajith Shenoys Ayush OPD Clinic",
  doctorName: "Dr. Satyajith Shenoy, BAMS, MD (Ayush)",
  counsellorName: "Dr. Ananya Varma, M.Sc, M.Phil (Clinical Psychology)",
  phone: "+916282632035",
  displayPhone: "062826 32035",
  address: "Police Station Road, Payyanur",
  pincode: "670307",
  city: "Payyanur",
  state: "Keralam",
  openingTime: "09:00 AM",
  closingTime: "07:00 PM",
  slotDurationMinutes: 30,
  lunchStart: "01:00 PM",
  lunchEnd: "02:00 PM"
};

export const AYUSH_BRANCHES: AyushBranch[] = [
  {
    id: 'ayurveda',
    name: 'Ayurveda',
    dayOfWeek: 1, // Monday
    dayName: 'Monday',
    shortDesc: 'Ancient Science of Life & Tridosha Harmony',
    fullDesc: 'Customised herbal formulations, Panchakarma rejuvenation, and pulse diagnosis to restore constitutional balance (Vata, Pitta, Kapha).',
    focusAreas: ['Digestive Disorders', 'Arthritis & Joint Pain', 'Chronic Skin Conditions', 'Metabolic Health'],
    icon: '🌿',
    accentColor: '#15803D',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'yoga',
    name: 'Yoga & Naturopathy',
    dayOfWeek: 2, // Tuesday
    dayName: 'Tuesday',
    shortDesc: 'Drugless Healing through Nature & Breath Alignment',
    fullDesc: 'Hydrotherapy, therapeutic mud applications, tailored Pranayama breathing, and restorative postures that awaken internal vitality.',
    focusAreas: ['Stress & Hypertension', 'Spine Rehabilitation', 'Obesity Management', 'Lifestyle Rebalancing'],
    icon: '🧘',
    accentColor: '#0284C7',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  {
    id: 'unani',
    name: 'Unani',
    dayOfWeek: 3, // Wednesday
    dayName: 'Wednesday',
    shortDesc: 'Greco-Arabic Humoral Equilibrium & Regimenal Therapy',
    fullDesc: 'Balancing the four primary humors (Blood, Phlegm, Yellow Bile, Black Bile) through Ilaj-bit-Tadbeer (regimenal therapy) and herbal preparations.',
    focusAreas: ['Liver & Gastrointestinal Care', 'Respiratory Health', 'Skin Vitality', 'General Tonicity'],
    icon: '🧪',
    accentColor: '#B45309',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'siddha',
    name: 'Siddha',
    dayOfWeek: 4, // Thursday
    dayName: 'Thursday',
    shortDesc: 'Tamil Heritage Medicine of Longevity & Kayakalpa',
    fullDesc: 'Rooted in South Indian traditions, utilizing mineral-herbal compounds and Varmam points to activate longevity pathways and immune resilience.',
    focusAreas: ['Chronic Pain & Varmam', 'Autoimmune Support', 'Sinusitis & Allergies', 'Geriatric Vitality'],
    icon: '🏺',
    accentColor: '#7C3AED',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'heiki',
    name: 'Heiki',
    dayOfWeek: 5, // Friday
    dayName: 'Friday',
    shortDesc: 'Bio-Energetic & Gentle Resonance Therapeutics',
    fullDesc: 'Subtle bio-energy harmonization and individualized micro-potent remedies designed to stimulate self-recovery without harsh side effects.',
    focusAreas: ['Pediatric Recurrent Cough/Cold', 'Allergic Rhinitis', 'Psychosomatic Discomfort', 'Hormonal Imbalance'],
    icon: '✨',
    accentColor: '#C026D3',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300'
  }
];

// Generates the standard 30-min daily slots from 09:00 AM to 07:00 PM, identifying lunch break 1:00 PM - 2:00 PM
export const GENERATE_DAILY_SLOTS = (): TimeSlot[] => {
  return [
    { time: '09:00 AM', slotIndex: 1 },
    { time: '09:30 AM', slotIndex: 2 },
    { time: '10:00 AM', slotIndex: 3 },
    { time: '10:30 AM', slotIndex: 4 },
    { time: '11:00 AM', slotIndex: 5 },
    { time: '11:30 AM', slotIndex: 6 },
    { time: '12:00 PM', slotIndex: 7 },
    { time: '12:30 PM', slotIndex: 8 },
    { time: '01:00 PM', slotIndex: 9, isLunch: true },
    { time: '01:30 PM', slotIndex: 10, isLunch: true },
    { time: '02:00 PM', slotIndex: 11 },
    { time: '02:30 PM', slotIndex: 12 },
    { time: '03:00 PM', slotIndex: 13 },
    { time: '03:30 PM', slotIndex: 14 },
    { time: '04:00 PM', slotIndex: 15 },
    { time: '04:30 PM', slotIndex: 16 },
    { time: '05:00 PM', slotIndex: 17 },
    { time: '05:30 PM', slotIndex: 18 },
    { time: '06:00 PM', slotIndex: 19 },
    { time: '06:30 PM', slotIndex: 20 },
  ];
};

export const CLINIC_BENEFITS = [
  {
    title: 'Holistic Root-Cause Care',
    desc: 'Beyond symptom suppression: complete harmony of physical and mental vitality.',
    icon: '🌱'
  },
  {
    title: 'Dual-Track Specialization',
    desc: 'Simultaneous consultation tracks for specialized AYUSH systems and psychological counselling.',
    icon: '⚖️'
  },
  {
    title: 'Zero Waiting Queue',
    desc: 'Precise 30-minute token slots with live mobile queue monitor to respect your time.',
    icon: '⏱️'
  },
  {
    title: 'Payyanur Central Location',
    desc: 'Easily accessible on Police Station Road with verified parking and accessible ground-floor entry.',
    icon: '📍'
  }
];
