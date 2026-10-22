import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AyushShowcase } from './components/AyushShowcase';
import { BookingSection } from './components/BookingSection';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { AdminPortal } from './components/AdminPortal';
import { LiveQueueTracker } from './components/LiveQueueTracker';
import { Footer } from './components/Footer';
import type { AyushBranchKey, Booking, ConsultationTrack } from './types/clinic';
import { isAdminLoggedIn } from './utils/storage';
import { Phone, Calendar, ShieldCheck } from 'lucide-react';
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

  const scrollToAyush = () => {
    const el = document.getElementById('ayush-branches');
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

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-900 pb-16 sm:pb-0">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onScrollToBooking={scrollToBooking}
        isAdmin={isAdmin}
      />

      {/* Hero Overview */}
      <Hero
        onScrollToBooking={scrollToBooking}
        onScrollToAyush={scrollToAyush}
      />

      {/* Live Queue Waiting Room Tracker */}
      <LiveQueueTracker />

      {/* Primary Highlight: 30-Min OPD Booking Section */}
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

      {/* Educational & Attracting AYUSH Branches Showcase */}
      <AyushShowcase
        onSelectBranchForBooking={handleSelectBranchForBooking}
        onSelectCounselling={handleSelectCounselling}
      />

      {/* Footer */}
      <Footer />

      {/* Booking Confirmation Pass Modal */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

      {/* Secure Admin & Reception Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onDataChanged={handleDataChanged}
      />

      {/* Mobile Sticky Bottom Bar (Primary focus: Mobile browser priority) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-between gap-2 shadow-lg">
        <a
          href={`tel:${CLINIC_INFO.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-200 transition-colors"
        >
          <Phone className="w-4 h-4 text-emerald-700" />
          <span>Call OPD</span>
        </a>

        <button
          onClick={scrollToBooking}
          className="flex-2 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book 30-Min Slot</span>
        </button>

        <button
          onClick={() => setIsAdminPortalOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 border border-stone-200 text-stone-700"
          title="Staff Portal"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default App;
