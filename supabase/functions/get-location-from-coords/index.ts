import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Get OpenWeather API key from environment variables
const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

// Set CORS headers to allow your frontend application to call this function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, it's recommended to change this to your frontend domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle preflight request from browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse latitude and longitude from request body
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required.');
    }

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key is not set.');
    }

    // Call OpenWeather API
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from OpenWeather: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('Location not found for the given coordinates.');
    }

    // Combine location name
    const location = `${data[0].name}, ${data[0].state || data[0].country}`;

    // Return successful result
    return new Response(JSON.stringify({ location }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Edge Function Error:', error);
    // Return error message
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});