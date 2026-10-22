import type { Booking } from '../types/clinic';
import { CLINIC_INFO } from '../data/clinicData';
import { CheckCircle2, Download, Share2, X, MapPin, Calendar, Clock, User, QrCode } from 'lucide-react';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Appointment Confirmed at ${CLINIC_INFO.name}!\n\n` +
      `Token: ${booking.tokenNumber}\n` +
      `Date: ${booking.date}\n` +
      `Time: ${booking.timeSlot}\n` +
      `Track: ${booking.track === 'ayush' ? 'AYUSH OPD' : 'Counselling'}\n` +
      `Patient: ${booking.patientName}\n` +
      `Address: ${CLINIC_INFO.address}, ${CLINIC_INFO.city}\n` +
      `Helpline: ${CLINIC_INFO.displayPhone}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Booking Confirmed
          </span>
          <h3 className="text-xl font-bold mt-0.5">{CLINIC_INFO.name}</h3>
          <p className="text-xs text-emerald-100/90 mt-1">Digital OPD Consultation Pass</p>
        </div>

        {/* Token Card Body */}
        <div className="p-5">
          {/* Huge Token Badge */}
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200/80 mb-4">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Your OPD Queue Token
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight my-1">
              {booking.tokenNumber}
            </div>
            <span className="text-xs font-semibold text-emerald-800">
              {booking.track === 'ayush' ? 'AYUSH OPD (Dr. Satyajith Shenoy)' : 'Counselling (Dr. Ananya Varma)'}
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs text-stone-700 mb-5">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                <User className="w-3.5 h-3.5 text-stone-400" /> Patient
              </span>
              <span className="font-bold text-stone-900">{booking.patientName} ({booking.patientAge}y, {booking.patientGender})</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> Date
              </span>
              <span className="font-bold text-stone-900">{booking.date}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Time Slot
              </span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {booking.timeSlot} (30 mins)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> Venue
              </span>
              <span className="font-semibold text-right text-stone-800">
                Police Station Rd, Payyanur
              </span>
            </div>

            {booking.photoIdName && (
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">ID Status</span>
                <span className="font-semibold text-emerald-700 truncate max-w-[200px]">
                  ✓ {booking.photoIdName}
                </span>
              </div>
            )}
          </div>

          {/* Quick QR code & Reception Note */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white rounded-lg border border-stone-300 flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-stone-700" />
            </div>
            <div className="text-[11px] text-stone-600 leading-tight">
              <strong>Reception Check-in:</strong> Present this pass or token number at the reception desk 10 minutes prior to your slot.
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
