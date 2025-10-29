export default function WeatherSection() {
    return (
        <div className="flex flex-col justify-center w-2/3 pl-12">
            {/* Current Temp */}
            <div className="text-[90px] font-bold text-[#38BDF8] flex items-center gap-3">
                <span className="text-6xl">🌤️</span>
                52°F
            </div>

            {/* Sunrise / Sunset */}
            <div className="flex gap-8 mt-2 text-[#38BDF8] font-semibold">
                <div>☀️ 07:18</div>
                <div>🌙 18:00</div>
            </div>

            {/* Graph Placeholder */}
            <div className="mt-6 w-3/4 h-32 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#38BDF8] italic">
                Temperature Graph Placeholder
            </div>

            {/* Weekly Forecast */}
            <div className="flex justify-between w-3/4 mt-8 text-gray-700">
                {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day) => (
                    <div key={day} className="flex flex-col items-center text-sm">
                        <span className="text-2xl">☀️</span>
                        <span>{day}</span>
                        <span className="text-xs">65° / 43°</span>
                    </div>
                ))}
            </div>

            {/* Weather Details */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-gray-800 font-semibold text-lg w-3/4">
                <div className="flex justify-between border-r pr-4">
                    <span>Feels Like</span>
                    <span>47°F</span>
                </div>
                <div className="flex justify-between">
                    <span>Humidity</span>
                    <span>61%</span>
                </div>
                <div className="flex justify-between border-r pr-4">
                    <span>UV Index</span>
                    <span>0</span>
                </div>
                <div className="flex justify-between">
                    <span>Precipitation</span>
                    <span>0</span>
                </div>
            </div>
        </div>
    );
}
