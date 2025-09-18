import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleAuthTroubleshootProps {
  error?: string;
  onRetry?: () => void;
}

export function GoogleAuthTroubleshoot({ error, onRetry }: GoogleAuthTroubleshootProps) {
  const isNetworkError = error?.includes('network-request-failed') || error?.includes('Network error');
  const isDomainError = error?.includes('unauthorized-domain');

  if (!isNetworkError && !isDomainError) {
    return null;
  }

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          <span>Google Sign-In Issue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-orange-700">
          {isNetworkError && (
            <div className="space-y-2">
              <p className="font-medium">Network/Domain Authorization Issue</p>
              <p>The current domain may not be authorized for Google sign-in.</p>
            </div>
          )}
          
          {isDomainError && (
            <div className="space-y-2">
              <p className="font-medium">Domain Not Authorized</p>
              <p>This domain is not authorized for Google sign-in in Firebase.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-3 rounded-lg border border-orange-200">
          <p className="text-sm font-medium text-orange-800 mb-2">Quick Solutions:</p>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Try accessing via <code className="bg-orange-100 px-1 rounded">localhost:5173</code> instead</li>
            <li>• Clear browser cache and cookies</li>
            <li>• Check your internet connection</li>
            <li>• Contact administrator to authorize this domain</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => window.location.href = 'http://localhost:5173'}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Try localhost</span>
          </Button>
          
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          )}
        </div>

        <div className="text-xs text-orange-600">
          <Badge variant="outline" className="text-xs">
            Error: {error?.split(':')[0] || 'Network/Domain issue'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}