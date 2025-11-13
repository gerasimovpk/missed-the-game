'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Heart, Coffee, Trophy, Calendar } from 'lucide-react';
import { trackDonationClicked } from '@/lib/ga4';

export function DonationCard() {
  const { user, settings } = useSelector((state: RootState) => state.user);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  useEffect(() => {
    // Check if donation is acknowledged locally
    const localAck = localStorage.getItem('donation_ack');
    if (localAck) {
      try {
        const { at } = JSON.parse(localAck);
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - at < oneYear) {
          setIsAcknowledged(true);
          return;
        }
      } catch (error) {
        // Invalid data, clear it
        localStorage.removeItem('donation_ack');
      }
    }

    // Check if user has acknowledged via Supabase
    if (user && settings?.donationAck) {
      setIsAcknowledged(true);
    }
  }, [user, settings]);

  const handleDonateClick = () => {
    trackDonationClicked('bmac');
    
    const bmacProfile = process.env.NEXT_PUBLIC_BMAC_PROFILE || 'gerasimovpb';
    const returnUrl = process.env.NEXT_PUBLIC_DONATION_RETURN_URL || window.location.origin + '/thanks';
    
    // Open Buy Me a Coffee in new tab
    window.open(
      `https://www.buymeacoffee.com/${bmacProfile}?returnUrl=${encodeURIComponent(returnUrl)}?status=success`,
      '_blank'
    );
  };


  const handleCardClick = () => {
    handleDonateClick();
  };

  // Don't show if acknowledged or dismissed
  if (isAcknowledged || isDismissed) {
    return null;
  }

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Top area - rounded from all 4 corners like video items */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 aspect-video flex items-end justify-center pb-8">
        {/* Coffee icon in background */}
        <div className="absolute top-4 right-4 opacity-20">
          <Coffee className="w-16 h-16 text-yellow-500" />
        </div>
        
        {/* Title positioned lower */}
        <div className="text-center relative z-10">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 justify-center">
            Please support the project!
          </h3>
          
          <p className="text-sm text-gray-700 mb-3 px-4">
            It can help cover the costs I pay for the data providers and infrastructure!
          </p>
          
          {/* Button moved to top area */}
          <button
            onClick={(e) => { e.stopPropagation(); handleDonateClick(); }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm mx-auto cursor-pointer"
          >
            <Coffee className="w-4 h-4" />
            Buy Me a Coffee
          </button>
        </div>
      </div>

      {/* Lower area - no background, similar to video items - hidden on mobile */}
      <div className="hidden sm:block mt-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 line-clamp-1 text-base mb-1">
          Spoiler-Free Football
        </h3>
        
        <div className="mt-1 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-gray-400" />
            <span className="font-medium">All major competitions</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">Every day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
