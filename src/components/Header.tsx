import { Phone, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeaderProps {
  onOpenAdmin: () => void;
  onScrollToBooking: () => void;
  isAdmin: boolean;
}

export const Header = ({
  onOpenAdmin,
  onScrollToBooking,
  isAdmin
}: HeaderProps) => {
  // Check if currently open (Mon-Sat, 9 AM - 7 PM)
  const isClinicOpenNow = () => {
    const now = new Date();
    const day = now.getDay();
    if (day === 0) return false; // Sunday closed
    const hours = now.getHours();
    return hours >= 9 && hours < 19;
  };

  const isOpen = isClinicOpenNow();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Top micro banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="truncate">{CLINIC_INFO.address}, {CLINIC_INFO.city}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-block w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[11px] font-medium hidden sm:inline">
            {isOpen ? 'OPD Open (9 AM - 7 PM)' : 'OPD Closed (Opens 9 AM)'}
          </span>
          <a
            href={`tel:${CLINIC_INFO.phone}`}
            className="text-emerald-200 hover:text-white font-semibold flex items-center gap-1 ml-1"
          >
            <Phone className="w-3 h-3" />
            <span>{CLINIC_INFO.displayPhone}</span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            🌿
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
              Dr Satyajith Shenoys
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 tracking-tight">
              AYUSH OPD & Counselling Clinic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Book CTA Button */}
          <button
            onClick={onScrollToBooking}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Slot</span>
          </button>

          {/* Admin Portal Toggle */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-2 rounded-lg border transition-all ${
              isAdmin
                ? 'bg-amber-500 text-white border-amber-600'
                : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 border-stone-200'
            }`}
            title="Admin & Reception Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdmin ? 'Admin Active' : 'Staff'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
