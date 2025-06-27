
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Check, BarChart3, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ShortenedUrl } from '../pages/Index';

interface ResultDisplayProps {
  shortenedUrl: ShortenedUrl;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ shortenedUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl.shortUrl);
      setCopied(true);
      toast({
        title: "Copied! 📋",
        description: "Short URL copied to clipboard.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleVisit = () => {
    window.open(shortenedUrl.shortUrl, '_blank');
  };

  const handleTestOriginal = () => {
    window.open(shortenedUrl.originalUrl, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
        <h3 className="text-2xl font-bold text-gray-900">
          Your shortened URL is ready! 🎉
        </h3>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <div className="flex items-center space-x-3">
            <Input
              value={shortenedUrl.shortUrl}
              readOnly
              className="border-0 bg-transparent text-blue-600 font-semibold text-lg focus:ring-0 cursor-pointer flex-1"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="shrink-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={handleVisit}
              variant="ghost"
              size="sm"
              className="shrink-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/60 rounded-lg p-4 border border-green-100">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-700">Original URL:</span>
            </div>
            <p className="text-gray-600 break-all text-xs bg-gray-50 rounded px-2 py-1">
              {shortenedUrl.originalUrl}
            </p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4 border border-green-100">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-700">Short Code:</span>
            </div>
            <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {shortenedUrl.slug}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-green-200 text-green-700 hover:text-green-800"
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button
            onClick={handleVisit}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-blue-200 text-blue-700 hover:text-blue-800"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Test Short Link
          </Button>
          <Button
            onClick={handleTestOriginal}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-purple-200 text-purple-700 hover:text-purple-800"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Test Original
          </Button>
        </div>
      </div>
    </div>
  );
};
