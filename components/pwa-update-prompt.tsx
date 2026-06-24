'use client';

import { usePWAUpdate } from '@/hooks/use-pwa-update';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PWAUpdatePrompt() {
  const { updateAvailable, handleUpdate } = usePWAUpdate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      // Show the prompt after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto sm:bottom-24 md:bottom-6 md:right-6 md:left-auto md:max-w-sm">
      <div className="bg-plutopia-darker border border-plutopia-neon-blue rounded-lg shadow-lg p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-plutopia-neon-blue mt-0.5 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">Update Available</h3>
            <p className="text-plutopia-ghost text-xs mt-1">A new version of Plutopia is available. Update now to enjoy the latest features and fixes.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsVisible(false)}
            className="px-3 py-2 text-xs font-medium text-plutopia-ghost hover:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-2 text-xs font-medium bg-plutopia-neon-blue text-plutopia-darker hover:bg-plutopia-neon-cyan transition-colors rounded"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
