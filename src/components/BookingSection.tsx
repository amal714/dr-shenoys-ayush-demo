import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldAlert,
  HeartHandshake,
  Check
} from 'lucide-react';
import { AYUSH_BRANCHES, CLINIC_INFO, GENERATE_DAILY_SLOTS } from '../data/clinicData';
import type { AyushBranchKey, Booking, ConsultationTrack } from '../types/clinic';
import {
  generateToken,
  getStoredBlockedSlots,
  getStoredBookings,
  getTodayDateString,
  saveBooking
} from '../utils/storage';
import confetti from 'canvas-confetti';

interface BookingSectionProps {
  selectedTrack: ConsultationTrack;
  setSelectedTrack: (t: ConsultationTrack) => void;
  selectedBranch: AyushBranchKey | null;
  setSelectedBranch: (b: AyushBranchKey | null) => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingSection = ({
  selectedTrack,
  setSelectedTrack,
  onBookingSuccess
}: BookingSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [reason, setReason] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'id_upload' | 'otp_instant'>('id_upload');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate next 14 bookable days (excluding Sunday)
  const availableDates = useMemo(() => {
    const list: { dateStr: string; dayName: string; dayNum: number; branchInfo?: string; isSunday: boolean }[] = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];
      const isSunday = dayOfWeek === 0;

      let branchInfo = 'Review OPD';
      if (dayOfWeek === 1) branchInfo = 'Ayurveda';
      else if (dayOfWeek === 2) branchInfo = 'Yoga';
      else if (dayOfWeek === 3) branchInfo = 'Unani';
      else if (dayOfWeek === 4) branchInfo = 'Siddha';
      else if (dayOfWeek === 5) branchInfo = 'Reiki';

      list.push({
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        branchInfo,
        isSunday
      });
    }
    return list;
  }, []);

  const selectedDayOfWeek = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getDay();
  }, [selectedDate]);

  const currentAyushBranch = useMemo(() => {
    return AYUSH_BRANCHES.find((b) => b.dayOfWeek === selectedDayOfWeek);
  }, [selectedDayOfWeek]);

  const allBookings = getStoredBookings();
  const allBlocked = getStoredBlockedSlots();
  const dailySlots = useMemo(() => GENERATE_DAILY_SLOTS(), []);

  const getSlotAvailability = (time: string, isLunch?: boolean) => {
    if (isLunch) return 'lunch';

    const isBlocked = allBlocked.some(
      (b) => b.date === selectedDate && b.timeSlot === time && b.track === selectedTrack
    );
    if (isBlocked) return 'blocked';

    const isBooked = allBookings.some(
      (b) =>
        b.date === selectedDate &&
        b.timeSlot === time &&
        b.track === selectedTrack &&
        b.status !== 'cancelled'
    );
    if (isBooked) return 'booked';

    return 'available';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('ID image must be less than 5MB');
        return;
      }
      setIdFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSlot) {
      setErrorMsg('Please select an available 30-minute consultation time slot.');
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg('Please enter patient full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      setErrorMsg('Please enter a valid patient age.');
      return;
    }
    if (verificationMethod === 'id_upload' && !idFile) {
      setErrorMsg('Please upload a Photo ID or switch to Instant Mobile OTP mode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newToken = generateToken(selectedTrack);
      const newBooking: Booking = {
        id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        tokenNumber: newToken,
        date: selectedDate,
        timeSlot: selectedSlot,
        track: selectedTrack,
        branch: selectedTrack === 'ayush' ? currentAyushBranch?.id : undefined,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: Number(patientAge),
        patientGender,
        reasonForVisit: reason.trim() || 'General OPD Consultation',
        photoIdUrl: idPreview || undefined,
        photoIdName: idFile?.name || (verificationMethod === 'otp_instant' ? 'Verified via Mobile OTP' : undefined),
        bookingSource: 'online',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      saveBooking(newBooking);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      onBookingSuccess(newBooking);

      // Reset
      setSelectedSlot(null);
      setPatientName('');
      setPatientPhone('');
      setPatientAge('');
      setReason('');
      setIdFile(null);
      setIdPreview(null);
    } catch {
      setErrorMsg('Failed to confirm booking. Please try again or call the clinic.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking-section"
      className="py-14 px-4 bg-gradient-to-b from-stone-50 via-amber-50/20 to-white border-t-4 border-amber-500"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title Banner with Saffron/Gold & Emerald accents */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-100" />
            <span>INSTANT OPD APPOINTMENT SYSTEM</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Reserve Your 30-Minute Consultation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-medium">
            Directly confirmed with <strong>{CLINIC_INFO.name}</strong>, Payyanur. 
            Monday to Saturday · 9:00 AM – 7:00 PM (Lunch Recess: 1:00 PM – 2:00 PM).
          </p>
        </div>

        {/* STEP 1: Select Consultation Stream */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 mb-6">
          <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            Select Consultation Stream
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
            {/* AYUSH Track */}
            <button
              type="button"
              onClick={() => setSelectedTrack('ayush')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                selectedTrack === 'ayush'
                  ? 'bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-emerald-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                🌿
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm sm:text-base text-stone-900">AYUSH OPD Stream</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Dr. Satyajith Shenoy
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  Daily rotating branch: Mon: Ayurveda · Tue: Yoga · Wed: Unani · Thu: Siddha · <strong className="text-orange-700 font-bold">Fri: Reiki</strong>
                </p>
              </div>
            </button>

            {/* Counselling Track */}
            <button
              type="button"
              onClick={() => setSelectedTrack('counselling')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                selectedTrack === 'counselling'
                  ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm sm:text-base text-stone-900">Psychological Counselling</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Dr. Ananya Varma
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  Runs concurrently Monday to Saturday. Confidential support for stress, sleep, anxiety & mental clarity.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: Select Date (Highlights Weekly AYUSH Days) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              Select Consultation Date
            </label>
            <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
              Monday to Saturday (Sundays Closed)
            </span>
          </div>

          {/* Date horizontal scroller */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-2 px-2">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              if (item.isSunday) {
                return (
                  <div
                    key={item.dateStr}
                    className="shrink-0 w-22 py-2.5 px-1.5 rounded-2xl bg-stone-100 text-stone-400 border border-stone-200 text-center opacity-60 cursor-not-allowed"
                    title="Sunday - OPD Closed"
                  >
                    <span className="block text-[10px] font-bold uppercase">{item.dayName}</span>
                    <span className="block text-lg font-bold">{item.dayNum}</span>
                    <span className="block text-[9px] font-semibold text-red-400">Closed</span>
                  </div>
                );
              }

              const isReikiDay = item.branchInfo === 'Reiki';

              return (
                <button
                  type="button"
                  key={item.dateStr}
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    setSelectedSlot(null);
                  }}
                  className={`shrink-0 w-24 py-3 px-1.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-orange-600 shadow-md scale-102 ring-2 ring-orange-300'
                      : isReikiDay
                      ? 'bg-orange-50/70 border-orange-300 text-stone-900 hover:border-orange-500'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <span className={`block text-[11px] font-black uppercase ${isSelected ? 'text-amber-100' : 'text-stone-500'}`}>
                    {item.dayName}
                  </span>
                  <span className="block text-xl font-black my-0.5">
                    {item.dayNum}
                  </span>
                  <span
                    className={`block text-[10px] font-extrabold truncate px-1 rounded-md ${
                      isSelected
                        ? 'bg-black/20 text-white'
                        : isReikiDay
                        ? 'bg-orange-200 text-orange-950 font-black'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {selectedTrack === 'ayush' ? item.branchInfo : 'Counselling'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Banner highlighting today's AYUSH Focus */}
          {selectedTrack === 'ayush' && currentAyushBranch && (
            <div className={`mt-3.5 p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
              currentAyushBranch.id === 'reiki'
                ? 'bg-orange-50 border-orange-300 text-orange-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{currentAyushBranch.icon}</span>
                <div>
                  <span className="font-black text-sm">
                    {currentAyushBranch.dayName} Specialization: {currentAyushBranch.name} Clinic
                  </span>
                  <p className="text-[11px] opacity-90 font-medium">{currentAyushBranch.shortDesc}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase border ${currentAyushBranch.badgeColor}`}>
                Active Focus
              </span>
            </div>
          )}

          {selectedTrack === 'counselling' && (
            <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center gap-2.5 text-xs text-amber-950 font-medium">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Psychological Counselling Track:</strong> Private sessions with Dr. Ananya Varma running concurrently with the main OPD.
              </span>
            </div>
          )}
        </div>

        {/* STEP 3: Select 30-Minute Time Slot */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              Select 30-Minute Slot (9:00 AM – 7:00 PM)
            </label>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Available
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Booked
              </span>
            </div>
          </div>

          {/* Morning Slots */}
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block mb-2">
              Morning Session (09:00 AM – 01:00 PM)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dailySlots.slice(0, 8).map((slot) => {
                const status = getSlotAvailability(slot.time);
                const isSelected = selectedSlot === slot.time;
                const isAvailable = status === 'available';

                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-emerald-800 shadow-sm font-black'
                        : isAvailable
                        ? 'bg-white hover:bg-emerald-50 border-stone-200 text-stone-800 font-bold hover:border-emerald-500'
                        : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px]">
                      {isSelected ? '✓ Picked' : isAvailable ? 'Open' : status === 'blocked' ? 'Blocked' : 'Booked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LUNCH BREAK EMPHASIS BANNER */}
          <div className="my-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 flex items-center justify-between text-amber-950 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>01:00 PM – 02:00 PM:</strong> Doctor's Lunch & Clinic Sanitization Recess (No booking slots)
              </span>
            </div>
            <span className="text-[10px] font-black bg-amber-600 text-white px-2.5 py-1 rounded-full uppercase">
              Lunch Break
            </span>
          </div>

          {/* Afternoon / Evening Slots */}
          <div>
            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block mb-2">
              Evening Session (02:00 PM – 07:00 PM)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {dailySlots.slice(10).map((slot) => {
                const status = getSlotAvailability(slot.time);
                const isSelected = selectedSlot === slot.time;
                const isAvailable = status === 'available';

                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-emerald-800 shadow-sm font-black'
                        : isAvailable
                        ? 'bg-white hover:bg-emerald-50 border-stone-200 text-stone-800 font-bold hover:border-emerald-500'
                        : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px]">
                      {isSelected ? '✓ Picked' : isAvailable ? 'Open' : status === 'blocked' ? 'Blocked' : 'Booked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP 4: Patient Info & ID Upload / Verification Form */}
        <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90">
          <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">4</span>
            Patient Registration & ID Verification
          </label>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Patient Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Nair"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 bg-stone-50/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Mobile Number (WhatsApp & SMS) *</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-700 text-xs font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9847123456"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-r-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 bg-stone-50/50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 38"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 bg-stone-50/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Gender *
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 bg-stone-50/50 font-medium"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Reason for Consultation / Health Complaints (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Back pain, chronic allergies, joint stiffness, anxiety..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 bg-stone-50/50 font-medium"
            />
          </div>

          {/* ID Verification Switcher */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-black text-amber-950">Patient Identity Verification</h4>
                <p className="text-[11px] text-stone-600 font-medium">Compliance with medical OPD register and prescription issuance.</p>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setVerificationMethod('id_upload')}
                  className={`text-[11px] font-black px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    verificationMethod === 'id_upload'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Upload Photo ID
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationMethod('otp_instant')}
                  className={`text-[11px] font-black px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    verificationMethod === 'otp_instant'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Mobile OTP (Fast)
                </button>
              </div>
            </div>

            {verificationMethod === 'id_upload' ? (
              <div>
                <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center bg-white hover:border-amber-500 transition-colors">
                  <input
                    type="file"
                    id="photo-id-input"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="photo-id-input" className="cursor-pointer block">
                    {idPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={idPreview}
                          alt="ID Preview"
                          className="w-24 h-24 object-cover rounded-xl border border-stone-200 shadow-2xs"
                        />
                        <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{idFile?.name} (Ready)</span>
                        </span>
                        <span className="text-[11px] text-stone-400 underline">Tap to change document</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-2">
                        <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-stone-900">
                          Tap to take photo or choose Aadhaar / Voter ID / License
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">
                          Supports JPG, PNG or PDF (Max 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-[10px] text-stone-500 mt-1.5 text-center font-medium">
                  🔒 Encrypted and stored safely for clinic verification only.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-black mb-1">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Instant Mobile Phone Verification</span>
                </div>
                <p className="text-stone-600 text-[11px] font-medium">
                  No upload required. A verification code will be dispatched to <strong>{patientPhone || 'your phone number'}</strong>. Present physical ID at the Payyanur clinic counter upon arrival.
                </p>
              </div>
            )}
          </div>

          {/* Slot summary recap before clicking submit */}
          <div className="mb-4 p-3.5 bg-stone-100 rounded-2xl flex items-center justify-between text-xs text-stone-700">
            <div>
              <span className="text-stone-500 font-medium">Selected Slot:</span>
              <p className="font-black text-stone-900 mt-0.5">
                {selectedDate} · {selectedSlot || 'Please pick time above'} ({selectedTrack === 'ayush' ? 'AYUSH OPD' : 'Counselling'})
              </p>
            </div>
            {selectedSlot ? (
              <span className="text-emerald-900 font-black bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-xs">
                Slot Ready
              </span>
            ) : (
              <span className="text-amber-800 font-bold bg-amber-100 px-2.5 py-1 rounded-md text-[11px]">
                Time slot required
              </span>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedSlot}
            className={`w-full py-4 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              !selectedSlot || isSubmitting
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white active:scale-98 hover:shadow-lg ring-2 ring-emerald-600/30'
            }`}
          >
            <Calendar className="w-5 h-5 text-emerald-200" />
            <span>{isSubmitting ? 'Confirming Appointment...' : 'Confirm & Generate OPD Token'}</span>
          </button>
        </form>
      </div>
    </section>
  );
};
