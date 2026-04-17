/**
 * Cross-app Navigation History Tracker
 * Tracks navigation between the landing app and web app
 */

// Get URLs - in LifeBalance, both apps are at the same origin
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

export const APPS = {
  LANDING: ORIGIN,
  WEB: ORIGIN,
} as const;

export const LANDING_PAGE = {
  HOME: `${APPS.LANDING}/`,
} as const;

export const WEB_PAGES = {
  LOGIN: `${APPS.WEB}/login`,
  REGISTER: `${APPS.WEB}/register`,
  DASHBOARD: `${APPS.WEB}/dashboard`,
} as const;

interface NavigationEntry {
  url: string;
  timestamp: number;
  title?: string;
}

const STORAGE_KEY = 'svarajya_navigation_history';
const MAX_HISTORY = 10;
let isNavigating = false; // Prevent rapid double-navigation

export function pushNavigationHistory(url: string, title?: string): void {
  try {
    const history = getNavigationHistory();
    
    // Don't add duplicate consecutive URLs
    if (history.length > 0 && history[history.length - 1]?.url === url) {
      return;
    }

    history.push({
      url,
      timestamp: Date.now(),
      title,
    });

    // Keep only the last MAX_HISTORY entries
    if (history.length > MAX_HISTORY) {
      history.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log('[Navigation] Added:', url);
  } catch (error) {
    console.error('Failed to push navigation history:', error);
  }
}

export function getNavigationHistory(): NavigationEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get navigation history:', error);
    return [];
  }
}

export function getLastUrl(): string | null {
  try {
    const history = getNavigationHistory();
    if (history.length > 0) {
      return history[history.length - 1]?.url ?? null;
    }
  } catch (error) {
    console.error('Failed to get last URL:', error);
  }
  return null;
}

export function getPreviousUrl(): string | null {
  try {
    const history = getNavigationHistory();
    if (history.length >= 2) {
      return history[history.length - 2]?.url ?? null;
    }
  } catch (error) {
    console.error('Failed to get previous URL:', error);
  }
  return null;
}

export function clearNavigationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Navigation] History cleared');
  } catch (error) {
    console.error('Failed to clear navigation history:', error);
  }
}

/**
 * Navigate to a URL with optimized performance
 * Prevents rapid double-navigation and tracks history
 */
export function navigateTo(url: string): void {
  if (isNavigating) {
    console.warn('[Navigation] Navigation in progress, ignoring duplicate request');
    return;
  }

  isNavigating = true;
  
  try {
    // Push current location to history before navigating
    const currentUrl = window.location.href;
    if (currentUrl !== url) {
      pushNavigationHistory(currentUrl);
      console.log('[Navigation] Navigating to:', url);
    }

    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      window.location.href = url;
    });
  } catch (error) {
    console.error('Navigation error:', error);
    isNavigating = false;
  }
}

/**
 * Navigate back to previous page (handles cross-app)
 * Optimized for smooth performance
 */
export function navigateBack(fallbackUrl = LANDING_PAGE.HOME): void {
  if (isNavigating) {
    console.warn('[Navigation] Navigation in progress, ignoring back request');
    return;
  }

  isNavigating = true;

  try {
    const previous = getPreviousUrl();
    console.log('[Navigation] Going back from:', window.location.href);
    console.log('[Navigation] Going back to:', previous ?? fallbackUrl);

    if (previous) {
      // Pop the last entry from history
      const history = getNavigationHistory();
      history.pop(); // Remove current entry
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

      requestAnimationFrame(() => {
        window.location.href = previous;
      });
    } else {
      // No history, use fallback
      requestAnimationFrame(() => {
        window.location.href = fallbackUrl;
      });
    }
  } catch (error) {
    console.error('Back navigation error:', error);
    isNavigating = false;
  }
}
