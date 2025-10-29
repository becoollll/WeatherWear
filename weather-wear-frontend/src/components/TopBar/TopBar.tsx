export default function TopBar() {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 w-1/2">
                <input
                    type="text"
                    placeholder="Enter Location"
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                />
                <span role="img" aria-label="map">📍</span>
                <span className="text-[#38BDF8] text-sm font-semibold">Alexandria, VA, USA</span>
            </div>
            <div className="text-gray-500 text-sm font-semibold cursor-pointer">
                🔐 Login | Register
            </div>
        </div>
    );
}
