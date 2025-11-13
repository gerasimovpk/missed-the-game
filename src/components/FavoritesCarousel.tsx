'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Star, Plus } from 'lucide-react';

export function FavoritesCarousel() {
  // Hidden for now - return null to hide the component
  return null;
  
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const { user } = useSelector((state: RootState) => state.user);

  // Don't show if no favorites
  if (favorites.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <Star className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Set Your Favorite Teams
          </h3>
          <p className="text-gray-600 mb-4">
            {user 
              ? 'Add up to 3 favorite teams to see their upcoming matches here'
              : 'Sign in to save up to 3 favorite teams and get personalized highlights'}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            {user ? 'Add Favorites' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-current" />
        Your Favorite Teams
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.slice(0, 3).map((favorite) => (
          <div 
            key={favorite.teamId}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{favorite.teamName}</h4>
                <p className="text-xs text-gray-500 mt-1">Next match: TBD</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
