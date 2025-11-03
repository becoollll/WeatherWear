import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Check if the query is a zip code (5 digits)
const isZipCode = (query: string): boolean => {
  return /^\d{5}$/.test(query.trim());
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { locationName } = await req.json();
    if (!locationName) throw new Error('Location name or zip code is required.');
    if (!OPENWEATHER_API_KEY) throw new Error('OpenWeather API key is not set.');

    let geocodingUrl = '';
    const rawQuery = locationName.trim();

    if (isZipCode(rawQuery)) {
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${rawQuery},US&appid=${OPENWEATHER_API_KEY}`;
    } else {
      // Formatting location name for OpenWeather Geocoding API
      // 1. Split by comma and trim each part
      const parts = rawQuery.split(',').map((part: string) => part.trim());

      // 2. Reassemble with commas and append country code ",US"
      const formattedQuery = `${parts.join(',')},US`;
      
      // 3. Use the formatted query string
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(formattedQuery)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    }

    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      throw new Error(`Geocoding API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error(`Invalid location or zip code: "${rawQuery}"`);
    }

    const { lat, lon } = Array.isArray(data) ? data[0] : data;

    if (lat == null || lon == null) {
      throw new Error(`Could not find coordinates for: "${rawQuery}"`);
    }

    return new Response(JSON.stringify({ latitude: lat, longitude: lon }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Geocoding Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
