import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, units } = await req.json();
    if (!latitude || !longitude) throw new Error('Latitude and longitude are required.');
    if (!OPENWEATHER_API_KEY) throw new Error('OpenWeather API key is not set.');

    const apiUnits = units || 'imperial';
    // Construct the URLs for current weather and hourly forecast
    const currentWeatherUrl = `https://pro.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=${apiUnits}`;
    // Get hourly forecast, cnt 25 get now + next 24 hours
    const hourlyForecastUrl = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=${apiUnits}&cnt=25`;
    // Get daily forecast
    const dailyForecastUrl = `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=${apiUnits}&cnt=8`;
    // Get UV index
    const uvIndexUrl = `https://pro.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

    // Fetch all data in parallel
    const [currentWeatherResponse, hourlyForecastResponse, dailyForecastResponse, uvIndexResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(hourlyForecastUrl),
      fetch(dailyForecastUrl),
      fetch(uvIndexUrl),
    ]);

    if (!currentWeatherResponse.ok) throw new Error('Failed to fetch current weather.');
    if (!hourlyForecastResponse.ok) throw new Error('Failed to fetch hourly forecast.');
    if (!dailyForecastResponse.ok) throw new Error('Failed to fetch daily forecast.');
    if (!uvIndexResponse.ok) throw new Error('Failed to fetch UV index.');

    const current = await currentWeatherResponse.json();
    const hourly = await hourlyForecastResponse.json();
    const daily = await dailyForecastResponse.json();
    const uvIndex = await uvIndexResponse.json();

    // Combine the data into a single response
    const responseData = {
      current: current,
      hourly: hourly.list,
      daily: daily.list,
      city: hourly.city,
      uvi: uvIndex.value,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});