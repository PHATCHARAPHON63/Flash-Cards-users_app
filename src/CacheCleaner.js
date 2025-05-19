// CacheCleaner.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CacheCleaner = () => {
  const location = useLocation();

  useEffect(() => {
    const clearBrowserCache = async () => {
      try {
        // เคลียร์แคชของ browser
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(async (cacheName) => {
              await caches.delete(cacheName);
            })
          );
        }

        // เคลียร์ Service Worker
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(async (registration) => {
              await registration.unregister();
            })
          );
        }

        // Force reload assets
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');

        // Add timestamp to CSS files
        links.forEach(link => {
          if (link.href) {
            link.href = link.href.split('?')[0] + '?v=' + new Date().getTime();
          }
        });

        // Add timestamp to JS files
        scripts.forEach(script => {
          if (script.src) {
            script.src = script.src.split('?')[0] + '?v=' + new Date().getTime();
          }
        });

        console.log('Cache cleared successfully on path change to:', location.pathname);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };

    clearBrowserCache();
  }, [location.pathname]);

  // Component ไม่จำเป็นต้องแสดงผล UI
  return null;
};

export default CacheCleaner;