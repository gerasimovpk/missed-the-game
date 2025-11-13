'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackLeagueSelected } from '@/lib/ga4';
import { isTopCompetition } from '@/lib/topClubs';

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
      {/* Top competitions as tabs - scrollable on mobile */}
      {topCompetitions.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {topCompetitions.map((competition) => (
            <button
              key={competition}
              onClick={() => handleCompetitionClick(competition)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                selectedCompetition === competition
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {competition}
            </button>
          ))}
          
          {/* Others dropdown */}
          {otherCompetitions.length > 0 && (
            <div className="flex-shrink-0 snap-start">
              <button
                onClick={() => setShowOthers(!showOthers)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  !topCompetitions.includes(selectedCompetition) && selectedCompetition !== ''
                    ? 'bg-blue-600 text-white shadow-md'
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
            {otherCompetitions.map((competition) => (
              <button
                key={competition}
                onClick={() => handleCompetitionClick(competition)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                  selectedCompetition === competition ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {competition}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
