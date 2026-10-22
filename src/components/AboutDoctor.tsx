import { DOCTOR_PROFILES } from '../data/clinicData';
import { Award, CheckCircle2, HeartHandshake, Sparkles, Calendar, Stethoscope, Quote, GraduationCap } from 'lucide-react';

interface AboutDoctorProps {
  onBookAyush: () => void;
  onBookCounselling: () => void;
}

export const AboutDoctor = ({ onBookAyush, onBookCounselling }: AboutDoctorProps) => {
  const { chiefPhysician, counsellor } = DOCTOR_PROFILES;

  return (
    <section id="about-doctor" className="py-16 px-4 bg-gradient-to-b from-white via-amber-50/25 to-stone-50 border-t border-stone-200">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-950 text-xs font-black mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>CLINICAL EXCELLENCE & LEADERSHIP</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Meet Chief Physician Dr. Satyajith Shenoy
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Bridging authentic classical AYUSH diagnostics with compassionate modern care in Payyanur, Keralam.
          </p>
        </div>

        {/* =========================================================================
            FEATURED CARD: DR. SATYAJITH SHENOY (CHIEF AYUSH PHYSICIAN)
           ========================================================================= */}
        <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-xl overflow-hidden mb-8 ring-1 ring-amber-400/20">
          {/* Top Tricolor Accent Line */}
          <div className="tiranga-stripe w-full" />

          <div className="p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 Cols: Physician Portrait & Quick Accolades */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {/* Avatar Icon Container with Saffron & Gold Radial Halo */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-700 p-1 shadow-lg">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
                    {chiefPhysician.avatarIcon}
                  </div>
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-white p-2 rounded-2xl shadow-md border-2 border-white">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {chiefPhysician.name}
              </h3>
              <p className="text-xs font-extrabold text-amber-800 mt-0.5">
                {chiefPhysician.qualification}
              </p>
              <p className="text-[11px] text-stone-500 font-semibold mt-1">
                {chiefPhysician.role}
              </p>

              {/* Registration & Credentials pill */}
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-700">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>{chiefPhysician.registrationNumber}</span>
              </div>

              {/* Quick Clinical Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs">
                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                  <span className="block text-base font-black text-amber-900">{chiefPhysician.experienceYears}</span>
                  <span className="block text-[10px] font-bold text-stone-600">Clinical Practice</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="block text-base font-black text-emerald-900">12,000+</span>
                  <span className="block text-[10px] font-bold text-stone-600">Consultations</span>
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Physician Bio, Ethos Quote, Specialties & CTA */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>About the Physician & Clinical Ethos</span>
                </span>

                <p className="mt-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {chiefPhysician.bio}
                </p>

                {/* Doctor's Quote Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-emerald-50/30 border-l-4 border-amber-500 text-xs sm:text-sm text-stone-800 italic relative">
                  <Quote className="w-5 h-5 text-amber-400 absolute top-2 right-2 opacity-50" />
                  "{chiefPhysician.quote}"
                  <span className="block not-italic text-[10px] font-black text-amber-900 mt-1 uppercase tracking-wider">
                    — {chiefPhysician.name}
                  </span>
                </div>

                {/* Key Clinical Expertise */}
                <div className="mt-5">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2.5">
                    Areas of Clinical Mastery
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {chiefPhysician.specialties.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA button to schedule */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-stone-500 font-medium">
                  Available for 30-min consultations: <strong>Monday to Saturday (9 AM – 7 PM)</strong>
                </div>
                <button
                  onClick={onBookAyush}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer active:scale-98 ring-2 ring-emerald-600/20"
                >
                  <Calendar className="w-4 h-4 text-emerald-200" />
                  <span>Schedule with Dr. Shenoy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECONDARY CARD: DR. ANANYA VARMA (PARALLEL CLINICAL PSYCHOLOGY LEAD)
           ========================================================================= */}
        <div className="bg-gradient-to-r from-stone-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-teal-800/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Col: Avatar & Info */}
            <div className="md:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {counsellor.avatarIcon}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{counsellor.name}</h4>
                  <p className="text-xs font-bold text-amber-300">{counsellor.qualification}</p>
                  <span className="inline-block text-[10px] font-semibold text-teal-200">
                    {counsellor.role} · {counsellor.experienceYears}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
                Parallel Mon–Sat Counselling Chamber
              </span>
            </div>

            {/* Middle Col: Description */}
            <div className="md:col-span-5 text-xs text-stone-300 leading-relaxed font-medium">
              <p>{counsellor.bio}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {counsellor.specialties.slice(0, 3).map((s, idx) => (
                  <span key={idx} className="bg-white/10 text-stone-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: CTA */}
            <div className="md:col-span-3 flex justify-center md:justify-end">
              <button
                onClick={onBookCounselling}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer active:scale-98"
              >
                <HeartHandshake className="w-4 h-4 text-amber-950" />
                <span>Book Counselling</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
