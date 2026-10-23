import { Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 px-4 border-t-4 border-amber-500">
      {/* Tiranga Accent Stripe */}
      <div className="tiranga-stripe w-full -mt-14 mb-10" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Clinic Identity & Address */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-700 text-white flex items-center justify-center text-lg font-black shadow-md">
              🌿
            </div>
            <div>
              <h4 className="text-base font-black text-white leading-tight">
                {CLINIC_INFO.name}
              </h4>
              <p className="text-[11px] text-amber-400 font-semibold">Payyanur, Keralam</p>
            </div>
          </div>

          <p className="text-xs text-stone-400 mb-4 leading-relaxed font-medium">
            North Malabar's dedicated center for clinical AYUSH medicine and concurrent psychological counselling. 
            Evidence-guided natural healing under the direct supervision of Dr. Satyajith Shenoy.
          </p>

          <div className="space-y-2.5 text-xs font-semibold">
            <a
              href="https://maps.google.com/?q=Police+Station+Road+Payyanur+Keralam+670307"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{CLINIC_INFO.address}, {CLINIC_INFO.city}, {CLINIC_INFO.state} – {CLINIC_INFO.pincode}</span>
            </a>

            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors font-bold text-sm"
            >
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{CLINIC_INFO.displayPhone}</span>
            </a>
          </div>
        </div>

        {/* CONSULTATION HOURS - HEAVY EMPHASIS */}
        <div className="bg-stone-800/80 p-5 rounded-3xl border border-stone-700/80">
          <h4 className="text-sm font-black text-white mb-3.5 flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="uppercase tracking-wider">Official Consultation Hours</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center border-b border-stone-700 pb-2">
              <span className="text-stone-300 font-semibold">Monday – Saturday:</span>
              <span className="font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                09:00 AM – 07:00 PM
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-stone-700 pb-2 text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-900/60">
              <span className="font-bold">Daily Lunch Recess:</span>
              <span className="font-black">01:00 PM – 02:00 PM</span>
            </div>

            <div className="flex justify-between items-center border-b border-stone-700 pb-2 text-red-400">
              <span className="font-semibold">Sundays:</span>
              <span className="font-bold bg-red-950/40 border border-red-900/60 px-2 py-0.5 rounded">
                Weekly Recess (Closed)
              </span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-stone-900/80 border border-stone-700 text-[11px] text-stone-300 leading-tight">
            ⏱️ <strong>Slot Policy:</strong> Each patient receives an exclusive 30-minute consultation window. Prior online or telephone booking is advised.
          </div>
        </div>

        {/* WEEKLY AYUSH ROTATION - HEAVY EMPHASIS */}
        <div className="bg-stone-800/80 p-5 rounded-3xl border border-stone-700/80">
          <h4 className="text-sm font-black text-white mb-3.5 flex items-center gap-2 text-emerald-400">
            <Calendar className="w-4 h-4" />
            <span className="uppercase tracking-wider">Weekly AYUSH Rotation</span>
          </h4>

          <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold">
            <div className="flex justify-between py-1 border-b border-stone-700/60">
              <span className="text-stone-300">Monday</span>
              <span className="text-emerald-400 font-bold">Ayurveda Clinic</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-700/60">
              <span className="text-stone-300">Tuesday</span>
              <span className="text-sky-400 font-bold">Yoga & Naturopathy</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-700/60">
              <span className="text-stone-300">Wednesday</span>
              <span className="text-amber-400 font-bold">Unani Medicine</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-700/60">
              <span className="text-stone-300">Thursday</span>
              <span className="text-purple-400 font-bold">Siddha & Varmam</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-700/60 bg-orange-950/40 p-1 rounded border border-orange-900/60">
              <span className="text-amber-200 font-bold">Friday</span>
              <span className="text-orange-400 font-black">✨ Reiki Resonance Clinic</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-700/60">
              <span className="text-stone-300">Mon – Sat (Daily)</span>
              <span className="text-teal-300 font-bold">Parallel Counselling</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3 font-medium">
        <p>© {new Date().getFullYear()} {CLINIC_INFO.name}. Payyanur, Keralam 670307.</p>
        <p className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">Helpline: {CLINIC_INFO.displayPhone}</span>
          <span>·</span>
          <span>Police Station Road, Payyanur</span>
        </p>
      </div>
    </footer>
  );
};
