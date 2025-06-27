
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RedirectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!slug) {
        setError('Invalid URL - no slug provided');
        setLoading(false);
        return;
      }

      console.log('Looking up slug:', slug);
      
      try {
        // Look up the original URL
        const { data, error } = await supabase
          .from('urls')
          .select('original_url, click_count')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Database error:', error);
          setError('URL not found in database');
          setLoading(false);
          return;
        }

        if (!data) {
          console.error('No data returned for slug:', slug);
          setError('Shortened URL does not exist');
          setLoading(false);
          return;
        }

        console.log('Found URL:', data.original_url);
        setOriginalUrl(data.original_url);

        // Update click count in background
        supabase
          .from('urls')
          .update({ click_count: (data.click_count || 0) + 1 })
          .eq('slug', slug)
          .then(() => console.log(`Updated click count for ${slug}`))
          .catch(err => console.error('Failed to update click count:', err));

        // Add a small delay to show the redirect message
        setTimeout(() => {
          console.log('Redirecting to:', data.original_url);
          window.location.href = data.original_url;
        }, 1000);

      } catch (error) {
        console.error('Error during redirect:', error);
        setError('An error occurred while processing the redirect');
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-gray-100">
          <div className="mb-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Redirecting...</h1>
          <p className="text-gray-600 mb-4">
            Please wait while we take you to your destination.
          </p>
          {originalUrl && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium truncate">{originalUrl}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-gray-100">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            {originalUrl && (
              <Button 
                variant="outline" 
                onClick={() => window.location.href = originalUrl}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Original Link
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectPage;
