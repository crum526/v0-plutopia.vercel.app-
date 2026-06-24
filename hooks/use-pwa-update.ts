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
    const registration = (updateState.waitingServiceWorker as any)?._sw || updateState.waitingServiceWorker;
    if (!registration) {
      console.log('[v0] No waiting service worker found');
      return;
    }

    // Get the waiting worker
    const waitingWorker = (registration as ServiceWorkerRegistration).waiting;
    if (!waitingWorker) {
      console.log('[v0] No waiting worker available');
      return;
    }

    console.log('[v0] Sending SKIP_WAITING to service worker');
    // Tell the service worker to skip waiting
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page when the new service worker takes over
    let reloadCheckCount = 0;
    const reloadCheck = setInterval(() => {
      reloadCheckCount++;
      if (navigator.serviceWorker.controller?.scriptURL.includes('sw.js') && reloadCheckCount > 2) {
        clearInterval(reloadCheck);
        window.location.reload();
      }
      if (reloadCheckCount > 20) {
        clearInterval(reloadCheck);
        window.location.reload();
      }
    }, 100);
  }, [updateState]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('[v0] Service workers not supported');
      return;
    }

    // Register service worker and check for updates
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[v0] Service worker registered');
        
        // Check for updates immediately
        registration.update();

        // Check for updates every 30 seconds
        const updateInterval = setInterval(() => {
          registration.update();
        }, 30000);

        // Check if there's already a waiting worker on initial load
        if (registration.waiting) {
          console.log('[v0] Waiting worker found on load');
          setUpdateState({
            updateAvailable: true,
            waitingServiceWorker: registration as any,
          });
        }

        // Listen for when a new service worker is waiting to be activated
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          console.log('[v0] New service worker installing');

          newWorker.addEventListener('statechange', () => {
            console.log('[v0] Service worker state:', newWorker.state);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new service worker is ready to take over
              console.log('[v0] Update available - new worker waiting');
              setUpdateState({
                updateAvailable: true,
                waitingServiceWorker: registration as any,
              });
            }
          });
        });

        return () => clearInterval(updateInterval);
      })
      .catch((error) => {
        console.error('[v0] Service Worker registration failed:', error);
      });
  }, []);

  return { ...updateState, handleUpdate };
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
