import '../WeatherSection/WeatherSection.css';
import {AreaChart, Area, XAxis, Tooltip, ResponsiveContainer} from 'recharts';

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

    return (
        <div className="weather-ui-container">
            {/* Top section */}
            <div className="weather-main">
                <div className="weather-temp-icon">
                    {/*<span className="weather-icon">🌤️</span>*/}
                    <span className="weather-temp">52°F</span>
                </div>
                <div className="weather-times">
                    {/*<div>☀️ 07:18</div>*/}
                    {/*<div>🌙 18:00</div>*/}
                    <div>07:18</div>
                    <div>18:00</div>
                </div>
            </div>

            {/* Chart (filled area) */}
            <div className="weather-chart">
                <ResponsiveContainer width="100%" height={130}>
                    <AreaChart
                    data={temperatureData}
                    margin={{ left: 11, right: 11 }}
                    >
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6}/>
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>

                        {/*<XAxis dataKey="time" stroke="#707070" fontSize={12}/>*/}
                        <XAxis
                            dataKey="time"
                            stroke="#707070"
                            fontSize={12}
                            interval={0}            // ← shows every label
                            padding={{ left: 0, right: 0 }}  // ← removes automatic spacing
                            tickMargin={8}          // ← adds a little breathing room
                        />

                        {/*<YAxis dataKey="temp" stroke="#707070" fontSize={12}/>*/}
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

            {/*/!* Weekly forecast *!/*/}
            {/*<div className="weather-week">*/}
            {/*    {[*/}
            {/*        { day: 'Thu', icon: '🌤️', high: 65, low: 43 },*/}
            {/*        { day: 'Fri', icon: '☀️', high: 60, low: 42 },*/}
            {/*        { day: 'Sat', icon: '☀️', high: 61, low: 42 },*/}
            {/*        { day: 'Sun', icon: '☀️', high: 61, low: 44 },*/}
            {/*        { day: 'Mon', icon: '🌧️', high: 58, low: 46 },*/}
            {/*        { day: 'Tue', icon: '🌦️', high: 56, low: 47 },*/}
            {/*        { day: 'Wed', icon: '☀️', high: 57, low: 47 },*/}
            {/*    ].map((day) => (*/}
            {/*        <div key={day.day} className="forecast-day">*/}
            {/*            <span className="forecast-icon">{day.icon}</span>*/}
            {/*            <span className="forecast-name">{day.day}</span>*/}
            {/*            <span className="forecast-temp">*/}
            {/*                {day.high}° / {day.low}°*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/*/!* Weather Details *!/*/}
            {/*<div className="weather-details">*/}
            {/*    <div className="detail">*/}
            {/*        <span className="label">Feels Like</span>*/}
            {/*        <span className="value">47°F</span>*/}
            {/*    </div>*/}
            {/*    <div className="detail">*/}
            {/*        <span className="label">Humidity</span>*/}
            {/*        <span className="value">61%</span>*/}
            {/*    </div>*/}
            {/*    <div className="detail">*/}
            {/*        <span className="label">UV Index</span>*/}
            {/*        <span className="value">0</span>*/}
            {/*    </div>*/}
            {/*    <div className="detail">*/}
            {/*        <span className="label">Precipitation</span>*/}
            {/*        <span className="value">0%</span>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/* Weekly Forecast */}
            <div className="weather-week-grid">
                {[
                    // { day: 'Thu', icon: '🌤️', high: 65, low: 43 },
                    // { day: 'Fri', icon: '☀️', high: 60, low: 42 },
                    // { day: 'Sat', icon: '☀️', high: 61, low: 42 },
                    // { day: 'Sun', icon: '☀️', high: 61, low: 44 },
                    // { day: 'Mon', icon: '🌥️', high: 58, low: 46 },
                    // { day: 'Tue', icon: '🌧️', high: 56, low: 46 },
                    // { day: 'Wed', icon: '🌦️', high: 57, low: 47 },
                    // { day: 'Thu', icon: '🌤️', high: 58, low: 46 },
                    { day: 'Thu', icon: '', high: 65, low: 43 },
                    { day: 'Fri', icon: '️', high: 60, low: 42 },
                    { day: 'Sat', icon: '️', high: 61, low: 42 },
                    { day: 'Sun', icon: '️', high: 61, low: 44 },
                    { day: 'Mon', icon: '️', high: 58, low: 46 },
                    { day: 'Tue', icon: '️', high: 56, low: 46 },
                    { day: 'Wed', icon: '️', high: 57, low: 47 },
                    { day: 'Thu', icon: '️', high: 58, low: 46 },
                ].map((day) => (
                    <div key={day.day} className="weather-week-item">
                        <span className="week-day">{day.day}</span>
                        <span className="week-icon">{day.icon}</span>
                        <span className="week-temp">{day.high}°</span>
                        <span className="week-low">{day.low}°</span>
                    </div>
                ))}
            </div>

            {/* Weather Details */}
            <div className="weather-details-grid">
                <div className="details-left">
                    <div>Feels Like</div>
                    <div>Humidity</div>
                    <div>UV Index</div>
                    <div>Precipitation</div>
                </div>
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
