'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { VideoItem } from '@/components/VideoItem';
import { FeaturedVideo } from '@/components/FeaturedVideo';
import { SpoilerToggle } from '@/components/SpoilerToggle';
import { CookieBanner } from '@/components/CookieBanner';
import { InstallTooltip } from '@/components/InstallTooltip';
import { DonationCard } from '@/components/DonationCard';
import { CompetitionSelector } from '@/components/CompetitionSelector';
import { selectFeatured, selectTop5, enrichHighlights, sortHighlightsByWeight } from '@/lib/ranking';
import { isTopCompetition } from '@/lib/topClubs';
import { useGetAggregatedHighlightsQuery } from '@/redux/services/scorebatApi';

export default function Home() {
  const { isOn: spoilersOn } = useSelector((state: RootState) => state.spoiler);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  
  // Use the new aggregated highlights query
  const { data: aggregatedData, isLoading, error } = useGetAggregatedHighlightsQuery();

  // Get all highlights from aggregated data
  const allHighlights = useMemo(() => {
    if (!aggregatedData?.response) return [];
    
    // Enrich highlights with derby/high-score flags and apply ranking
    return enrichHighlights(aggregatedData.response);
  }, [aggregatedData]);

  // Section 1: Featured game - prioritize top competitions
  const featured = useMemo(() => {
    if (!allHighlights) return null;
    
    // First try to find featured match from top competitions
    const topCompetitionHighlights = allHighlights.filter(h => 
      isTopCompetition(h.competition)
    );
    
    if (topCompetitionHighlights.length > 0) {
      return selectFeatured(topCompetitionHighlights);
    }
    
    // Fallback to all highlights
    return selectFeatured(allHighlights);
  }, [allHighlights]);

  // Section 2: Top 5 games - prioritize top competitions
  const top5 = useMemo(() => {
    if (!allHighlights || !featured) return [];
    
    // Prioritize top competitions for top 5
    const topCompetitionHighlights = allHighlights.filter(h => 
      isTopCompetition(h.competition)
    );
    
    if (topCompetitionHighlights.length >= 5) {
      return selectTop5(topCompetitionHighlights, [featured.id]);
    }
    
    // Fallback to all highlights if not enough top competition matches
    return selectTop5(allHighlights, [featured.id]);
  }, [allHighlights, featured]);

  // Section 3: League selector and feeds - sorted chronologically
  const competitionsList = useMemo(() => {
    if (!aggregatedData?.competitions) return [];
    
    // Sort competitions by latest update (most recent first)
    const sortedCompetitions = [...aggregatedData.competitions].sort((a, b) => 
      new Date(b.latestUpdate).getTime() - new Date(a.latestUpdate).getTime()
    );
    
    return sortedCompetitions.map(comp => comp.name);
  }, [aggregatedData]);

  const leagueHighlights = useMemo(() => {
    if (!allHighlights || !selectedCompetition) return [];
    // Filter highlights for the selected competition and sort by weight
    const filtered = allHighlights.filter(h => h.competition === selectedCompetition);
    return sortHighlightsByWeight(filtered);
  }, [allHighlights, selectedCompetition]);

  // Auto-select first competition when data loads
  useEffect(() => {
    if (competitionsList.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitionsList[0]);
    }
  }, [competitionsList, selectedCompetition]);

  useEffect(() => {
    // Reset page title to default when on home page
    document.title = 'Missed The Game - Football Highlights Without Spoilers';
    
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Home',
        page_location: window.location.href,
      });
    }
  }, []);

  // Show header title when hero section is scrolled out of view
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Show header title when hero section is scrolled up (not visible)
        setShowHeaderTitle(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading highlights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Failed to load highlights. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {showHeaderTitle && (
                <h1 className="text-xl font-bold text-gray-900">Missed The Game</h1>
              )}
            </div>
            <SpoilerToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8" id="hero-section">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Missed The Game
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch football highlights without getting to know the final score
          </p>
        </div>
      </section>

      {/* Section 1: Featured Match + Favorites */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          {featured && (
            <FeaturedVideo 
              item={featured} 
              spoilersOn={spoilersOn}
            />
          )}
        </div>
      </section>

      {/* Section 2: Top 5 Games + Donation */}
      {top5.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            {/* Title hidden for now */}
            {false && <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Matches</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {top5.map((highlight, index) => (
                <React.Fragment key={highlight.id}>
                  <VideoItem
                    mode="regular"
                    item={highlight}
                    spoilersOn={spoilersOn}
                  />
                  {/* Insert donation card at position 2 */}
                  {index === 1 && (
                    <DonationCard />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: League Selector + League Feed */}
      {competitionsList.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by League</h3>
            
            {/* Competition Selector */}
            <CompetitionSelector
              competitions={competitionsList}
              selectedCompetition={selectedCompetition}
              onCompetitionChange={setSelectedCompetition}
            />
            
            {/* League Highlights */}
            {leagueHighlights.length > 0 && (
              <div 
                key={selectedCompetition}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              >
                {leagueHighlights.map((highlight) => (
                  <VideoItem
                    key={highlight.id}
                    mode="regular"
                    item={highlight}
                    spoilersOn={spoilersOn}
                  />
                ))}
              </div>
            )}
            
            {leagueHighlights.length === 0 && selectedCompetition && (
              <div className="text-center py-12">
                <p className="text-gray-500">No highlights available for {selectedCompetition}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* UI Components */}
      <CookieBanner />
      <InstallTooltip />
    </div>
  );
}
