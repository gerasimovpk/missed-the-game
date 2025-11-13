'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setDonationAckLocal } from '@/redux/slices/uiSlice';
import { trackDonationReturnSuccess } from '@/lib/ga4';
import { Heart, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      setIsSuccess(true);
      
      // Set local donation acknowledgment
      dispatch(setDonationAckLocal(true));
      localStorage.setItem('donation_ack', JSON.stringify({ at: Date.now() }));
      
      // Track success event
      trackDonationReturnSuccess();
      
      // If user is logged in, also update Supabase
      if (user) {
        const updateSupabase = async () => {
          try {
            const { upsertUserSettings } = await import('@/lib/supabase');
            await upsertUserSettings({
              user_id: user.uid,
              donation_ack: true,
              updated_at: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Failed to update donation ack in Supabase:', error);
          }
        };
        updateSupabase();
      }
      
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
    }
  }, [searchParams, dispatch, user]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {isSuccess ? (
          <>
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Thank You!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your support means the world to us. We'll continue protecting you from spoilers!
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Donation Received
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for supporting Missed The Game! Your contribution helps us:
              </p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Keep the service free for everyone
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Improve spoiler protection features
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Add more football leagues and competitions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Maintain fast and reliable video loading
                </li>
              </ul>
              <p className="text-sm text-gray-500">
                You won't see donation prompts again on this device.
                {user && ' Your preference has been saved across all your devices.'}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Watching Highlights
              </Link>
              <p className="text-sm text-gray-500">
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                {' • '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Thanks for Visiting
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We hope you enjoy watching football highlights without spoilers!
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Watching
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
