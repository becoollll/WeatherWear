import TopBar from '../components/TopBar/TopBar.tsx';
import WeatherSection from '../components/WeatherSection/WeatherSection.tsx';
import Sidebar from '../components/NavBar/NavBar.tsx';
import '../pages/HomePage.css';

export default function HomePage() {
    return (
        <div className="homepage-container">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                    <div className="flex justify-between items-start w-full h-full">
                        <WeatherSection />
                        {/*<OutfitSection /> */}
                    </div>
                {/*    <WeatherSection />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
