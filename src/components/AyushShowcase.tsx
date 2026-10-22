import { useState } from 'react';
import { AYUSH_BRANCHES } from '../data/clinicData';
import type { AyushBranchKey } from '../types/clinic';
import { Calendar, ChevronRight, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

interface AyushShowcaseProps {
  onSelectBranchForBooking: (branchId: AyushBranchKey) => void;
  onSelectCounselling: () => void;
}

export const AyushShowcase = ({
  onSelectBranchForBooking,
  onSelectCounselling
}: AyushShowcaseProps) => {
  const [activeBranch, setActiveBranch] = useState<AyushBranchKey>('heiki');

  return (
    <section id="ayush-schedule" className="py-14 px-4 bg-gradient-to-b from-stone-50 via-white to-stone-100 border-t border-stone-200">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>AUTHENTIC INDIAN MEDICAL HERITAGE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Weekly AYUSH Rotation & Disciplines
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            Each weekday at Dr Satyajith Shenoys Clinic offers dedicated therapeutic mastery, 
            providing focused care through India's time-tested medical traditions.
          </p>
        </div>

        {/* 5 Cards Horizontal Grid with Saffron / Gold & Forest Green styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {AYUSH_BRANCHES.map((b) => {
            const isSelected = activeBranch === b.id;
            const isHeiki = b.id === 'heiki';

            return (
              <div
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? isHeiki
                      ? 'bg-gradient-to-b from-orange-50/90 to-white border-orange-500 shadow-md ring-2 ring-orange-400/30'
                      : 'bg-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-stone-200 hover:border-amber-400 hover:shadow-xs'
                }`}
              >
                {isHeiki && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-bl-lg">
                    Specialist Day
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{b.icon}</span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${b.badgeColor}`}>
                      {b.dayName}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-stone-900 tracking-tight">
                    {b.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1 leading-snug">
                    {b.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800">
                    {isSelected ? 'Viewing Plan' : 'Explore →'}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isSelected ? 'rotate-90 text-amber-700' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Branch In-Depth Details Box */}
        {(() => {
          const current = AYUSH_BRANCHES.find((b) => b.id === activeBranch) || AYUSH_BRANCHES[4];
          const isHeiki = current.id === 'heiki';

          return (
            <div className={`mt-6 rounded-3xl border-2 p-5 sm:p-7 shadow-md transition-all ${
              isHeiki
                ? 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 border-orange-300'
                : 'bg-white border-emerald-200/80'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {current.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-stone-900">{current.name} Consultation</h4>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                        Every {current.dayName}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-semibold mt-0.5">
                      Chief Consultant: Dr. Satyajith Shenoy, BAMS, MD (Ayush) · Payyanur
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectBranchForBooking(current.id)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-all shrink-0 cursor-pointer ring-2 ring-emerald-600/20"
                >
                  <Calendar className="w-4 h-4 text-emerald-200" />
                  <span>Book for {current.dayName} ({current.name})</span>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Therapeutic Philosophy & Care Strategy</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {current.fullDesc}
                  </p>

                  {isHeiki && (
                    <div className="mt-4 p-4 bg-orange-100/70 border-2 border-orange-300 rounded-2xl text-xs text-orange-950 font-medium">
                      <div className="font-black text-orange-900 text-sm mb-1 flex items-center gap-1.5">
                        <span>✨ Friday Dedicated Heiki Care:</span>
                      </div>
                      Heiki works through bio-resonance and energetic re-harmonization without invasive interventions. Specially recommended for pediatric care, recurring respiratory allergies, psychosomatic tension, and lifestyle fatigue.
                    </div>
                  )}
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <h5 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-2.5">
                    Primary Treated Conditions
                  </h5>
                  <ul className="space-y-2">
                    {current.focusAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Parallel Psychological Counselling Showcase (Available Mon to Sat) */}
        <div className="mt-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
              <HeartHandshake className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg sm:text-xl font-black">
                  Parallel Psychological Counselling Chamber
                </h4>
                <span className="text-[11px] font-extrabold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
                  Monday to Saturday · 9 AM to 7 PM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl font-medium leading-relaxed">
                Conducted concurrently by our Clinical Psychologist (Dr. Ananya Varma, M.Sc, M.Phil). 
                Offering private, empathetic consultation for stress disorders, insomnia, grief, work burnout, and cognitive harmony.
              </p>
            </div>
          </div>

          <button
            onClick={onSelectCounselling}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer active:scale-98"
          >
            <Calendar className="w-4 h-4 text-amber-950" />
            <span>Book Counselling Slot</span>
          </button>
        </div>
      </div>
    </section>
  );
};
