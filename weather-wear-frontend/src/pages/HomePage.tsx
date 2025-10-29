// import React from 'react';
import TopBar from '../components/TopBar/TopBar.tsx';
import WeatherSection from '../components/WeatherSection/WeatherSection.tsx';
// import OutfitSection from '../components/OutfitSection';

export default function HomePage() {
    return (
        <div className="flex h-screen bg-[#FAF7E9]">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-[#7DD3FC] flex flex-col items-center justify-start p-4 text-white">
                <div className="mt-6 text-2xl font-semibold">☰</div>
            </div>

             Main Content
            <div className="flex-1 flex flex-col p-6">
                <TopBar />
                <div className="flex justify-between items-center flex-1">
                    <WeatherSection />
            {/*        <OutfitSection />*/}
                </div>
            </div>
        </div>
    );
}
