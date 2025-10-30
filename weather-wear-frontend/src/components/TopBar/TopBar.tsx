import { Link } from 'react-router-dom';
import '../TopBar/TopBar.css';

import logo from '../TopBar/raining.png';
import userPlaceholder from '../TopBar/user.png';
import search from '../TopBar/magnifying-glass.png';
import locationIcon from '../TopBar/Vector-5.png';

export default function TopBar() {
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
                    <span className="location-name">Alexandria, VA</span>
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
