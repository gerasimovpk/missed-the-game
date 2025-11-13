// Google Analytics 4 wrapper with Consent Mode v2
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID;

// Initialize GA4 with Consent Mode v2
export const initializeGA4 = () => {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Set default consent (denied)
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Update consent
export const updateConsent = (granted: boolean) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
};

// Set user ID
export const setUserId = (userId: string) => {
  if (typeof window === 'undefined' || !window.gtag || !GA4_MEASUREMENT_ID) return;

  window.gtag('config', GA4_MEASUREMENT_ID, {
    user_id: userId,
  });
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

// Event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, parameters);
};

// Specific event functions
export const trackHighlightPlayStarted = (videoId: string, league: string, homeTeam: string, awayTeam: string, scoreMasked: boolean, source: string) => {
  trackEvent('highlight_play_started', {
    video_id: videoId,
    league,
    home_team: homeTeam,
    away_team: awayTeam,
    score_masked: scoreMasked,
    source,
  });
};

export const trackHighlightWatch10s = (videoId: string, league: string, homeTeam: string, awayTeam: string, scoreMasked: boolean, watchSeconds: number) => {
  trackEvent('highlight_watch_10s', {
    video_id: videoId,
    league,
    home_team: homeTeam,
    away_team: awayTeam,
    score_masked: scoreMasked,
    watch_seconds: watchSeconds,
  });
};

export const trackHighlightCompleted80pct = (videoId: string, watchSeconds: number, durationSeconds: number) => {
  trackEvent('highlight_completed_80pct', {
    video_id: videoId,
    watch_seconds: watchSeconds,
    duration_seconds: durationSeconds,
  });
};

export const trackLeagueSelected = (league: string) => {
  trackEvent('league_selected', { league });
};

export const trackFavoriteAdd = (team: string) => {
  trackEvent('favorite_add', { team });
  setUserProperties({ has_favorites: true });
};

export const trackFavoriteRemove = (team: string) => {
  trackEvent('favorite_remove', { team });
};

export const trackSpoilersToggled = (toState: 'on' | 'off') => {
  trackEvent('spoilers_toggled', { to_state: toState });
};

export const trackShareClicked = (channel: 'webshare' | 'copylink') => {
  trackEvent('share_clicked', { channel });
};

export const trackDeepLinkOpened = (videoId: string) => {
  trackEvent('deep_link_opened', { video_id: videoId });
};

export const trackAppInstallPromptShown = () => {
  trackEvent('app_install_prompt_shown');
};

export const trackPWAInstalled = () => {
  trackEvent('pwa_installed_proxy');
};

export const trackDonationClicked = (provider: 'bmac') => {
  trackEvent('donation_clicked', { provider });
};

export const trackDonationReturnSuccess = () => {
  trackEvent('donation_return_success');
};
