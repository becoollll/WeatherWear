import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../TopBar/TopBar.css';

import logo from '../TopBar/raining.png';
import userPlaceholder from '../TopBar/user.png';
import search from '../TopBar/magnifying-glass.png';
import locationIcon from '../TopBar/Vector-5.png';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TopBar() {
    // State to hold location name
    const [locationName, setLocationName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // On component mount, get user's location
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        // Success callback for geolocation
        const success = async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;

            const { data, error: functionError } = await supabase.functions.invoke('get-location-from-coords', {
                body: { latitude, longitude },
            });

            if (functionError) {
                setError('Could not fetch location.');
                console.error('Supabase function error:', functionError);
            } else {
                setLocationName(data.location);
            }
        };

        const handleError = () => {
            setError('Location access denied.');
        };

        navigator.geolocation.getCurrentPosition(success, handleError);

    }, []);

    return (
        <header className="topbar-container">
            <section className="topbar-logo">
                <Link to="/">
                    <img
                        src={logo}
                        alt="WeatherWear Logo"
                        width="60"
                        className="logo-img"
                    />
                </Link>
                <Link to="/" className="brand-name">WeatherWear</Link>
            </section>

            <nav className="topbar-nav">
                <form className="location-form">
                    <input
                        type="text"
                        placeholder="Enter Location"
                        className="location-input"
                    />
                    <button type="submit" className="location-button">
                        <img
                            src={search}
                            alt="Search"
                            className="search-icon"
                        />
                    </button>
                </form>

                <div className="current-location">
                    <img
                        src={locationIcon}
                        alt="Location"
                        className="location-icon"
                    />
                    <span className="location-name">
                        {error ? error : locationName || 'Loading...'}
                    </span>
                </div>
            </nav>

            {/* Right section: login + user icon */}
            <section className="topbar-login">
                <Link to="/login" className="login-link">Login | Register</Link>
                <a href="#" className="profile-section">
                    <img
                        src={userPlaceholder}
                        alt="User Profile"
                        className="profile-img"
                    />
                </a>
            </section>
        </header>
    );
}
