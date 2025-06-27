
-- Create a table to store URL mappings
CREATE TABLE public.urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  click_count INTEGER NOT NULL DEFAULT 0
);

-- Create an index on slug for fast lookups
CREATE INDEX idx_urls_slug ON public.urls(slug);

-- Enable Row Level Security (make it public for now since it's a URL shortener)
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read URLs (needed for redirects)
CREATE POLICY "Anyone can read URLs" 
  ON public.urls 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert URLs (for shortening)
CREATE POLICY "Anyone can create URLs" 
  ON public.urls 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update click count
CREATE POLICY "Anyone can update click count" 
  ON public.urls 
  FOR UPDATE 
  USING (true);
