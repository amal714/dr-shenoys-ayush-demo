import { Phone, Calendar, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeaderProps {
  onOpenAdmin: () => void;
  onScrollToBooking: () => void;
  onScrollToSchedule: () => void;
  onScrollToAbout: () => void;
  isAdmin: boolean;
}

export const Header = ({
  onOpenAdmin,
  onScrollToBooking,
  onScrollToSchedule,
  onScrollToAbout,
  isAdmin
}: HeaderProps) => {
  const isClinicOpenNow = () => {
    const now = new Date();
    const day = now.getDay();
    if (day === 0) return false; // Sunday closed
    const hours = now.getHours();
    return hours >= 9 && hours < 19;
  };

  const isOpen = isClinicOpenNow();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      {/* Tiranga Accent Stripe */}
      <div className="tiranga-stripe w-full" />

      {/* Top micro announcement bar with Saffron warmth */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-amber-200 shrink-0" />
          <span className="truncate font-medium">{CLINIC_INFO.address}, {CLINIC_INFO.city}, {CLINIC_INFO.state}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onScrollToSchedule}
            className="hidden md:flex items-center gap-1 text-amber-100 hover:text-white underline underline-offset-2 font-medium cursor-pointer"
          >
            <Clock className="w-3 h-3" />
            <span>Mon–Sat: 9 AM – 7 PM (1–2 PM Lunch)</span>
          </button>

          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'}`} />
            <span className="font-semibold text-[10px] sm:text-[11px]">
              {isOpen ? 'OPD OPEN' : 'OPD OPENS 9 AM'}
            </span>
          </div>

          <a
            href={`tel:${CLINIC_INFO.phone}`}
            className="flex items-center gap-1 font-bold text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-md transition-colors"
          >
            <Phone className="w-3 h-3 text-amber-200" />
            <span>{CLINIC_INFO.displayPhone}</span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo badge with Indian Flag harmony (Saffron + Leaf Green + Gold trim) */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md ring-2 ring-amber-400/30 shrink-0">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-lg font-black text-stone-900 tracking-tight leading-none">
                Dr Satyajith Shenoys
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                AYUSH OPD
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-800 tracking-tight mt-0.5">
              Integrated AYUSH & Parallel Psychological Counselling Clinic
            </p>
          </div>
        </div>

        {/* Action items */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onScrollToAbout}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-700 px-3 py-2 rounded-xl border border-stone-200 hover:border-amber-400 transition-colors cursor-pointer"
          >
            <span>👨‍⚕️ About Doctor</span>
          </button>

          <button
            onClick={onScrollToSchedule}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-700 px-3 py-2 rounded-xl border border-stone-200 hover:border-amber-400 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Weekly Schedule</span>
          </button>

          <button
            onClick={onScrollToBooking}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ring-2 ring-emerald-600/20"
          >
            <Calendar className="w-4 h-4 text-emerald-200" />
            <span>Book Slot</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
            }`}
            title="Reception & Doctor Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAdmin ? 'Admin' : 'Staff'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
