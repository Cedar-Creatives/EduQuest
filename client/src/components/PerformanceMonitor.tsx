import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Clock,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Gauge,
  Database,
  Globe,
} from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  isOnline: boolean;
  errors: number;
  warnings: number;
  score: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    isOnline: navigator.onLine,
    errors: 0,
    warnings: 0,
    score: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now();

    // Measure render time
    const measureRender = () => {
      const renderTime = performance.now() - loadTime;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory
        ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      // Calculate performance score
      const score = Math.max(0, 100 - renderTime / 100 - memoryUsage * 2);

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage,
        networkLatency: 0,
        isOnline: navigator.onLine,
        errors: 0,
        warnings: 0,
        score: Math.round(score),
      });
    };

    // Measure network latency
    const measureNetwork = async () => {
      const start = performance.now();
      try {
        await fetch("/api/health", { method: "HEAD" });
        const latency = performance.now() - start;
        setMetrics((prev) => ({
          ...prev,
          networkLatency: Math.round(latency),
        }));
      } catch (error) {
        setMetrics((prev) => ({ ...prev, networkLatency: -1 }));
      }
    };

    // Listen for online/offline events
    const handleOnline = () =>
      setMetrics((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setMetrics((prev) => ({ ...prev, isOnline: false }));

    // Listen for errors
    const handleError = () =>
      setMetrics((prev) => ({ ...prev, errors: prev.errors + 1 }));
    const handleWarning = () =>
      setMetrics((prev) => ({ ...prev, warnings: prev.warnings + 1 }));

    // Set up event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("error", handleError);
    window.addEventListener("warning", handleWarning);

    // Initial measurements
    measureRender();
    measureNetwork();

    // Periodic measurements
    const interval = setInterval(() => {
      measureNetwork();
    }, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("error", handleError);
      window.removeEventListener("warning", handleWarning);
      clearInterval(interval);
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 70)
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
        >
          <Activity className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Performance Monitor
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Performance Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Performance Score</span>
              <Badge className={getScoreColor(metrics.score)}>
                {getScoreIcon(metrics.score)}
                <span className="ml-1">{metrics.score}/100</span>
              </Badge>
            </div>
            <Progress value={metrics.score} className="h-2" />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                Load Time
              </div>
              <div className="font-semibold">{metrics.loadTime}ms</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3" />
                Render Time
              </div>
              <div className="font-semibold">{metrics.renderTime}ms</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Gauge className="w-3 h-3" />
                Memory
              </div>
              <div className="font-semibold">{metrics.memoryUsage}MB</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Globe className="w-3 h-3" />
                Network
              </div>
              <div className="font-semibold">
                {metrics.networkLatency > 0
                  ? `${metrics.networkLatency}ms`
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {metrics.isOnline ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-3 h-3" />
                  <span className="text-xs">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-xs">Offline</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {metrics.errors > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">{metrics.errors}</span>
                </div>
              )}
              {metrics.warnings > 0 && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">{metrics.warnings}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
