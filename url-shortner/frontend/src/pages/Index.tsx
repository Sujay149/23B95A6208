
import React, { useState, useEffect } from 'react';
import { UrlShortenerForm } from '../components/UrlShortenerForm';
import { ResultDisplay } from '../components/ResultDisplay';
import { UrlHistory } from '../components/UrlHistory';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link, BarChart3, Zap } from 'lucide-react';

export interface ShortenedUrl {
  slug: string;
  originalUrl: string;
  shortUrl: string;
  clickCount?: number;
  createdAt?: string;
}

const Index = () => {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    // Load recent URLs from localStorage for better UX
    const savedUrls = localStorage.getItem('recentUrls');
    if (savedUrls) {
      try {
        setUrlHistory(JSON.parse(savedUrls).slice(0, 5)); // Keep only last 5
      } catch (error) {
        console.error('Error loading saved URLs:', error);
      }
    }
  }, []);

  const saveToHistory = (url: ShortenedUrl) => {
    const newHistory = [url, ...urlHistory.filter(u => u.slug !== url.slug)].slice(0, 5);
    setUrlHistory(newHistory);
    localStorage.setItem('recentUrls', JSON.stringify(newHistory));
  };

  const handleShorten = async (url: string, customSlug?: string) => {
    setIsLoading(true);
    
    try {
      // Ensure URL has protocol
      let processedUrl = url.trim();
      if (!processedUrl.match(/^https?:\/\//)) {
        processedUrl = 'https://' + processedUrl;
      }

      const slug = customSlug || generateRandomSlug();
      console.log('Creating short URL with slug:', slug);
      
      // Check if custom slug already exists
      if (customSlug) {
        const { data: existingUrl } = await supabase
          .from('urls')
          .select('slug')
          .eq('slug', customSlug)
          .single();
          
        if (existingUrl) {
          toast({
            title: "Slug already taken",
            description: "Please choose a different custom slug.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Insert URL into database
      const { data, error } = await supabase
        .from('urls')
        .insert({
          slug,
          original_url: processedUrl
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Error",
          description: "Failed to shorten URL. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const shortUrl = `${window.location.origin}/${slug}`;
      
      const result: ShortenedUrl = {
        slug,
        originalUrl: processedUrl,
        shortUrl,
        clickCount: 0,
        createdAt: data.created_at
      };
      
      setShortenedUrl(result);
      saveToHistory(result);
      
      toast({
        title: "Success! 🎉",
        description: "Your link has been shortened successfully.",
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomSlug = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <Link className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              URL-SHORTNER
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform long, messy URLs into short, shareable, and elegant links. 
              Simple, fast, and beautiful URL shortening at your fingertips.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <UrlShortenerForm 
              onShorten={handleShorten} 
              isLoading={isLoading}
            />
            
            {shortenedUrl && (
              <div className="mt-8">
                <ResultDisplay shortenedUrl={shortenedUrl} />
              </div>
            )}
          </div>

          {/* URL History */}
          {urlHistory.length > 0 && (
            <div className="mb-8">
              <UrlHistory urls={urlHistory} />
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Shorten URLs in under 2 seconds with our optimized infrastructure and instant redirects.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Click Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Track how many times your links are clicked with built-in analytics and insights.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Link className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding</h3>
              <p className="text-gray-600 leading-relaxed">Create branded short links with custom slugs for better recognition and trust.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
