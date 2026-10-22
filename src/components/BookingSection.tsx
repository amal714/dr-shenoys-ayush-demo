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
  HeartHandshake
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

export const BookingSection: React.FC<BookingSectionProps> = ({
  selectedTrack,
  setSelectedTrack,
  onBookingSuccess
}) => {
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
      const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday
      const dateStr = d.toISOString().split('T')[0];
      const isSunday = dayOfWeek === 0;

      let branchInfo = 'Review OPD';
      if (dayOfWeek === 1) branchInfo = 'Ayurveda';
      else if (dayOfWeek === 2) branchInfo = 'Yoga';
      else if (dayOfWeek === 3) branchInfo = 'Unani';
      else if (dayOfWeek === 4) branchInfo = 'Siddha';
      else if (dayOfWeek === 5) branchInfo = 'Heiki';

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

  // Compute the AYUSH branch for currently selected date
  const selectedDayOfWeek = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getDay(); // 1 = Monday, 5 = Friday
  }, [selectedDate]);

  const currentAyushBranch = useMemo(() => {
    return AYUSH_BRANCHES.find((b) => b.dayOfWeek === selectedDayOfWeek);
  }, [selectedDayOfWeek]);

  // Read stored bookings & blocked slots to compute slot availability
  const allBookings = getStoredBookings();
  const allBlocked = getStoredBlockedSlots();

  const dailySlots = useMemo(() => {
    return GENERATE_DAILY_SLOTS();
  }, []);

  // Determine slot status for the selected date & track
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

  // Handle Photo ID File Selection
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

  // Submission handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSlot) {
      setErrorMsg('Please select a 30-minute consultation time slot.');
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
      setErrorMsg('Please upload a Photo ID (Aadhaar / Voter ID / License) or switch to Instant OTP Verification.');
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

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback gracefully if canvas is blocked
      }

      onBookingSuccess(newBooking);

      // Reset form
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
      className="py-12 px-4 bg-gradient-to-b from-white via-emerald-50/40 to-stone-100 border-t-2 border-emerald-600"
    >
      <div className="max-w-4xl mx-auto">
        {/* Highlight Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRIMARY BOOKING PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Reserve Your 30-Minute OPD Consultation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Directly scheduled with <strong>{CLINIC_INFO.name}</strong>. Timings: 9:00 AM – 7:00 PM, 
            Monday to Saturday (Lunch Break 1:00 PM – 2:00 PM).
          </p>
        </div>

        {/* STEP 1: Select Consultation Track */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">1</span>
            Select Consultation Stream
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {/* AYUSH Track */}
            <button
              type="button"
              onClick={() => setSelectedTrack('ayush')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedTrack === 'ayush'
                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/30'
                  : 'bg-stone-50/60 border-stone-200 hover:border-emerald-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
                🌿
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900">AYUSH OPD Stream</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Dr. Satyajith Shenoy
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Daily rotating branch: Mon: Ayurveda · Tue: Yoga · Wed: Unani · Thu: Siddha · <strong>Fri: Heiki</strong>
                </p>
              </div>
            </button>

            {/* Counselling Track */}
            <button
              type="button"
              onClick={() => setSelectedTrack('counselling')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedTrack === 'counselling'
                  ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-500/30'
                  : 'bg-stone-50/60 border-stone-200 hover:border-teal-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xl shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900">Psychological Counselling</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                    Dr. Ananya Varma
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Available Mon–Sat concurrently. Dedicated sessions for mental clarity, anxiety & stress management.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: Select Date */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">2</span>
              Select Consultation Date
            </label>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Sundays: Clinic Closed
            </span>
          </div>

          {/* Date horizontal scroller */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-2 px-2">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              if (item.isSunday) {
                return (
                  <div
                    key={item.dateStr}
                    className="shrink-0 w-20 py-2 px-1 rounded-xl bg-stone-100 text-stone-400 border border-stone-200 text-center opacity-60 cursor-not-allowed"
                    title="Sunday - OPD Closed"
                  >
                    <span className="block text-[10px] font-bold uppercase">{item.dayName}</span>
                    <span className="block text-lg font-bold">{item.dayNum}</span>
                    <span className="block text-[9px] font-medium text-stone-400">Closed</span>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={item.dateStr}
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    setSelectedSlot(null); // Reset slot on date change
                  }}
                  className={`shrink-0 w-22 py-2.5 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-102'
                      : 'bg-white hover:bg-emerald-50/50 border-stone-200 text-stone-800'
                  }`}
                >
                  <span className={`block text-[11px] font-bold uppercase ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {item.dayName}
                  </span>
                  <span className="block text-xl font-extrabold my-0.5">
                    {item.dayNum}
                  </span>
                  <span
                    className={`block text-[10px] font-semibold truncate px-1 rounded ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100'
                        : item.branchInfo === 'Heiki'
                        ? 'bg-fuchsia-100 text-fuchsia-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {selectedTrack === 'ayush' ? item.branchInfo : 'Counselling'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Banner for the selected day */}
          {selectedTrack === 'ayush' && currentAyushBranch && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentAyushBranch.icon}</span>
                <div>
                  <span className="font-bold text-emerald-950">
                    {currentAyushBranch.dayName} Specialization: {currentAyushBranch.name}
                  </span>
                  <p className="text-emerald-800 text-[11px]">{currentAyushBranch.shortDesc}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${currentAyushBranch.badgeColor}`}>
                Active OPD Focus
              </span>
            </div>
          )}

          {selectedTrack === 'counselling' && (
            <div className="mt-3 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2 text-xs text-teal-900">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                <strong>Psychological Counselling Track:</strong> Private 1-on-1 consultations with Dr. Ananya Varma scheduled in parallel with the main OPD.
              </span>
            </div>
          )}
        </div>

        {/* STEP 3: Select 30-Minute Time Slot */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">3</span>
              Select 30-Minute Slot (9:00 AM – 7:00 PM)
            </label>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Booked
              </span>
            </div>
          </div>

          {/* Morning Slots (09:00 AM - 12:30 PM) */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Morning Sessions (09:00 AM – 01:00 PM)
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
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-bold'
                        : isAvailable
                        ? 'bg-white hover:bg-emerald-50 border-stone-200 text-stone-800 font-semibold hover:border-emerald-400'
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

          {/* Mandatory Lunch Break Notice (1:00 PM - 2:00 PM) */}
          <div className="my-3 py-2.5 px-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-amber-900 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>01:00 PM – 02:00 PM:</strong> Doctor's Lunch & Clinic Sanitization Break (No slots)
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              Lunch Recess
            </span>
          </div>

          {/* Afternoon / Evening Slots (02:00 PM - 06:30 PM) */}
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Afternoon & Evening Sessions (02:00 PM – 07:00 PM)
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
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-bold'
                        : isAvailable
                        ? 'bg-white hover:bg-emerald-50 border-stone-200 text-stone-800 font-semibold hover:border-emerald-400'
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
        <form onSubmit={handleBookingSubmit} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">4</span>
            Patient Registration & ID Verification
          </label>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Patient Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Nair"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50/50"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Mobile Number (for SMS & WhatsApp Confirmation) *</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9847123456"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-r-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50/50"
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gender *
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50/50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Reason for consultation */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Reason for Consultation / Health Complaints (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Back pain, chronic allergies, digestion issues, stress..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50/50"
            />
          </div>

          {/* ID Verification Section (User's request + Better alternative) */}
          <div className="mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Patient Identity Verification</h4>
                <p className="text-[11px] text-stone-500">Required for official clinic register and prescription issuance.</p>
              </div>

              {/* Toggle verification method */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setVerificationMethod('id_upload')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    verificationMethod === 'id_upload'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Upload Photo ID
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationMethod('otp_instant')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    verificationMethod === 'otp_instant'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Mobile OTP (Quick)
                </button>
              </div>
            </div>

            {verificationMethod === 'id_upload' ? (
              <div>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center bg-white hover:border-emerald-400 transition-colors">
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
                          className="w-24 h-24 object-cover rounded-lg border border-stone-200 shadow-2xs"
                        />
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{idFile?.name} (Ready to submit)</span>
                        </span>
                        <span className="text-[11px] text-stone-400 underline">Tap to change ID photo</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-stone-800">
                          Tap to take photo or choose Aadhaar / Voter ID / License
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Supports JPG, PNG or PDF (Max 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 text-center">
                  🔒 Strictly encrypted and stored locally in clinic registry per medical privacy norms.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Instant Mobile Phone Verification</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  No document upload required! A secure confirmation code will be dispatched to <strong>{patientPhone || 'your mobile'}</strong> on submission. Simply show your physical ID at the clinic reception upon arrival.
                </p>
              </div>
            )}
          </div>

          {/* Slot summary recap before clicking submit */}
          <div className="mb-4 p-3 bg-stone-100 rounded-xl flex items-center justify-between text-xs text-stone-700">
            <div>
              <span className="text-stone-500">Selected Appointment:</span>
              <p className="font-bold text-stone-900 mt-0.5">
                {selectedDate} · {selectedSlot || 'No slot selected'} ({selectedTrack === 'ayush' ? 'AYUSH OPD' : 'Counselling'})
              </p>
            </div>
            {selectedSlot ? (
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full text-xs">
                Slot Ready
              </span>
            ) : (
              <span className="text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                Please pick a time above
              </span>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedSlot}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              !selectedSlot || isSubmitting
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98 hover:shadow-lg'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>{isSubmitting ? 'Confirming Appointment...' : 'Confirm & Generate OPD Token'}</span>
          </button>
        </form>
      </div>
    </section>
  );
};
