'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { VideoComponent } from '@/components/VideoComponent';
import { ArrowLeft, Share2 } from 'lucide-react';
import { trackDeepLinkOpened } from '@/lib/ga4';
import { useGetAggregatedHighlightsQuery } from '@/redux/services/scorebatApi';
import { enrichHighlights } from '@/lib/ranking';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const encodedVideoId = params.id as string;
  const videoId = decodeURIComponent(encodedVideoId); // Decode URL-encoded characters
  const { isOn: spoilersOn } = useSelector((state: RootState) => state.spoiler);
  const [showVideo, setShowVideo] = useState(false);
  
  // Use the new aggregated highlights query
  const { data: aggregatedData, isLoading, error } = useGetAggregatedHighlightsQuery();
  
  // Get highlights from aggregated data
  const highlights = useMemo(() => {
    if (!aggregatedData?.response) return [];
    return enrichHighlights(aggregatedData.response);
  }, [aggregatedData]);

  const highlight = highlights?.find(h => h.id === videoId);

  // Debug logging
  useEffect(() => {
    console.log('Looking for video ID:', videoId);
    console.log('Available highlights:', highlights?.length);
    console.log('Found highlight:', highlight);
    if (highlights && !highlight) {
      console.log('All IDs:', highlights.map(h => h.id));
    }
  }, [videoId, highlights, highlight]);

  useEffect(() => {
    if (highlight) {
      trackDeepLinkOpened(highlight.id);
      // Auto-play video after a short delay
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  // Update page title dynamically
  useEffect(() => {
    if (highlight) {
      const date = new Date(highlight.dateUTC).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const title = `${highlight.homeTeam} - ${highlight.awayTeam}, ${date} - Football Highlights Without Spoilers | Missed The Game`;
      document.title = title;
    } else if (!isLoading) {
      // Fallback title when video is not found
      document.title = 'Video Not Found | Missed The Game';
    }
  }, [highlight, isLoading]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    const shareData = {
      title: highlight?.title || 'Football Highlight',
      text: `Watch this football highlight: ${highlight?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast here
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-white mx-auto mb-4"></div>
          <p className="text-white">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error loading video</h1>
          <p className="text-gray-400 mb-6">Failed to load video. Please try again later.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!highlight && !isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video not found</h1>
          <p className="text-gray-400 mb-6">The requested video could not be found.</p>
          <p className="text-gray-500 text-sm mb-4">Video ID: {videoId}</p>
          <p className="text-gray-500 text-sm mb-6">Available videos: {highlights?.length || 0}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      {highlight && (
        <>
          <div className="pt-16">
            {/* {showVideo ? ( */}
              <VideoComponent 
                highlight={highlight} 
                spoilersOn={spoilersOn}
                autoPlay={true}
              />
            {/* ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-white mx-auto mb-4"></div>
                  <p className="text-white">Preparing video...</p>
                </div>
              </div>
            )} */}
          </div>

          {/* Video Info */}
          <div className="px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-white mb-2">
                {highlight.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                <span>{highlight.competition}</span>
                <span>•</span>
                <span>{highlight.homeTeam} vs {highlight.awayTeam}</span>
                <span>•</span>
                <span>{new Date(highlight.dateUTC).toLocaleDateString()}</span>
              </div>
              {highlight.description && (
                <p className="text-gray-300 leading-relaxed">
                  {highlight.description}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
