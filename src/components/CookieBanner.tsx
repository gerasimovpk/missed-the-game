'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCookieBannerDismissed } from '@/redux/slices/uiSlice';
import { updateConsent } from '@/lib/ga4';
import { X, Cookie } from 'lucide-react';

export function CookieBanner() {
  const { cookieBannerDismissed } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent && !cookieBannerDismissed) {
      setIsVisible(true);
    }
  }, [cookieBannerDismissed]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    updateConsent(true);
    dispatch(setCookieBannerDismissed(true));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    updateConsent(false);
    dispatch(setCookieBannerDismissed(true));
    setIsVisible(false);
  };

  const handleDismiss = () => {
    dispatch(setCookieBannerDismissed(true));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              We use cookies
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies to improve your experience, analyze site usage, and assist in our marketing efforts. 
              You can choose to accept or decline non-essential cookies.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
