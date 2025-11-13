'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setInstallPromptShown } from '@/redux/slices/uiSlice';
import { trackAppInstallPromptShown, trackPWAInstalled } from '@/lib/ga4';
import { Download, X, Share } from 'lucide-react';

export function InstallTooltip() {
  const { installPromptShown } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Handle beforeinstallprompt for Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      trackPWAInstalled();
    };

    // Check for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isInStandaloneMode && !installPromptShown) {
      setShowIOSInstall(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [installPromptShown]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        trackPWAInstalled();
      }
      
      setDeferredPrompt(null);
      dispatch(setInstallPromptShown(true));
    }
  };

  const handleIOSInstall = () => {
    setShowIOSInstall(false);
    dispatch(setInstallPromptShown(true));
    trackAppInstallPromptShown();
  };

  const handleDismiss = () => {
    setShowIOSInstall(false);
    dispatch(setInstallPromptShown(true));
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Android Install Prompt */}
      {deferredPrompt && !installPromptShown && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Install Missed The Game
              </h3>
              <p className="text-xs text-gray-600">
                Get quick access to football highlights on your home screen
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Tooltip */}
      {showIOSInstall && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Share className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Add to Home Screen
              </h3>
              <p className="text-xs text-gray-600">
                Tap the share button and select "Add to Home Screen"
              </p>
            </div>
            <button
              onClick={handleIOSInstall}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
