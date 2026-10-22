import { useState } from 'react';
import { AYUSH_BRANCHES } from '../data/clinicData';
import type { AyushBranchKey } from '../types/clinic';
import { Sparkles, Calendar, ChevronRight, HeartHandshake } from 'lucide-react';

interface AyushShowcaseProps {
  onSelectBranchForBooking: (branchId: AyushBranchKey) => void;
  onSelectCounselling: () => void;
}

export const AyushShowcase: React.FC<AyushShowcaseProps> = ({
  onSelectBranchForBooking,
  onSelectCounselling
}) => {
  const [activeBranch, setActiveBranch] = useState<AyushBranchKey>('heiki');

  return (
    <section id="ayush-branches" className="py-12 px-4 bg-stone-50 border-t border-stone-200">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrative Systems of Healing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            The 5 Pillars of AYUSH Care
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
            At Dr Satyajith Shenoys Clinic, each weekday is dedicated to a distinct healing tradition 
            with focused therapeutic protocols, led by Dr. Satyajith Shenoy.
          </p>
        </div>

        {/* 5 Branches Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {AYUSH_BRANCHES.map((b) => {
            const isSelected = activeBranch === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{b.icon}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${b.badgeColor}`}>
                      {b.dayName}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 tracking-tight">
                    {b.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {b.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {isSelected ? 'Viewing Details' : 'Tap to explore'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isSelected ? 'rotate-90 text-emerald-600' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Branch Detail Box */}
        {(() => {
          const current = AYUSH_BRANCHES.find((b) => b.id === activeBranch) || AYUSH_BRANCHES[4]; // Default Heiki
          return (
            <div className="mt-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
                    {current.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-stone-900">{current.name} Clinic</h4>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                        Every {current.dayName}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Consultant: Dr. Satyajith Shenoy, BAMS, MD (Ayush)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectBranchForBooking(current.id)}
                  className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book for {current.dayName} ({current.name})</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Therapeutic Philosophy & Approach
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {current.fullDesc}
                  </p>
                  {current.id === 'heiki' && (
                    <div className="mt-3 p-3 bg-fuchsia-50/70 border border-fuchsia-200/80 rounded-xl text-xs text-fuchsia-900">
                      <strong>✨ Friday Heiki Special:</strong> Our specialized Heiki clinic emphasizes bio-energetic vibrational balance and gentle natural resonance, ideal for sensitive constitutions, pediatric wellness, and stress-triggered complaints.
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Primary Focus Conditions
                  </h5>
                  <ul className="space-y-1.5">
                    {current.focusAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Parallel Counselling Banner (Mon-Sat) */}
        <div className="mt-6 bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
              <HeartHandshake className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold">Parallel Psychological Counselling OPD</h4>
                <span className="text-[11px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                  Monday to Saturday
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-1 max-w-xl">
                Conducted concurrently by our specialized Clinical Psychologist (Dr. Ananya Varma). 
                Dedicated private sessions for stress, cognitive wellness, behavioral health, and emotional resilience.
              </p>
            </div>
          </div>

          <button
            onClick={onSelectCounselling}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-teal-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Book Counselling Slot</span>
          </button>
        </div>
      </div>
    </section>
  );
};
