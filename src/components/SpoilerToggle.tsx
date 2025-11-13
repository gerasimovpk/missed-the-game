'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleSpoilers } from '@/redux/slices/spoilerSlice';
import { trackSpoilersToggled } from '@/lib/ga4';
import { Eye, EyeOff } from 'lucide-react';

export function SpoilerToggle() {
  const { isOn } = useSelector((state: RootState) => state.spoiler);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleSpoilers());
    trackSpoilersToggled(isOn ? 'off' : 'on');
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
      aria-label={`${isOn ? 'Disable' : 'Enable'} spoiler protection`}
    >
      {isOn ? (
        <>
          <EyeOff className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Spoilers Off</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Spoilers On</span>
        </>
      )}
    </button>
  );
}
