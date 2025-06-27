
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Clock, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ShortenedUrl } from '../pages/Index';

interface UrlHistoryProps {
  urls: ShortenedUrl[];
}

export const UrlHistory: React.FC<UrlHistoryProps> = ({ urls }) => {
  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied! 📋",
        description: "Short URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (urls.length === 0) return null;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Recent Links</h3>
      </div>
      
      <div className="space-y-3">
        {urls.map((url, index) => (
          <div key={url.slug} className="bg-white/80 rounded-xl p-4 border border-gray-100 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                    {url.slug}
                  </span>
                  {url.clickCount !== undefined && (
                    <div className="flex items-center text-xs text-gray-500">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {url.clickCount} clicks
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {url.originalUrl}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {url.shortUrl}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  onClick={() => handleCopy(url.shortUrl)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => window.open(url.shortUrl, '_blank')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
