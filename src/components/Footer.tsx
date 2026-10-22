import { Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 px-4 border-t border-stone-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Clinic Identity & Address */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-base font-bold">
              🌿
            </div>
            <h4 className="text-base font-bold text-white leading-tight">
              {CLINIC_INFO.name}
            </h4>
          </div>
          <p className="text-xs text-stone-400 mb-4 leading-relaxed">
            Pioneering patient-centric integrative healthcare in North Malabar. Daily rotation of verified AYUSH healing disciplines and professional psychological counselling.
          </p>

          <div className="space-y-2 text-xs">
            <a
              href="https://maps.google.com/?q=Police+Station+Road+Payyanur+Keralam+670307"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{CLINIC_INFO.address}, {CLINIC_INFO.city}, {CLINIC_INFO.state} – {CLINIC_INFO.pincode}</span>
            </a>

            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors font-semibold"
            >
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{CLINIC_INFO.displayPhone}</span>
            </a>
          </div>
        </div>

        {/* Timings & Break Details */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Consultation Hours</span>
          </h4>

          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex justify-between border-b border-stone-800 pb-1.5">
              <span>Monday – Saturday</span>
              <span className="font-semibold text-stone-200">09:00 AM – 07:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-1.5 text-amber-400">
              <span>Daily Lunch & Sanitization</span>
              <span className="font-semibold">01:00 PM – 02:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-1.5 text-red-400">
              <span>Sundays</span>
              <span className="font-semibold">Closed for Disinfection</span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-300">
            ⚠️ <strong>Emergency Notice:</strong> In case of acute trauma or life-threatening emergencies, please visit Payyanur Taluk Hospital or dial 108.
          </div>
        </div>

        {/* AYUSH Daily Rotation Matrix */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Weekly AYUSH Rotation</span>
          </h4>

          <div className="grid grid-cols-1 gap-1.5 text-xs text-stone-400">
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Monday</span>
              <span className="font-semibold text-emerald-400">Ayurveda Clinic</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Tuesday</span>
              <span className="font-semibold text-sky-400">Yoga & Naturopathy</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Wednesday</span>
              <span className="font-semibold text-amber-400">Unani Medicine</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Thursday</span>
              <span className="font-semibold text-purple-400">Siddha Care & Varmam</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Friday</span>
              <span className="font-semibold text-fuchsia-400">Heiki Resonance Clinic</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-300">Mon – Sat (Daily)</span>
              <span className="font-semibold text-teal-400">Parallel Counselling</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
        <p>© {new Date().getFullYear()} {CLINIC_INFO.name}. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          <span>Official Digital OPD Reservation System</span>
          <span>·</span>
          <span>Payyanur, Keralam 670307</span>
        </p>
      </div>
    </footer>
  );
};
