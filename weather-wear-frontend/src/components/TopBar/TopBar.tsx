import { Link } from 'react-router-dom';
import '../TopBar/TopBar.css';

import logo from '../TopBar/raining.png';
import userPlaceholder from '../TopBar/user.png';
import search from '../TopBar/magnifying-glass.png';
import locationIcon from '../TopBar/Vector-5.png';

interface TopBarProps {
  locationName: string | null;
  error: string | null;
  isLoading: boolean;
  currentUnit: 'metric' | 'imperial';
  onUnitChange: (unit: 'metric' | 'imperial') => void;
}

export default function TopBar({ locationName, error, isLoading, currentUnit, onUnitChange }: TopBarProps) {
    const handleToggle = () => {
        const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
        onUnitChange(newUnit);
    };

    return (
        <header className="topbar-container">
            <section className="topbar-logo">
                <Link to="/">
                    <img src={logo} alt="WeatherWear Logo" width="60" className="logo-img" />
                </Link>
                <Link to="/" className="brand-name">WeatherWear</Link>
            </section>

            <nav className="topbar-nav">
                <form className="location-form">
                    <input type="text" placeholder="Enter Location" className="location-input" />
                    <button type="submit" className="location-button">
                        <img src={search} alt="Search" className="search-icon" />
                    </button>
                </form>

                <div className="current-location">
                    <img src={locationIcon} alt="Location" className="location-icon" />
                    <span className="location-name">
                        {isLoading ? 'Loading...' : (error || locationName)}
                    </span>
                </div>
            </nav>
            <div className="unit-toggle" onClick={handleToggle}>
                <span className={currentUnit === 'metric' ? 'active' : ''}>°C</span>
                <span className="toggle-divider">/</span>
                <span className={currentUnit === 'imperial' ? 'active' : ''}>°F</span>
            </div>
            <section className="topbar-login">
                <Link to="/login" className="login-link">Login | Register</Link>
                <a href="#" className="profile-section">
                    <img src={userPlaceholder} alt="User Profile" className="profile-img" />
                </a>
            </section>
        </header>
    );
}