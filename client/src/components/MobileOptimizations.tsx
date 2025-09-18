import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Share, 
  X, 
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { usePWAInstall } from '@/hooks/useServiceWorker';

// PWA Install Prompt
export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInstallable && !dismissed) {
      // Show prompt after 30 seconds of usage
      const timer = setTimeout(() => setShowPrompt(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, dismissed]);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Install EduQuest</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-white/90 mb-4">
            Install EduQuest for faster access, offline learning, and a native app experience!
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-white text-blue-600 hover:bg-white/90 flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mobile Share Button
export function MobileShareButton({ 
  title = "Check out EduQuest!", 
  text = "AI-powered exam preparation for Nigerian students",
  url = window.location.href 
}) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(navigator.share !== undefined);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      // Show toast notification
    }
  };

  if (!canShare) return null;

  return (
    <Button
      onClick={handleShare}
      size="sm"
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Share className="w-4 h-4" />
      <span>Share</span>
    </Button>
  );
}

// Mobile Viewport Handler
export function MobileViewportHandler() {
  useEffect(() => {
    // Prevent zoom on input focus (iOS Safari)
    const preventZoom = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
          
          // Restore after blur
          const restoreZoom = () => {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1.0, user-scalable=yes'
            );
            target.removeEventListener('blur', restoreZoom);
          };
          target.addEventListener('blur', restoreZoom);
        }
      }
    };

    document.addEventListener('focusin', preventZoom);
    return () => document.removeEventListener('focusin', preventZoom);
  }, []);

  return null;
}

// Mobile Orientation Handler
export function MobileOrientationHandler() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showRotateHint, setShowRotateHint] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      
      // Show rotate hint for quiz pages in landscape
      const isQuizPage = window.location.pathname.includes('/quiz/');
      if (isQuizPage && !isPortrait) {
        setShowRotateHint(true);
        setTimeout(() => setShowRotateHint(false), 3000);
      }
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  if (!showRotateHint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-sm">
        <CardContent className="p-6 text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold mb-2">Better in Portrait Mode</h3>
          <p className="text-sm text-gray-600 mb-4">
            For the best quiz experience, please rotate your device to portrait mode.
          </p>
          <Button
            onClick={() => setShowRotateHint(false)}
            size="sm"
            className="w-full"
          >
            Continue Anyway
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Mobile Performance Monitor
export function MobilePerformanceOptimizer() {
  useEffect(() => {
    // Optimize images for mobile
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // Add mobile-optimized sizes
        if (!img.sizes && img.srcset) {
          img.sizes = '(max-width: 768px) 100vw, 50vw';
        }
      });
    };

    // Debounce scroll events for better performance
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Trigger any scroll-based optimizations
        optimizeImages();
      }, 100);
    };

    // Initial optimization
    optimizeImages();
    
    // Optimize on scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize when new content loads
    const observer = new MutationObserver(optimizeImages);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
}

// Mobile Touch Optimizations
export function MobileTouchOptimizer() {
  useEffect(() => {
    // Add touch-friendly classes to interactive elements
    const optimizeTouchTargets = () => {
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          button.classList.add('touch-target-small');
        }
      });
    };

    // Prevent double-tap zoom on buttons
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        e.preventDefault();
      }
    };

    optimizeTouchTargets();
    document.addEventListener('touchend', preventDoubleTapZoom);

    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return null;
}

// Mobile Keyboard Handler
export function MobileKeyboardHandler() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Detect virtual keyboard on mobile
      const heightDiff = window.screen.height - window.visualViewport?.height!;
      setKeyboardVisible(heightDiff > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (keyboardVisible) {
      document.body.classList.add('keyboard-visible');
    } else {
      document.body.classList.remove('keyboard-visible');
    }
  }, [keyboardVisible]);

  return null;
}

// Comprehensive Mobile Optimization Component
export function MobileOptimizations() {
  return (
    <>
      <PWAInstallPrompt />
      <MobileViewportHandler />
      <MobileOrientationHandler />
      <MobilePerformanceOptimizer />
      <MobileTouchOptimizer />
      <MobileKeyboardHandler />
    </>
  );
}

// Hook for mobile detection
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      setIsMobile(width < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
      setIsTablet(width >= 768 && width < 1024);
      
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, screenSize };
}