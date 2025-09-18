import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useOffline } from '@/hooks/useServiceWorker';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const isOffline = useOffline();
  const [showDetails, setShowDetails] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate network check
    try {
      await fetch('/api/health', { method: 'HEAD' });
      // If successful, the online event will fire automatically
    } catch (error) {
      console.log('Still offline');
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  // Auto-hide details when back online
  useEffect(() => {
    if (!isOffline) {
      setShowDetails(false);
      setRetryCount(0);
    }
  }, [isOffline]);

  if (!isOffline) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <WifiOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  You're offline
                </span>
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:text-orange-300">
                  Limited functionality
                </Badge>
              </div>
              
              {showDetails && (
                <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                  <p>• Quiz progress is saved locally</p>
                  <p>• AI features are unavailable</p>
                  <p>• Data will sync when reconnected</p>
                  {retryCount > 0 && (
                    <p className="mt-1 font-medium">
                      Retry attempts: {retryCount}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/40"
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
              
              <Button
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isRetrying ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  'Retry'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Connection status indicator for the bottom of the screen
export function ConnectionStatus() {
  const isOffline = useOffline();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOffline && showReconnected === false) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, showReconnected]);

  if (isOffline) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-lg shadow-md">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline</span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg shadow-md animate-in slide-in-from-left-5">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      </div>
    );
  }

  return null;
}

// Network quality indicator
export function NetworkQualityIndicator() {
  const [networkQuality, setNetworkQuality] = useState<'good' | 'fair' | 'poor' | 'offline'>('good');
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    const checkNetworkQuality = async () => {
      try {
        const start = Date.now();
        await fetch('/api/health', { method: 'HEAD' });
        const end = Date.now();
        const responseTime = end - start;
        
        setLatency(responseTime);
        
        if (responseTime < 100) {
          setNetworkQuality('good');
        } else if (responseTime < 300) {
          setNetworkQuality('fair');
        } else {
          setNetworkQuality('poor');
        }
      } catch (error) {
        setNetworkQuality('offline');
      }
    };

    checkNetworkQuality();
    const interval = setInterval(checkNetworkQuality, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getQualityColor = () => {
    switch (networkQuality) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'fair':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-orange-600 dark:text-orange-400';
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getQualityIcon = () => {
    switch (networkQuality) {
      case 'good':
        return <Wifi className="w-4 h-4" />;
      case 'fair':
        return <Wifi className="w-4 h-4" />;
      case 'poor':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center space-x-1 text-xs ${getQualityColor()}`}>
      {getQualityIcon()}
      <span className="capitalize">{networkQuality}</span>
      {networkQuality !== 'offline' && (
        <span className="text-gray-500">({latency}ms)</span>
      )}
    </div>
  );
}