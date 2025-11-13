'use client';

import { useState, useEffect, useRef } from 'react';
import { Highlight } from '@/redux/services/scorebatApi';
import { trackHighlightWatch10s } from '@/lib/ga4';
import { EyeOff, X, Share2, Maximize, Minimize } from 'lucide-react';

interface VideoComponentProps {
  highlight: Highlight;
  spoilersOn?: boolean;
  autoPlay?: boolean;
}

export function VideoComponent({ highlight, spoilersOn = false, autoPlay = false }: VideoComponentProps) {
  const [hasWatched10s, setHasWatched10s] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingVideoUrl, setIsLoadingVideoUrl] = useState(true);
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch video URL from backend with embed token
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoadingVideoUrl(true);
        // Use the Cloudflare Worker URL from environment variable
        const proxyUrl = process.env.NEXT_PUBLIC_SCOREBAT_PROXY_URL || 
          (typeof window !== 'undefined' ? `${window.location.origin.replace(':3000', ':8787')}` : 'http://localhost:8787');
        const response = await fetch(`${proxyUrl}/video-url?videoId=${highlight.id}&autoplay=${autoPlay}`);
        if (response.ok) {
          const data = await response.json();
          setVideoUrl(data.videoUrl);
        } else {
          console.error('Failed to fetch video URL:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setIsLoadingVideoUrl(false);
      }
    };

    fetchVideoUrl();
  }, [highlight.id, autoPlay]);

  useEffect(() => {
    if (autoPlay) {
      setWatchStartTime(Date.now());
    }
  }, [autoPlay]);

  // Track 10-second watch event
  useEffect(() => {
    if (watchStartTime && !hasWatched10s) {
      const timer = setTimeout(() => {
        trackHighlightWatch10s(
          highlight.id,
          highlight.competition,
          highlight.homeTeam,
          highlight.awayTeam,
          spoilersOn,
          10
        );
        setHasWatched10s(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [watchStartTime, hasWatched10s, highlight, spoilersOn]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${highlight.competition}: ${highlight.homeTeam} vs ${highlight.awayTeam}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  // Start tracking when video loads
  useEffect(() => {
    if (videoUrl && !isLoadingVideoUrl) {
      setWatchStartTime(Date.now());
    }
  }, [videoUrl, isLoadingVideoUrl]);

  // Handle ESC key to exit custom full-screen
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCustomFullscreen) {
        setIsCustomFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isCustomFullscreen]);

  const handleCustomFullscreen = async () => {
    if (isMobile) {
      // On mobile, use native fullscreen
      const iframe = iframeRef.current || (document.querySelector('iframe[title*="vs"]') as HTMLIFrameElement);
      if (iframe) {
        try {
          if (iframe.requestFullscreen) {
            await iframe.requestFullscreen();
          } else if ((iframe as any).webkitEnterFullscreen) {
            // iOS Safari
            (iframe as any).webkitEnterFullscreen();
          } else if ((iframe as any).mozRequestFullScreen) {
            await (iframe as any).mozRequestFullScreen();
          } else if ((iframe as any).msRequestFullscreen) {
            await (iframe as any).msRequestFullscreen();
          }
        } catch (error) {
          console.error('Error entering fullscreen:', error);
          // Fallback to custom fullscreen on mobile if native fails
          setIsCustomFullscreen(!isCustomFullscreen);
        }
      } else {
        // Fallback to custom fullscreen
        setIsCustomFullscreen(!isCustomFullscreen);
      }
    } else {
      // Desktop: use custom fullscreen
      setIsCustomFullscreen(!isCustomFullscreen);
    }
  };

  const handleExitCustomFullscreen = () => {
    if (isMobile) {
      // Exit native fullscreen on mobile
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozFullScreenElement) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msFullscreenElement) {
        (document as any).msExitFullscreen();
      }
    }
    setIsCustomFullscreen(false);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (!isFullscreen && isMobile) {
        setIsCustomFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isMobile]);

  return (
    <div className={`${isCustomFullscreen && !isMobile ? 'fixed inset-0 bg-black z-50' : 'fixed inset-0 bg-black flex items-center justify-center z-50 p-4'}`}>
      <div className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl ${isCustomFullscreen && !isMobile ? 'w-full h-full' : isMobile ? 'w-full max-w-full' : 'w-full max-w-6xl'}`}>

        {/* Scorebat video widget iframe */}
        <div className="relative w-full aspect-video">
          {isLoadingVideoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-white mx-auto mb-4"></div>
                <p className="text-white">Loading video...</p>
              </div>
            </div>
          ) : videoUrl ? (
            <>
              <iframe
                ref={iframeRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen={true}
                allow={spoilersOn ? "autoplay; picture-in-picture" : "autoplay; fullscreen; picture-in-picture"}
                title={`${highlight.homeTeam} vs ${highlight.awayTeam}`}
              />
              {/* Spoiler protection overlay for video title bar */}
              {spoilersOn && (
                <div className="absolute top-0 left-0 right-0 h-16 bg-black bg-opacity-90 z-20 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Score Hidden</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <p className="text-white text-xl mb-4">Video not available</p>
                <p className="text-gray-400">Unable to load video URL</p>
              </div>
            </div>
          )}
        </div>

        {/* Spoiler protection badge */}
        {spoilersOn && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-3 py-1 rounded-full z-10 flex items-center space-x-2">
            <EyeOff size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-white">Protected</span>
          </div>
        )}

        {/* Controls */}
        <div className="absolute top-2 right-2 flex gap-2 z-30">
          {/* Custom full-screen button - only show when spoilers are on */}
          {spoilersOn && (
            <button
              onClick={handleCustomFullscreen}
              className="p-2 rounded-full bg-black bg-opacity-70 hover:bg-opacity-90 transition-all text-white"
              aria-label={isCustomFullscreen ? "Exit full-screen" : "Enter full-screen"}
            >
              {isCustomFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black bg-opacity-70 hover:bg-opacity-90 transition-all text-white"
            aria-label="Share video"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black bg-opacity-70 hover:bg-opacity-90 transition-all text-white"
            aria-label="Close video"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
