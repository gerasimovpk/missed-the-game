'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Eye, EyeOff, Trophy, Calendar } from 'lucide-react';
import { Highlight } from '@/redux/services/scorebatApi';
import { maskScores } from '@/lib/scoreMask';
import { trackHighlightPlayStarted } from '@/lib/ga4';

interface VideoItemProps {
  mode: 'regular' | 'large';
  item: Highlight;
  spoilersOn: boolean;
}

export function VideoItem({ mode, item, spoilersOn }: VideoItemProps) {
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

  const isLarge = mode === 'large';
  const isTopGame = item.isTopGame;
  const isHighScore = item.isHighScore;

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col h-full ${
        isLarge ? 'w-full' : 'w-full'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className={`relative overflow-hidden rounded-lg bg-white shadow-lg flex-shrink-0 ${
        isLarge ? 'aspect-video' : 'aspect-video'
      }`}>
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

      {/* Content */}
      <div className="mt-3 flex-1 flex flex-col">
        <h3 className={`font-semibold text-gray-900 line-clamp-1 ${
          isLarge ? 'text-lg' : 'text-base'
        }`}>
          {item.homeTeam} vs {item.awayTeam}
        </h3>
        
        <div className="mt-1 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-gray-400" />
            <span className="font-medium break-words">{item.competition}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">{new Date(item.dateUTC).toLocaleDateString()}</span>
          </div>
        </div>

        {maskedDescription && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
            {maskedDescription}
          </p>
        )}

      </div>
    </div>
  );
}
