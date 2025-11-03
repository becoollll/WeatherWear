import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopBar from '../components/TopBar/TopBar.tsx';
import WeatherSection from '../components/WeatherSection/WeatherSection.tsx';
import Sidebar from '../components/NavBar/NavBar.tsx';
import OutfitSection from '../components/OutfitSection/OutfitSection.tsx';
import '../pages/HomePage.css';

interface Coordinates {
  latitude: number;
  longitude: number;
}
interface WeatherData {
  current: {
    main: { temp: number; temp_max: number; temp_min: number; feels_like: number; humidity: number };
    weather: { main: string; description: string; icon: string; }[];
    sys: { sunrise: number; sunset: number; };
    wind: { speed: number; };
    visibility: number;
  };
  hourly: {
    dt: number;
    main: { temp: number; };
    weather: { icon: string; }[];
    pop: number;
  }[];
  daily: {
    dt: number;
    temp: { min: number; max: number; };
    weather: { icon: string; }[];
  }[];
  city: {
    timezone: number;
  };
  uvi: number;
}

export default function HomePage() {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');

    useEffect(() => {
        const fetchData = async (coords: Coordinates, currentUnits: 'metric' | 'imperial') => {
            setIsLoading(true);
            try {
                const locationBody = { latitude: coords.latitude, longitude: coords.longitude };
                const weatherBody = { ...locationBody, units: currentUnits };

                // call the two functions in parallel
                const [locationRes, weatherRes] = await Promise.all([
                    supabase.functions.invoke('get-location-from-coords', { body: locationBody }),
                    supabase.functions.invoke('get-weather-by-coords', { body: weatherBody })
                ]);

                if (locationRes.error) throw new Error('Could not fetch location name.');
                // check weatherRes for error or invalid data
                if (weatherRes.error || !weatherRes.data) throw new Error('Could not fetch weather data.');

                setLocationName(locationRes.data.location);
                setWeatherData(weatherRes.data); // set all weather data

            } catch (e: any) {
                setError(e.message);
                console.error("Data fetching error:", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (!navigator.geolocation) {
            setError('Geolocation is not supported.');
            setIsLoading(false);
            return;
        }

        // Request user's location from browser
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchData(position.coords, units);
            },
            () => {
                setError('Location access denied.');
                setIsLoading(false);
            }
        );
    }, [units]);

    return (
        <div className="homepage-container">
            <Sidebar />
            <div className="main-content">
                <TopBar 
                    locationName={locationName} 
                    error={error} 
                    isLoading={isLoading}
                    currentUnit={units}
                    onUnitChange={setUnits}
                />
                <div className="main-sections">
                    <WeatherSection 
                        weatherData={weatherData} 
                        isLoading={isLoading} 
                        units={units}
                    />
                    <OutfitSection />
                </div>
            </div>
        </div>
    );
}
