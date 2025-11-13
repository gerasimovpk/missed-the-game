'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, EyeOff, Calendar, Trophy } from 'lucide-react';
import { Highlight } from '@/redux/services/scorebatApi';
import { maskScores } from '@/lib/scoreMask';
import { trackHighlightPlayStarted } from '@/lib/ga4';
import { FavoritesCarousel } from './FavoritesCarousel';

interface FeaturedVideoProps {
  item: Highlight;
  spoilersOn: boolean;
}

export function FeaturedVideo({ item, spoilersOn }: FeaturedVideoProps) {
  // Hidden for now - return null to hide the component
  return null;
  
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    // Track event
    trackHighlightPlayStarted(
      item.id,
      item.competition,
      item.homeTeam,
      item.awayTeam,
      spoilersOn,
      'home_page'
    );

    // Navigate to video page
    router.push(`/game/${item.id}`);
  };

  const maskedTitle = spoilersOn ? maskScores(item.title) : item.title;
  const maskedDescription = spoilersOn && item.description ? maskScores(item.description) : item.description;

  const isTopGame = item.isTopGame;
  const isHighScore = item.isHighScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Video - takes 2/3 of the width */}
      <div className="lg:col-span-2">
        <div
          className="group cursor-pointer transition-all duration-300 flex flex-col h-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
        >
          <div className="relative overflow-hidden rounded-lg bg-white shadow-lg aspect-video">
            {/* Thumbnail */}
            <div className="relative w-full h-full">
              <img
                src={item.thumbnailUrl}
                alt={maskedTitle}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  spoilersOn ? 'blur-md' : 'blur-0'
                }`}
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-4">
                  <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
                </div>
              </div>

              {/* Spoiler protection indicator */}
              {spoilersOn && (
                <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  <span>Protected</span>
                </div>
              )}

              {/* Chips */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {isTopGame && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Top Game
                  </span>
                )}
                {isHighScore && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    High Score
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Video Details + Favorites - takes 1/3 of the width */}
        <div className="lg:col-span-1 flex flex-col h-full">
          {/* Visual connector line */}
          <div className="hidden lg:block absolute left-0 top-8 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-transparent -ml-3"></div>
          
          {/* Video Details - positioned at top */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {item.homeTeam} vs {item.awayTeam}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{item.competition}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">{new Date(item.dateUTC).toLocaleDateString()}</span>
              </div>
            </div>

            {maskedDescription && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {maskedDescription}
              </p>
            )}
          </div>

          {/* Favorites Carousel - positioned at bottom */}
          <div className="mt-auto">
            <FavoritesCarousel />
          </div>
        </div>
    </div>
  );
}
