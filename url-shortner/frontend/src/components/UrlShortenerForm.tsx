
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Link2, Sparkles } from 'lucide-react';

interface UrlShortenerFormProps {
  onShorten: (url: string, customSlug?: string) => void;
  isLoading: boolean;
}

export const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({ onShorten, isLoading }) => {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (inputUrl: string): boolean => {
    try {
      // Allow URLs without protocol, we'll add https:// later
      const testUrl = inputUrl.match(/^https?:\/\//) ? inputUrl : `https://${inputUrl}`;
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    setUrlError('');
    onShorten(url, customSlug || undefined);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError) setUrlError('');
  };

  const currentDomain = window.location.origin;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="url" className="text-base font-semibold text-gray-800 flex items-center">
          <Link2 className="mr-2 h-5 w-5 text-blue-600" />
          Enter your long URL
        </Label>
        <Input
          id="url"
          type="text"
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          value={url}
          onChange={handleUrlChange}
          className={`h-14 text-lg border-2 transition-all duration-200 ${
            urlError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } rounded-xl shadow-sm`}
          disabled={isLoading}
        />
        {urlError && (
          <p className="text-red-600 text-sm font-medium flex items-center">
            <span className="mr-1">⚠️</span>
            {urlError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="slug" className="text-base font-semibold text-gray-800 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
          Custom slug (optional)
        </Label>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-600 font-medium">
            {currentDomain}/
          </div>
          <Input
            id="slug"
            type="text"
            placeholder="my-awesome-link"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            className="h-14 text-lg flex-1 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-xl shadow-sm transition-all duration-200"
            disabled={isLoading}
            maxLength={30}
          />
        </div>
        <p className="text-sm text-gray-500 bg-gray-50/50 rounded-lg p-3 border border-gray-100">
          💡 Leave empty to generate a random short link. Only letters, numbers, hyphens, and underscores allowed.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Creating magic...
          </>
        ) : (
          <>
            <Link2 className="mr-3 h-5 w-5" />
            Shorten URL
          </>
        )}
      </Button>
    </form>
  );
};
