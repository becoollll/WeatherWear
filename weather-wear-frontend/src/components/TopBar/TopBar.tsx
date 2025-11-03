import { useState } from 'react';
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
  onSearch: (location: string) => void;
}

export default function TopBar({ locationName, error, isLoading, currentUnit, onUnitChange, onSearch }: TopBarProps) {
    // State for the search input
    const [inputValue, setInputValue] = useState('');
    const handleToggle = () => {
        const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
        onUnitChange(newUnit);
    };

    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page reload
        onSearch(inputValue);
        setInputValue(''); // Clear input after search
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
                <form className="location-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="e.g., Alexandria, VA or 22305" 
                        className="location-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
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
                <span className={currentUnit === 'imperial' ? 'active' : ''}>°F</span>
                <span className="toggle-divider">/</span>
                <span className={currentUnit === 'metric' ? 'active' : ''}>°C</span>
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