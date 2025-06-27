
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.pathname.slice(1); // Remove leading slash

    if (!slug) {
      return new Response('Slug not provided', { status: 400 });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Look up the original URL
    const { data, error } = await supabase
      .from('urls')
      .select('original_url, click_count')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return new Response('URL not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }

    // Update click count in the background
    supabase
      .from('urls')
      .update({ click_count: (data.click_count || 0) + 1 })
      .eq('slug', slug)
      .then(() => console.log(`Updated click count for ${slug}`))
      .catch(err => console.error('Failed to update click count:', err));

    // Redirect to the original URL
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': data.original_url,
      },
    });

  } catch (error) {
    console.error('Error in redirect function:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
