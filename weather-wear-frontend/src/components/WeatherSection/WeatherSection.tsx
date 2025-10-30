import '../WeatherSection/WeatherSection.css';
import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import sunnyIcon from '../WeatherSection/Vector-2.png';
import partlyCloudyIcon from '../WeatherSection/Vector.png';
import rainyIcon from '../WeatherSection/Vector-4.png';
import cloudyIcon from '../WeatherSection/Vector-3.png';
import sunny from '../WeatherSection/Sun-Icon.png';
import sunRise from '../WeatherSection/Frame.png';
import sunSet from '../WeatherSection/Frame-2.png';

export default function WeatherSection() {
    const temperatureData = [
        { time: '8am', temp: 43 },
        { time: '11am', temp: 49 },
        { time: '2pm', temp: 55 },
        { time: '5pm', temp: 59 },
        { time: '8pm', temp: 52 },
        { time: '11pm', temp: 45 },
        { time: '2am', temp: 41 },
        { time: '4am', temp: 41 },
    ];

    const weeklyForecast = [
        { day: 'Thu', icon: partlyCloudyIcon, high: 65, low: 43 },
        { day: 'Fri', icon: partlyCloudyIcon, high: 60, low: 42 },
        { day: 'Sat', icon: sunnyIcon, high: 61, low: 42 },
        { day: 'Sun', icon: sunnyIcon, high: 61, low: 44 },
        { day: 'Mon', icon: cloudyIcon, high: 58, low: 46 },
        { day: 'Tue', icon: rainyIcon, high: 56, low: 46 },
        { day: 'Wed', icon: rainyIcon, high: 57, low: 47 },
        { day: 'Thu', icon: partlyCloudyIcon, high: 58, low: 46 },
    ];

    return (
        <div className="weather-ui-container">
            {/* Top section */}
            <div className="weather-main">
                <div className="weather-temp-icon">
                    <img
                        src={sunny}
                        alt="Current weather"
                        className="weather-main-icon"
                    />
                    <span className="weather-temp">52°F</span>
                </div>

                <div className="weather-times">
                    <div className="time-item">
                        <img src={sunRise} alt="Sunrise" className="time-icon" />
                        <span>07:18</span>
                    </div>
                    <div className="time-item">
                        <img src={sunSet} alt="Sunset" className="time-icon" />
                        <span>18:00</span>
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
                            interval={0}
                            padding={{ left: 0, right: 0 }}
                            tickMargin={8}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#38bdf8"
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
                        <span className="week-temp">{day.high}°</span>
                        <span className="week-low">{day.low}°</span>
                    </div>
                ))}
            </div>

            <div className="weather-details-grid">
                <div className="details-left">
                    <div>Feels Like</div>
                    <div>Humidity</div>
                    <div>UV Index</div>
                    <div>Precipitation</div>
                </div>
                <div className="divider" />
                <div className="details-right">
                    <div>47°F</div>
                    <div>61%</div>
                    <div>0</div>
                    <div>0</div>
                </div>
            </div>
        </div>
    );
}
