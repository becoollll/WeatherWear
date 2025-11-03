import '../WeatherSection/WeatherSection.css';
import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import sunRise from '../WeatherSection/Frame.png';
import sunSet from '../WeatherSection/Frame-2.png';

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

interface WeatherSectionProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  units: 'imperial' | 'metric';
}

// Helper function to format UNIX timestamp to HH:MM
const formatTime = (timestamp: number, timezoneOffset: number) => {
    const localTimestamp = timestamp + timezoneOffset;
    const date = new Date(localTimestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Helper function to get UVI description
const getUviDescription = (uvi: number): string => {
    const roundedUvi = Math.round(uvi);
    if (roundedUvi <= 2) return 'Low';
    if (roundedUvi <= 5) return 'Moderate';
    if (roundedUvi <= 7) return 'High';
    if (roundedUvi <= 10) return 'Very High';
    return 'Extreme';
};

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label, unitSymbol }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}.png`;

        return (
            <div className="custom-tooltip">
                <p className="tooltip-time">{label}</p>
                <div className="tooltip-details">
                    <img src={iconUrl} alt="weather icon" className="tooltip-icon" />
                    <p className="tooltip-label">{`${data.temp}°${unitSymbol}`}</p>
                </div>
            </div>
        );
    }
    return null;
};
export default function WeatherSection({ weatherData, isLoading, units }: WeatherSectionProps) {
    const unitSymbol = units === 'metric' ? 'C' : 'F';

    if (isLoading) {
        return <div className="weather-ui-container">Loading Weather...</div>;
    }

    if (!weatherData) {
        return <div className="weather-ui-container">Could not load weather data.</div>;
    }

    // Destructure necessary data
    const { current, hourly, daily, city, uvi } = weatherData;
    const { main, sys, weather } = current;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const temperatureData = hourly.map((hour, index) => {
        // The first label is "Now"
        const timeLabel = index === 0 
            ? 'Now' 
            : new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).toLowerCase();
        
        return {
            time: timeLabel,
            temp: Math.round(hour.main.temp),
            icon: hour.weather[0].icon, // Include icon code for tooltip
        };
    });

    const weeklyForecast = daily.slice(0, 7).map(day => { // Use slice to get next 7 days
        return {
            day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
            high: `${Math.round(day.temp.max)}°`,
            low: `${Math.round(day.temp.min)}°`,
        };
    });

    return (
        <div className="weather-ui-container">
            {/* Top section with REAL data */}
            <div className="weather-main">
                <div className="weather-temp-icon">
                    <div className="weather-icon-wrapper">
                        <img
                            src={iconUrl}
                            alt={weather[0].description}
                            className="weather-main-icon"
                        />
                        <p className="weather-description">{weather[0].description}</p>
                    </div>
                    <span className="weather-temp">{Math.round(main.temp)}°{unitSymbol}</span>
                </div>

                <div className="weather-times">
                    <div className="time-item">
                        <img src={sunRise} alt="Sunrise" className="time-icon" />
                        <span>{formatTime(sys.sunrise, city.timezone)}</span>
                    </div>
                    <div className="time-item">
                        <img src={sunSet} alt="Sunset" className="time-icon" />
                        <span>{formatTime(sys.sunset, city.timezone)}</span>
                    </div>
                </div>
            </div>

            <div className="weather-chart">
                <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={temperatureData} margin={{ left: 11, right: 11, top: 11 }}>
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            stroke="#707070"
                            fontSize={12}
                            interval="preserveStartEnd"
                            padding={{ left: 0, right: 0 }}
                            tickMargin={8}
                        />
                        <Tooltip content={<CustomTooltip unitSymbol={unitSymbol} />} />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#6AD4DD"
                            fill="url(#tempGradient)"
                            strokeWidth={3}
                            dot={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="weather-week-grid">
                {weeklyForecast.map((day) => (
                    <div key={day.day} className="weather-week-item">
                        <span className="week-day">{day.day}</span>
                        <img src={day.icon} alt={`${day.day} weather`} className="week-icon-img" />
                        <span className="week-temp">{day.high}{unitSymbol}</span>
                        <span className="week-low">{day.low}{unitSymbol}</span>
                    </div>
                ))}
            </div>

            {/* Additional Weather Details */}
            <div className="weather-details-table">
                <div className="detail-row">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{Math.round(main.feels_like)}°{unitSymbol}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{main.humidity}%</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Precipitation</span>
                    <span className="detail-value">{hourly[0]?.pop ? Math.round(hourly[0].pop * 100) : 0}%</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">UV Index</span>
                    <span className="detail-value">
                        {uvi != null ? (
                            <>
                                {Math.round(uvi)}
                                <span className="uvi-description"> / {getUviDescription(uvi)}</span>
                            </>
                        ) : (
                            'N/A'
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}
