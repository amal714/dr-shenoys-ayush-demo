import { Calendar, Phone, MapPin, Clock, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeroProps {
  onScrollToBooking: () => void;
  onScrollToSchedule: () => void;
}

export const Hero = ({ onScrollToBooking, onScrollToSchedule }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-emerald-50/30 pt-6 sm:pt-10 pb-12 px-4 border-b border-stone-200/60">
      {/* Decorative Tiranga aura gradients */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/15 to-teal-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top National Health Heritage pill */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200/80 text-amber-900 text-xs font-bold shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="tracking-wide">MINISTRY OF AYUSH RECOGNIZED SYSTEMS · PAYYANUR</span>
          </div>
        </div>

        {/* Hero Main Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
            <span className="text-stone-900">Dr Satyajith Shenoys</span> <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 bg-clip-text text-transparent">
              Ayush OPD Clinic
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed">
            World-class integrative healing guided by ancient wisdom and clinical diagnosis. 
            Featuring the 5 pillars of AYUSH with a special weekly rotation and concurrent 
            psychological counselling.
          </p>

          {/* Primary Quick CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={onScrollToBooking}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg active:scale-98 transition-all text-sm sm:text-base cursor-pointer ring-2 ring-emerald-600/30"
            >
              <Calendar className="w-5 h-5 text-emerald-200" />
              <span>Book 30-Min OPD Slot</span>
            </button>

            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-amber-50/50 border border-amber-300/80 text-amber-950 font-bold py-3.5 px-6 rounded-2xl shadow-xs active:scale-98 transition-all text-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call: {CLINIC_INFO.displayPhone}</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            HIGH-EMPHASIS MODULE: CONSULTATION HOURS & WEEKLY ROTATION AT A GLANCE
           ========================================================================= */}
        <div className="mt-10 bg-white rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden">
          {/* Header of the Schedule Card */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 px-5 py-3 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-200" />
              <span className="font-extrabold text-sm sm:text-base tracking-wide">
                OPD TIMINGS & WEEKLY ROTATION MATRIX
              </span>
            </div>
            <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
              Monday to Saturday · 9:00 AM – 7:00 PM
            </span>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 4 cols: Exact Timings & Lunch Break Notice */}
            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Daily Consultation Hours
                </span>
                
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-semibold text-stone-700">Morning Session:</span>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      09:00 AM – 01:00 PM
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-stone-200 bg-amber-100/60 p-2 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <span>🍱 Lunch & Sanitization:</span>
                    </div>
                    <span className="text-xs font-black text-amber-900">
                      01:00 PM – 02:00 PM
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-semibold text-stone-700">Evening Session:</span>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      02:00 PM – 07:00 PM
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-stone-500">Sundays:</span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Closed (Weekly Recess)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict 30-minute individual time slots to eliminate waiting.</span>
              </div>
            </div>

            {/* Right 7 cols: Interactive Weekly AYUSH Days Rotation Grid */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Weekly Specialty Schedule (Mon–Fri AYUSH + Mon–Sat Counselling)
                </span>
                <button
                  onClick={onScrollToSchedule}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  View Details →
                </button>
              </div>

              {/* Day-by-Day Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Monday: Ayurveda */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900">Monday</span>
                    <span className="text-base">🌿</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-1">Ayurveda</div>
                  <div className="text-[10px] text-stone-500">Panchakarma & Vata/Pitta/Kapha</div>
                </div>

                {/* Tuesday: Yoga */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-900">Tuesday</span>
                    <span className="text-base">🧘</span>
                  </div>
                  <div className="text-xs font-bold text-sky-800 mt-1">Yoga & Naturopathy</div>
                  <div className="text-[10px] text-stone-500">Breathwork & Drugless Vitality</div>
                </div>

                {/* Wednesday: Unani */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-900">Wednesday</span>
                    <span className="text-base">🧪</span>
                  </div>
                  <div className="text-xs font-bold text-amber-800 mt-1">Unani Medicine</div>
                  <div className="text-[10px] text-stone-500">Humoral Balance & Regimens</div>
                </div>

                {/* Thursday: Siddha */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-purple-900">Thursday</span>
                    <span className="text-base">🏺</span>
                  </div>
                  <div className="text-xs font-bold text-purple-800 mt-1">Siddha Care</div>
                  <div className="text-[10px] text-stone-500">Kayakalpa & Varmam Healing</div>
                </div>

                {/* Friday: Reiki (Special highlight) */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-fuchsia-50 via-orange-50 to-amber-50 border-2 border-orange-400 shadow-xs ring-1 ring-orange-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-orange-950">Friday</span>
                    <span className="text-base">✨</span>
                  </div>
                  <div className="text-xs font-black text-orange-700 mt-1">Reiki Clinic</div>
                  <div className="text-[10px] text-orange-900 font-semibold">Universal Energy & Chakra Care</div>
                </div>

                {/* Saturday: Review OPD */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-stone-50 to-white border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-800">Saturday</span>
                    <span className="text-base">📋</span>
                  </div>
                  <div className="text-xs font-bold text-stone-700 mt-1">Review OPD</div>
                  <div className="text-[10px] text-stone-500">Integrated Follow-ups</div>
                </div>
              </div>

              {/* Parallel Counselling Banner */}
              <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong>Mon–Sat Parallel Track:</strong> Psychological Counselling by Dr. Ananya Varma
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md shrink-0">
                  Available Every Day
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-xl font-black text-amber-600">100%</div>
            <div className="text-xs font-bold text-stone-800">AYUSH Certified</div>
            <div className="text-[10px] text-stone-500">Authentic Pharmacopeia</div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-xl font-black text-emerald-700">30 Mins</div>
            <div className="text-xs font-bold text-stone-800">Dedicated Slot</div>
            <div className="text-[10px] text-stone-500">Zero Rush Consultation</div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-xl font-black text-amber-600">Dual Track</div>
            <div className="text-xs font-bold text-stone-800">Medical & Mental</div>
            <div className="text-[10px] text-stone-500">Holistic Equilibrium</div>
          </div>

          <a
            href="https://maps.google.com/?q=Police+Station+Road+Payyanur+Keralam+670307"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors block text-left"
          >
            <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Payyanur Central</span>
            </div>
            <div className="text-xs font-extrabold text-stone-800 mt-0.5">Police Station Rd</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Open in Maps ↗</div>
          </a>
        </div>
      </div>
    </section>
  );
};
