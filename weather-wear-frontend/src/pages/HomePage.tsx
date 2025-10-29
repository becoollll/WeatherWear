// import React from 'react';
import TopBar from '../components/TopBar/TopBar.tsx';
import WeatherSection from '../components/WeatherSection/WeatherSection.tsx';
import Sidebar from "../components/NavBar/NavBar.tsx";
// import OutfitSection from '../components/OutfitSection';


// import OutfitSection from '../components/OutfitSection'; // Uncomment when ready

export default function HomePage() {
    return (
        <div className="flex w-full h-full bg-[#FAF7E9] overflow-hidden">
            {/* Sidebar Dropdown */}
            {/*<Sidebar />*/}

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <TopBar />
                <div className="flex justify-between items-center flex-1 overflow-hidden">
                    <WeatherSection />
                    {/* <OutfitSection /> */}
                </div>
            </div>
        </div>
    );
}

