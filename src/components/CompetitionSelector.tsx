'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { trackLeagueSelected } from '@/lib/ga4';
import { isTopCompetition } from '@/lib/topClubs';
import { getLeagueLogo, getLeagueShortName } from '@/lib/leagueLogos';

interface CompetitionSelectorProps {
  competitions: string[];
  selectedCompetition: string;
  onCompetitionChange: (competition: string) => void;
}

export function CompetitionSelector({
  competitions,
  selectedCompetition,
  onCompetitionChange,
}: CompetitionSelectorProps) {
  const [showOthers, setShowOthers] = useState(false);

  // Separate top competitions from others
  const topCompetitions = competitions.filter(comp => isTopCompetition(comp));
  const otherCompetitions = competitions.filter(comp => !isTopCompetition(comp));

  const handleCompetitionClick = (competition: string) => {
    onCompetitionChange(competition);
    trackLeagueSelected(competition);
    setShowOthers(false);
  };

  return (
    <div className="mb-6">
      {/* Top competitions as horizontal tabs - scrollable on mobile */}
      {topCompetitions.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {topCompetitions.map((competition) => {
            const logoUrl = getLeagueLogo(competition);
            const shortName = getLeagueShortName(competition);
            const isSelected = selectedCompetition === competition;
            
            return (
              <button
                key={competition}
                onClick={() => handleCompetitionClick(competition)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 snap-start flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={competition}
              >
                {logoUrl ? (
                  <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0 bg-white rounded-full p-0.5">
                    <Image
                      src={logoUrl}
                      alt={shortName}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : null}
                <span>{shortName}</span>
              </button>
            );
          })}
          
          {/* Others dropdown */}
          {otherCompetitions.length > 0 && (
            <div className="flex-shrink-0 snap-start">
              <button
                onClick={() => setShowOthers(!showOthers)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  !topCompetitions.includes(selectedCompetition) && selectedCompetition !== ''
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Others
                <ChevronDown className={`w-4 h-4 transition-transform ${showOthers ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Dropdown menu - positioned outside scroll container */}
      {showOthers && otherCompetitions.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[250px] max-h-[300px] overflow-y-auto">
            {otherCompetitions.map((competition) => {
              const logoUrl = getLeagueLogo(competition);
              const shortName = getLeagueShortName(competition);
              const isSelected = selectedCompetition === competition;
              
              return (
                <button
                  key={competition}
                  onClick={() => handleCompetitionClick(competition)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                    isSelected ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-700'
                  }`}
                >
                  {logoUrl && (
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image
                        src={logoUrl}
                        alt={shortName}
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <span>{shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
