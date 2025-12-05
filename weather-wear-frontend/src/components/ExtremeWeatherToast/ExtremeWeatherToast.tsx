import { useEffect, useState } from 'react';
import type { WeatherData } from '../../pages/HomePage';
import './ExtremeWeatherToast.css';

interface ExtremeWeatherAlert {
    type: 'danger' | 'warning';
    icon: string;
    message: string;
}

interface ExtremeWeatherToastProps {
    weatherData: WeatherData | null;
    units: 'metric' | 'imperial';
    show: boolean;
    onClose: () => void;
}

// Helper function to detect extreme weather conditions
function getExtremeWeatherAlerts(weatherData: WeatherData, units: 'metric' | 'imperial'): ExtremeWeatherAlert[] {
    const alerts: ExtremeWeatherAlert[] = [];
    const { current, hourly, uvi } = weatherData;
    const { main, weather, wind, visibility } = current;
    
    const feelsLike = main.feels_like;
    const weatherMain = weather[0]?.main?.toLowerCase() ?? '';
    const pop = hourly[0]?.pop ?? 0;

    // Temperature thresholds (adjusted based on units)
    const extremeHotThreshold = units === 'metric' ? 35 : 95;
    const extremeColdThreshold = units === 'metric' ? 0 : 32;
    const windSpeedThreshold = units === 'metric' ? 11 : 25; // m/s vs mph

    // Extreme heat
    if (feelsLike >= extremeHotThreshold) {
        alerts.push({
            type: 'danger',
            icon: '🥵',
            message: `Extreme heat alert! Feels like ${Math.round(feelsLike)}°. Wear light, breathable clothing and stay hydrated.`
        });
    }

    // Extreme cold
    if (feelsLike <= extremeColdThreshold) {
        alerts.push({
            type: 'danger',
            icon: '🥶',
            message: `Freezing temperature alert! Feels like ${Math.round(feelsLike)}°. Bundle up with warm layers.`
        });
    }

    // Extreme UV
    if (uvi >= 8) {
        alerts.push({
            type: 'warning',
            icon: '☀️',
            message: `Very high UV index (${Math.round(uvi)}). Wear sunscreen, sunglasses, and protective clothing.`
        });
    }

    // High chance of rain
    if (pop >= 0.7) {
        alerts.push({
            type: 'warning',
            icon: '🌧️',
            message: `High chance of rain (${Math.round(pop * 100)}%). Don't forget an umbrella or rain jacket!`
        });
    }

    // Strong winds
    if (wind.speed >= windSpeedThreshold) {
        alerts.push({
            type: 'warning',
            icon: '💨',
            message: `Strong winds (${Math.round(wind.speed)} ${units === 'metric' ? 'm/s' : 'mph'}). Secure loose items and dress accordingly.`
        });
    }

    // Low visibility
    if (visibility < 1000) {
        alerts.push({
            type: 'warning',
            icon: '🌫️',
            message: `Low visibility (${visibility}m). Be careful if traveling.`
        });
    }

    // Thunderstorm
    if (weatherMain.includes('thunderstorm')) {
        alerts.push({
            type: 'danger',
            icon: '⛈️',
            message: `Thunderstorm warning! Avoid outdoor activities if possible.`
        });
    }

    // Blizzard
    if (weatherMain.includes('snow') && wind.speed >= windSpeedThreshold) {
        alerts.push({
            type: 'danger',
            icon: '🌨️',
            message: `Blizzard conditions! Heavy snow with strong winds. Stay warm and safe.`
        });
    }

    return alerts;
}

export default function ExtremeWeatherToast({ weatherData, units, show, onClose }: ExtremeWeatherToastProps) {
    const [alerts, setAlerts] = useState<ExtremeWeatherAlert[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (weatherData && show) {
            const detectedAlerts = getExtremeWeatherAlerts(weatherData, units);
            setAlerts(detectedAlerts);
            if (detectedAlerts.length > 0) {
                setIsVisible(true);
            }
        }
    }, [weatherData, units, show]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    if (!isVisible || alerts.length === 0) return null;

    return (
        <div className={`extreme-weather-toast ${isVisible ? 'show' : 'hide'}`}>
            <div className="toast-header">
                <span className="toast-title">⚠️ Weather Alert</span>
                <button className="toast-close" onClick={handleClose}>×</button>
            </div>
            <div className="toast-body">
                {alerts.map((alert, index) => (
                    <div key={index} className={`alert-item ${alert.type}`}>
                        <span className="alert-icon">{alert.icon}</span>
                        <span className="alert-message">{alert.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
