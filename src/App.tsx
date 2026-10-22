import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutDoctor } from './components/AboutDoctor';
import { AyushShowcase } from './components/AyushShowcase';
import { BookingSection } from './components/BookingSection';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import type { AyushBranchKey, Booking, ConsultationTrack } from './types/clinic';
import { isAdminLoggedIn } from './utils/storage';
import { Phone, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { CLINIC_INFO } from './data/clinicData';

export function App() {
  const [selectedTrack, setSelectedTrack] = useState<ConsultationTrack>('ayush');
  const [selectedBranch, setSelectedBranch] = useState<AyushBranchKey | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());
  const [, setRefreshTick] = useState(0);

  const handleDataChanged = () => {
    setRefreshTick((prev) => prev + 1);
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSchedule = () => {
    const el = document.getElementById('ayush-schedule');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about-doctor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBranchForBooking = (branchId: AyushBranchKey) => {
    setSelectedTrack('ayush');
    setSelectedBranch(branchId);
    scrollToBooking();
  };

  const handleSelectCounselling = () => {
    setSelectedTrack('counselling');
    scrollToBooking();
  };

  const handleBookAyushFromDoctor = () => {
    setSelectedTrack('ayush');
    scrollToBooking();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-amber-900 pb-16 sm:pb-0">
      {/* Navigation Header with Tiranga styling */}
      <Header
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onScrollToBooking={scrollToBooking}
        onScrollToSchedule={scrollToSchedule}
        onScrollToAbout={scrollToAbout}
        isAdmin={isAdmin}
      />

      {/* Hero with High-Emphasis Hours & Weekly AYUSH Schedule Showcase */}
      <Hero
        onScrollToBooking={scrollToBooking}
        onScrollToSchedule={scrollToSchedule}
      />

      {/* NEW: About Chief Physician Dr. Satyajith Shenoy & Leadership */}
      <AboutDoctor
        onBookAyush={handleBookAyushFromDoctor}
        onBookCounselling={handleSelectCounselling}
      />

      {/* Primary Highlight: 30-Min OPD Slot Booking Section */}
      <BookingSection
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        onBookingSuccess={(b) => {
          setConfirmedBooking(b);
          handleDataChanged();
        }}
      />

      {/* Deep-Dive AYUSH Weekly Disciplines & Counselling Showcase */}
      <AyushShowcase
        onSelectBranchForBooking={handleSelectBranchForBooking}
        onSelectCounselling={handleSelectCounselling}
      />

      {/* Comprehensive Footer with Detailed Timings & Schedule */}
      <Footer />

      {/* Booking Confirmation Pass Modal */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

      {/* Secure Admin & Reception Desk Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onDataChanged={handleDataChanged}
      />

      {/* Mobile Sticky Bottom Bar (Saffron / Gold + White + Green) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-between gap-2 shadow-lg">
        <a
          href={`tel:${CLINIC_INFO.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-700" />
          <span>Call OPD</span>
        </a>

        <button
          onClick={scrollToSchedule}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Schedule</span>
        </button>

        <button
          onClick={scrollToBooking}
          className="flex-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white font-black text-xs shadow-md transition-all cursor-pointer ring-1 ring-emerald-600"
        >
          <Calendar className="w-4 h-4 text-emerald-200" />
          <span>Book Slot</span>
        </button>

        <button
          onClick={() => setIsAdminPortalOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 border border-stone-200 text-stone-700 shrink-0"
          title="Staff Portal"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default App;
