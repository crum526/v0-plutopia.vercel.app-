import { useEffect, useState, useCallback } from 'react';

export interface PWAUpdateState {
  updateAvailable: boolean;
  waitingServiceWorker: ServiceWorkerContainer | null;
}

export const usePWAUpdate = () => {
  const [updateState, setUpdateState] = useState<PWAUpdateState>({
    updateAvailable: false,
    waitingServiceWorker: null,
  });

  const handleUpdate = useCallback(() => {
    const { waitingServiceWorker } = updateState;
    if (!waitingServiceWorker) return;

    // Tell the service worker to skip waiting
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page after a short delay to ensure service worker has been replaced
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [updateState]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleServiceWorkerUpdate = () => {
      const newWorker = navigator.serviceWorker.controller;
      if (newWorker) {
        setUpdateState({
          updateAvailable: true,
          waitingServiceWorker: navigator.serviceWorker,
        });
      }
    };

    // Check for updates when service worker controller changes
    navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);

    // Register service worker and check for updates
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates immediately
        registration.update();

        // Check for updates every 30 seconds
        const updateInterval = setInterval(() => {
          registration.update();
        }, 30000);

        // Listen for when a new service worker is waiting to be activated
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new service worker is ready to take over
              setUpdateState({
                updateAvailable: true,
                waitingServiceWorker: navigator.serviceWorker,
              });
            }
          });
        });

        return () => clearInterval(updateInterval);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
    };
  }, []);

  return { ...updateState, handleUpdate };
};
