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
    coord: any;
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
    const [initialCoords, setInitialCoords] = useState<Coordinates | null>(null);
    
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported.');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                // Save initial coordinates for fallback
                setInitialCoords(coords);
                fetchData(coords, units);
            },
            () => {
                setError('Location access denied.');
                setIsLoading(false);
            }
        );
    }, []);

    const fetchData = async (coords: Coordinates, currentUnits: 'metric' | 'imperial') => {
        setIsLoading(true);
        setError(null);
        try {
            const locationBody = { latitude: coords.latitude, longitude: coords.longitude };
            const weatherBody = { ...locationBody, units: currentUnits };

            const [locationRes, weatherRes] = await Promise.all([
                supabase.functions.invoke('get-location-from-coords', { body: locationBody }),
                supabase.functions.invoke('get-weather-by-coords', { body: weatherBody })
            ]);

            if (locationRes.error) throw new Error('Could not fetch location name.');
            if (weatherRes.error || !weatherRes.data) throw new Error('Could not fetch weather data.');

            setLocationName(locationRes.data.location);
            setWeatherData(weatherRes.data);

        } catch (e: any) {
            setError(e.message);
            console.error("Data fetching error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (searchLocation: string) => {
        if (!searchLocation.trim()) return; // empty, do nothing

        setIsLoading(true);
        try {
            // call the function to get coordinates from location name
            const { data: coordsData, error: coordsError } = await supabase.functions.invoke('get-coords-from-location', {
                body: { locationName: searchLocation }
            });

            if (coordsError || !coordsData) {
                throw new Error(`Invalid location: "${searchLocation}"`);
            }

            await fetchData(coordsData, units);

        } catch (e: any) {
            alert(e.message);
            if (initialCoords) {
                await fetchData(initialCoords, units);
            } else {
                setError("Could not revert to initial location.");
                setIsLoading(false);
            }
        }
    };

    const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
        setUnits(newUnit);
        if (weatherData) {
            // use current weatherData coordinates to fetch new data
            const currentCoords = {
                latitude: weatherData.current.coord.lat,
                longitude: weatherData.current.coord.lon
            };
            fetchData(currentCoords, newUnit);
        }
    };

    return (
        <div className="homepage-container">
            <Sidebar />
            <div className="main-content">
                <TopBar 
                    locationName={locationName} 
                    error={error} 
                    isLoading={isLoading}
                    currentUnit={units}
                    onUnitChange={handleUnitChange}
                    onSearch={handleSearch}
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
