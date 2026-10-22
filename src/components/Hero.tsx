import { Calendar, Phone, MapPin, Clock, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeroProps {
  onScrollToBooking: () => void;
  onScrollToAyush: () => void;
}

export const Hero = ({ onScrollToBooking, onScrollToAyush }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white pt-6 pb-10 px-4">
      {/* Decorative background radial pattern */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Payyanur's Premier Integrated Healthcare Destination</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Dr Satyajith Shenoys <br className="hidden sm:inline" />
          <span className="text-emerald-700 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
            Ayush OPD & Counselling Clinic
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Experience evidence-guided holistic healing. Combining daily rotating AYUSH specialties 
          (Ayurveda, Yoga, Unani, Siddha, and Heiki) with parallel psychological counselling.
        </p>

        {/* Primary Action Buttons - Mobile First */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onScrollToBooking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all text-sm sm:text-base cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Book 30-Min OPD Slot</span>
          </button>

          <a
            href={`tel:${CLINIC_INFO.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold py-3.5 px-6 rounded-xl shadow-xs active:scale-98 transition-all text-sm"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Call {CLINIC_INFO.displayPhone}</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left">
          <div className="bg-white/90 p-3 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <Clock className="w-4 h-4" />
              <span>9:00 AM – 7:00 PM</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Mon–Sat (1–2 PM Lunch)</p>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AYUSH Rotation</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Mon: Ayu to Fri: Heiki</p>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>Counselling OPD</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Parallel Daily Doctor</p>
          </div>

          <a
            href="https://maps.google.com/?q=Police+Station+Road+Payyanur+Keralam"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 p-3 rounded-xl border border-stone-200 shadow-2xs hover:border-emerald-300 transition-colors block"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <MapPin className="w-4 h-4" />
              <span>Payyanur Central</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Police Station Road ↗</p>
          </a>
        </div>

        {/* Branch quick pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-stone-500 font-medium">AYUSH Branches:</span>
          {['Ayurveda (Mon)', 'Yoga (Tue)', 'Unani (Wed)', 'Siddha (Thu)', 'Heiki (Fri)'].map((b) => (
            <button
              key={b}
              onClick={onScrollToAyush}
              className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
