import { useState } from 'react';
import {
  Lock,
  LogOut,
  Calendar,
  PlusCircle,
  Ban,
  Printer,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { Booking, ConsultationTrack } from '../types/clinic';
import { CLINIC_INFO, GENERATE_DAILY_SLOTS } from '../data/clinicData';
import {
  deleteBooking,
  generateToken,
  getStoredBlockedSlots,
  getStoredBookings,
  getTodayDateString,
  saveBooking,
  setAdminLoggedIn,
  toggleBlockSlot,
  updateBookingStatus
} from '../utils/storage';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onDataChanged: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  onDataChanged
}) => {
  // Login credentials state
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active view tab in admin
  const [activeTab, setActiveTab] = useState<'queue' | 'manual_booking' | 'block_slots'>('queue');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState<'all' | ConsultationTrack>('all');

  // Manual booking form state (Telephone / Walk-in)
  const [mbPatientName, setMbPatientName] = useState('');
  const [mbPhone, setMbPhone] = useState('');
  const [mbAge, setMbAge] = useState('');
  const [mbGender, setMbGender] = useState<'male' | 'female' | 'other'>('male');
  const [mbTrack, setMbTrack] = useState<ConsultationTrack>('ayush');
  const [mbSlot, setMbSlot] = useState('10:00 AM');
  const [mbSource, setMbSource] = useState<'telephone' | 'walk-in'>('telephone');
  const [mbReason, setMbReason] = useState('Offline appointment booked via reception');
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Secure passcode for Dr Shenoy's clinic
    if (pin === 'shenoy2026' || pin === '2026' || pin === 'admin') {
      setIsAdmin(true);
      setAdminLoggedIn(true);
      setPin('');
    } else {
      setLoginError('Invalid Administrator Passcode. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminLoggedIn(false);
  };

  const allBookings = getStoredBookings();
  const allBlocked = getStoredBlockedSlots();
  const dailySlots = GENERATE_DAILY_SLOTS();

  // Filter bookings for the selected date
  const filteredBookings = allBookings.filter((b) => {
    const matchesDate = b.date === selectedDate;
    const matchesTrack = filterTrack === 'all' || b.track === filterTrack;
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.patientPhone.includes(searchQuery) ||
      b.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesTrack && matchesSearch;
  });

  // Handle offline / telephone booking submission
  const handleManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setManualSuccessMsg(null);

    if (!mbPatientName.trim() || !mbPhone.trim()) {
      alert('Please provide patient name and phone number');
      return;
    }

    const token = generateToken(mbTrack);
    const newBooking: Booking = {
      id: `admin-bk-${Date.now()}`,
      tokenNumber: token,
      date: selectedDate,
      timeSlot: mbSlot,
      track: mbTrack,
      patientName: mbPatientName.trim(),
      patientPhone: mbPhone.trim(),
      patientAge: Number(mbAge) || 30,
      patientGender: mbGender,
      reasonForVisit: mbReason,
      bookingSource: mbSource,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    saveBooking(newBooking);
    onDataChanged();
    setManualSuccessMsg(`Booking saved! Token issued: ${token} for ${mbSlot}`);
    setMbPatientName('');
    setMbPhone('');
    setMbAge('');
    setTimeout(() => setManualSuccessMsg(null), 4000);
  };

  const handleStatusChange = (id: string, newStatus: Booking['status']) => {
    updateBookingStatus(id, newStatus);
    onDataChanged();
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? The slot will become available.')) {
      deleteBooking(id);
      onDataChanged();
    }
  };

  const handleToggleBlock = (time: string) => {
    toggleBlockSlot(selectedDate, time, 'ayush', 'Blocked by Doctor');
    onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Clinic Admin & Reception Desk
              </h3>
              <p className="text-[11px] text-stone-400">
                {CLINIC_INFO.name} · Telephone & Walk-in Slot Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="text-xs text-red-300 hover:text-white flex items-center gap-1 bg-red-950/60 hover:bg-red-900 px-2.5 py-1.5 rounded-lg border border-red-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white text-xs bg-stone-800 hover:bg-stone-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Not Logged In State: High Security PIN form */}
        {!isAdmin ? (
          <div className="p-8 max-w-md mx-auto text-center w-full my-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">Reception & Doctor Login</h4>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Restricted portal for Dr. Satyajith Shenoy & clinical desk staff.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Admin PIN / Passcode"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-stone-50"
                  autoFocus
                />
                <span className="text-[11px] text-stone-400 block mt-1">
                  (Demo PIN: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">2026</code> or <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">shenoy2026</code>)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Admin Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Admin Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-stone-200 px-5 pt-3 bg-stone-50/80 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`py-2 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'queue'
                      ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Daily OPD Register ({filteredBookings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('manual_booking')}
                  className={`py-2 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'manual_booking'
                      ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Manual / Phone Booking</span>
                </button>

                <button
                  onClick={() => setActiveTab('block_slots')}
                  className={`py-2 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'block_slots'
                      ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Doctor Schedule & Blocks</span>
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 pb-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Register</span>
              </button>
            </div>

            {/* TAB 1: Daily OPD Queue */}
            {activeTab === 'queue' && (
              <div className="p-5 flex-1 overflow-y-auto">
                {/* Filter and Date Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-800 bg-white"
                    />

                    <select
                      value={filterTrack}
                      onChange={(e) => setFilterTrack(e.target.value as any)}
                      className="text-xs px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-800 bg-white"
                    >
                      <option value="all">All Tracks</option>
                      <option value="ayush">AYUSH OPD Only</option>
                      <option value="counselling">Counselling Only</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search patient, phone, token..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                {/* Patient Table */}
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-700">No bookings for this date or filter.</p>
                    <p className="text-xs text-stone-500 mt-0.5">Use the "Manual / Phone Booking" tab to register offline walk-ins.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                        <tr>
                          <th className="px-3 py-2.5">Token</th>
                          <th className="px-3 py-2.5">Time</th>
                          <th className="px-3 py-2.5">Patient Info</th>
                          <th className="px-3 py-2.5">Track</th>
                          <th className="px-3 py-2.5">Source</th>
                          <th className="px-3 py-2.5">Status</th>
                          <th className="px-3 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="px-3 py-3 font-mono font-bold text-emerald-800">
                              {b.tokenNumber}
                            </td>
                            <td className="px-3 py-3 font-semibold text-stone-900 whitespace-nowrap">
                              {b.timeSlot}
                            </td>
                            <td className="px-3 py-3">
                              <div className="font-bold text-stone-900">{b.patientName}</div>
                              <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <span>{b.patientAge}y · {b.patientGender}</span>
                                <span>·</span>
                                <a href={`tel:${b.patientPhone}`} className="text-emerald-700 font-semibold hover:underline">
                                  {b.patientPhone}
                                </a>
                              </div>
                              {b.reasonForVisit && (
                                <div className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                                  {b.reasonForVisit}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  b.track === 'ayush'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-teal-100 text-teal-800'
                                }`}
                              >
                                {b.track === 'ayush' ? 'AYUSH' : 'Counselling'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-[10px] font-semibold text-stone-600 capitalize bg-stone-100 px-2 py-0.5 rounded">
                                {b.bookingSource}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <select
                                value={b.status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : b.status === 'in-consultation'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : b.status === 'arrived'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-stone-50 text-stone-700 border-stone-300'
                                }`}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="arrived">Arrived at OPD</option>
                                <option value="in-consultation">In Consultation</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="text-red-500 hover:text-red-700 text-[11px] font-semibold px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Manual / Telephone Booking for Reception */}
            {activeTab === 'manual_booking' && (
              <div className="p-5 max-w-xl mx-auto w-full flex-1 overflow-y-auto">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-stone-900">
                    Register Telephone / Offline Walk-In Patient
                  </h4>
                  <p className="text-xs text-stone-500">
                    Use this tool when a patient calls <strong className="text-stone-800">{CLINIC_INFO.displayPhone}</strong> or visits the reception counter directly.
                  </p>
                </div>

                {manualSuccessMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{manualSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleManualBooking} className="space-y-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Booking Date</label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Source</label>
                      <select
                        value={mbSource}
                        onChange={(e) => setMbSource(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                      >
                        <option value="telephone">📞 Telephone Call</option>
                        <option value="walk-in">🚶 Direct Walk-in Desk</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Consultation Track</label>
                      <select
                        value={mbTrack}
                        onChange={(e) => setMbTrack(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                      >
                        <option value="ayush">🌿 AYUSH OPD (Dr. Satyajith Shenoy)</option>
                        <option value="counselling">🧠 Counselling (Dr. Ananya Varma)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">30-Min Time Slot</label>
                      <select
                        value={mbSlot}
                        onChange={(e) => setMbSlot(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                      >
                        {dailySlots
                          .filter((s) => !s.isLunch)
                          .map((s) => (
                            <option key={s.time} value={s.time}>
                              {s.time}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Madhavan K."
                      value={mbPatientName}
                      onChange={(e) => setMbPatientName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digit number"
                        value={mbPhone}
                        onChange={(e) => setMbPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Age</label>
                        <input
                          type="number"
                          placeholder="45"
                          value={mbAge}
                          onChange={(e) => setMbAge(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
                        <select
                          value={mbGender}
                          onChange={(e) => setMbGender(e.target.value as any)}
                          className="w-full text-xs px-2 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Reason / Clinical Notes</label>
                    <input
                      type="text"
                      value={mbReason}
                      onChange={(e) => setMbReason(e.target.value)}
                      placeholder="Symptoms or treatment notes..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Confirm Offline Booking & Issue Token</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: Doctor Schedule & Block Slots */}
            {activeTab === 'block_slots' && (
              <div className="p-5 flex-1 overflow-y-auto">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-stone-900">
                    Emergency Schedule Override & Slot Blocking
                  </h4>
                  <p className="text-xs text-stone-500">
                    If Dr. Satyajith Shenoy is called for an emergency or hospital visit, tap any slot below to immediately block or unblock it for <strong>{selectedDate}</strong>.
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <label className="text-xs font-semibold text-stone-600">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 font-semibold text-stone-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {dailySlots.map((slot) => {
                    if (slot.isLunch) {
                      return (
                        <div
                          key={slot.time}
                          className="py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center opacity-70"
                        >
                          🍱 {slot.time} (Lunch Break)
                        </div>
                      );
                    }

                    const isBlocked = allBlocked.some(
                      (b) => b.date === selectedDate && b.timeSlot === slot.time
                    );

                    return (
                      <button
                        key={slot.time}
                        onClick={() => handleToggleBlock(slot.time)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isBlocked
                            ? 'bg-red-50 text-red-800 border-red-300 shadow-2xs'
                            : 'bg-emerald-50/60 text-emerald-900 border-emerald-200 hover:border-red-400'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className="text-[10px] font-bold">
                          {isBlocked ? '🛑 BLOCKED' : '🟢 OPEN (Tap to Block)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
