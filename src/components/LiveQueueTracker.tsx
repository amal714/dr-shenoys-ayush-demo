import { useState } from 'react';
import { Search, Activity, Clock } from 'lucide-react';
import { getStoredBookings, getTodayDateString } from '../utils/storage';

export const LiveQueueTracker: React.FC = () => {
  const [tokenSearch, setTokenSearch] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const today = getTodayDateString();
  const todayBookings = getStoredBookings().filter(
    (b) => b.date === today && b.status !== 'cancelled'
  );

  // Current active consultation
  const activeAyush = todayBookings.find(
    (b) => b.track === 'ayush' && b.status === 'in-consultation'
  );
  const activeCounselling = todayBookings.find(
    (b) => b.track === 'counselling' && b.status === 'in-consultation'
  );

  // Next in line
  const nextAyush = todayBookings.find(
    (b) => b.track === 'ayush' && (b.status === 'arrived' || b.status === 'confirmed')
  );
  const nextCounselling = todayBookings.find(
    (b) => b.track === 'counselling' && (b.status === 'arrived' || b.status === 'confirmed')
  );

  const handleSearchToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenSearch.trim()) return;

    const found = todayBookings.find(
      (b) => b.tokenNumber.toLowerCase() === tokenSearch.trim().toLowerCase()
    );

    if (found) {
      setSearchResult(
        `Token ${found.tokenNumber} (${found.patientName}): Scheduled at ${found.timeSlot}. Current status: "${found.status.toUpperCase()}".`
      );
    } else {
      setSearchResult(`Token "${tokenSearch}" not found in today's OPD schedule.`);
    }
  };

  return (
    <section className="py-8 px-4 bg-emerald-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Live OPD Waiting Room Monitor</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Check current consulting tokens to estimate your turn from anywhere.
              </p>
            </div>
          </div>

          {/* Quick Token Search form */}
          <form onSubmit={handleSearchToken} className="flex gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Check your Token (e.g. AYU-101)"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-emerald-900/60 border border-emerald-700/80 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 cursor-pointer"
            >
              Check
            </button>
          </form>
        </div>

        {searchResult && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-900 border border-emerald-600/60 text-xs text-emerald-100 flex items-center gap-2 animate-in fade-in">
            <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{searchResult}</span>
          </div>
        )}

        {/* Live Token Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Chamber 1: AYUSH OPD */}
          <div className="bg-emerald-900/40 rounded-2xl p-4 border border-emerald-800">
            <div className="flex items-center justify-between mb-3 border-b border-emerald-800/80 pb-2">
              <span className="text-xs font-bold text-emerald-200">
                🌿 Chamber 1: Dr. Satyajith Shenoy (AYUSH)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Inside OPD Now
                </span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {activeAyush ? activeAyush.tokenNumber : 'None'}
                </div>
                <span className="text-[10px] text-emerald-300/70 truncate block">
                  {activeAyush ? activeAyush.patientName : 'Awaiting patient'}
                </span>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Next In Line
                </span>
                <div className="text-2xl font-black text-emerald-200 mt-0.5">
                  {nextAyush ? nextAyush.tokenNumber : '—'}
                </div>
                <span className="text-[10px] text-emerald-300/60 truncate block">
                  {nextAyush ? `${nextAyush.timeSlot}` : 'Queue clear'}
                </span>
              </div>
            </div>
          </div>

          {/* Chamber 2: Counselling */}
          <div className="bg-teal-900/40 rounded-2xl p-4 border border-teal-800">
            <div className="flex items-center justify-between mb-3 border-b border-teal-800/80 pb-2">
              <span className="text-xs font-bold text-teal-200">
                🧠 Chamber 2: Dr. Ananya Varma (Counselling)
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-teal-950/80 p-3 rounded-xl border border-teal-800/60">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Inside Session
                </span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {activeCounselling ? activeCounselling.tokenNumber : 'None'}
                </div>
                <span className="text-[10px] text-teal-300/70 truncate block">
                  {activeCounselling ? activeCounselling.patientName : 'Awaiting session'}
                </span>
              </div>

              <div className="bg-teal-950/40 p-3 rounded-xl border border-teal-800/40">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Next In Line
                </span>
                <div className="text-2xl font-black text-teal-200 mt-0.5">
                  {nextCounselling ? nextCounselling.tokenNumber : '—'}
                </div>
                <span className="text-[10px] text-teal-300/60 truncate block">
                  {nextCounselling ? `${nextCounselling.timeSlot}` : 'Queue clear'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
