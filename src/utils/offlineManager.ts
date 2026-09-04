/**
 * Offline Storage & Service Worker Management Utility
 * Handles Service Worker lifecycle, offline detection, and local caching
 * to ensure e-book content and saved bookmarks remain 100% accessible offline.
 */

import { useState, useEffect } from 'react';
import { recipesData, bookPages } from '../data/ebookData';

export interface OfflineStatus {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  lastCachedAt: string | null;
  cachedRecipesCount: number;
  cachedBookmarksCount: number;
}

const CACHE_TIMESTAMP_KEY = 'sumbergondo_offline_cache_timestamp';
const CACHE_NAME = 'sumbergondo-ebook-v2.0';

/**
 * Register Service Worker safely
 */
export function registerServiceWorker(onUpdate?: (registration: ServiceWorkerRegistration) => void) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // In development mode, unregister any active service worker and clear caches to prevent stale Vite modules
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered with scope:', registration.scope);

        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[SW] New content available; please refresh.');
                if (onUpdate) onUpdate(registration);
              } else {
                console.log('[SW] Content is cached for offline use.');
                saveOfflineCacheTimestamp();
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[SW] Service Worker registration skipped or failed:', error);
      });
  });
}

/**
 * Save offline cache timestamp to localStorage
 */
export function saveOfflineCacheTimestamp() {
  try {
    const now = new Date().toISOString();
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now);
  } catch (e) {
    console.error('Failed to save cache timestamp:', e);
  }
}

/**
 * Get offline cache timestamp
 */
export function getOfflineCacheTimestamp(): string | null {
  try {
    return localStorage.getItem(CACHE_TIMESTAMP_KEY);
  } catch {
    return null;
  }
}

/**
 * Explicitly pre-cache all assets, e-book images, and recipes into CacheStorage
 */
export async function precacheAllEbookAssets(): Promise<{ success: boolean; itemsCached: number }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    saveOfflineCacheTimestamp();
    return { success: true, itemsCached: 0 };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const urlsToCache = new Set<string>();

    // Essential URLs
    urlsToCache.add('/');
    urlsToCache.add('/index.html');
    urlsToCache.add('/manifest.webmanifest');

    // Collect all recipe images
    recipesData.forEach((recipe) => {
      if (recipe.image && typeof recipe.image === 'string') {
        urlsToCache.add(recipe.image);
      }
    });

    // Collect local book cover & recipe assets
    const localAssetImages = [
      '/src/assets/images/apple_cover_new_1786596727676.jpg',
      '/src/assets/images/apple_cover_circle_badge_1786597025185.jpg',
      '/src/assets/images/apple_cover_mascot_1786595003496.jpg',
      '/src/assets/images/selai_apel_toples_asli_1788246966634.jpg',
      '/src/assets/images/selai_apel_toples_landscape_1788246984309.jpg',
      '/src/assets/images/nastar_apel_batu_hero_1788247447271.jpg',
    ];
    localAssetImages.forEach((img) => urlsToCache.add(img));

    let itemsCached = 0;
    const urlArray = Array.from(urlsToCache);

    for (const url of urlArray) {
      try {
        const response = await fetch(url, { mode: 'no-cors' });
        if (response) {
          await cache.put(url, response);
          itemsCached++;
        }
      } catch (err) {
        console.warn('[OfflineManager] Skipped prefetching url:', url, err);
      }
    }

    saveOfflineCacheTimestamp();
    return { success: true, itemsCached };
  } catch (error) {
    console.error('[OfflineManager] Failed to precache assets:', error);
    return { success: false, itemsCached: 0 };
  }
}

/**
 * Custom hook to track online/offline status and offline capability
 */
export function useOfflineStatus(savedBookmarkIds: string[] = []): OfflineStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
  });

  const [lastCachedAt, setLastCachedAt] = useState<string | null>(getOfflineCacheTimestamp());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true);
        if (!lastCachedAt) {
          saveOfflineCacheTimestamp();
          setLastCachedAt(getOfflineCacheTimestamp());
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lastCachedAt]);

  return {
    isOnline,
    isServiceWorkerReady,
    lastCachedAt,
    cachedRecipesCount: recipesData.length,
    cachedBookmarksCount: savedBookmarkIds.length,
  };
}
