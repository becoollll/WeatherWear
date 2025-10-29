import '../WeatherSection/WeatherSection.css';

export default function WeatherSection() {
    return (
        <div className="weather-section">
            {/* Current Temperature */}
            <div className="weather-current">
                <span className="weather-icon">🌤️</span>
                <span className="weather-temp">52°F</span>
            </div>

            {/* Sunrise & Sunset */}
            <div className="weather-times">
                <div>☀️ 07:18</div>
                <div>🌙 18:00</div>
            </div>

            {/* Temperature Graph Placeholder */}
            <div className="weather-graph">Temperature Graph Placeholder</div>

            {/* Weekly Forecast */}
            <div className="weather-week">
                {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day) => (
                    <div key={day} className="weather-day">
                        <span className="day-icon">☀️</span>
                        <span className="day-name">{day}</span>
                        <span className="day-range">65° / 43°</span>
                    </div>
                ))}
            </div>

            {/* Weather Details */}
            <div className="weather-details">
                <div className="detail-item border-right">
                    <span>Feels Like</span>
                    <span>47°F</span>
                </div>
                <div className="detail-item">
                    <span>Humidity</span>
                    <span>61%</span>
                </div>
                <div className="detail-item border-right">
                    <span>UV Index</span>
                    <span>0</span>
                </div>
                <div className="detail-item">
                    <span>Precipitation</span>
                    <span>0</span>
                </div>
            </div>
        </div>
    );
}
