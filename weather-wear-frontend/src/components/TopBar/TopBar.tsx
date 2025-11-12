import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import { getCurrentUser, logout } from "../../lib/auth";
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

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        getCurrentUser().then(u => mounted && setUserEmail(u?.email ?? null));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email ?? null);
        });
        return () => {
            mounted = false;
            sub?.subscription?.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setUserEmail(null);
        navigate("/login");
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
                {userEmail ? (
                  <div className="login-link">
                    <span className="login-username">Hi, {userEmail}</span>{" | "}
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  </div>
                ) : (
                  <Link to="/login" className="login-link">Login | Register</Link>
                )}
                <a href="#" className="profile-section">
                    <img src={userPlaceholder} alt="User Profile" className="profile-img" />
                </a>
            </section>
        </header>
    );
}