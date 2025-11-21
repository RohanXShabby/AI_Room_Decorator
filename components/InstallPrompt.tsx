
import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      // Optional: Show iOS instructions after a small delay
      setTimeout(() => setIsVisible(true), 3000);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    }
  };

  if (!isVisible) return null;

  // iOS Instruction View
  if (isIOS) {
    return (
       <div className="fixed bottom-0 left-0 w-full z-[60] p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border-t-2 border-black dark:border-white p-5 shadow-none">
          <div className="flex items-start justify-between mb-3">
             <div className="flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Install Application</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                For the best experience, add to home screen.
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-black dark:text-white font-mono text-xs">
            <span>1. Tap the Share button</span>
            <span>2. Select "Add to Home Screen"</span>
          </div>
        </div>
      </div>
    );
  }

  // Android/Chrome Install Prompt
  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60]">
      <div className="bg-black dark:bg-white text-white dark:text-black p-4 flex items-center justify-between border border-white/20 dark:border-black/20 shadow-none">
        <div className="flex flex-col">
          <span className="font-bold text-sm uppercase tracking-widest">Install App</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">Add to Home Screen</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleInstall}
            className="flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Download size={14} />
            Install
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white dark:hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
