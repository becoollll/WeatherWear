import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthProvider";
import "./TopBar.css";

import logo from "./raining.png";
import userPlaceholder from "./user.png";

interface TopBarProps {
  children?: ReactNode;
}

export default function TopBar({ children }: TopBarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      if (!user) {
        if (mounted) setDisplayName(null);
        return;
      }

      const email = user.email ?? null;
      
      // Default to showing email to avoid blank while waiting for profile
      if (mounted) setDisplayName(email);

      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      const username = (data as any)?.username as string | null;
      // If there is a username, display it; otherwise, keep showing the email
      if (username) {
          setDisplayName(username);
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user]); // When user changes (e.g., AuthProvider initialization completes), re-run

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="topbar-container">
      <section className="topbar-logo">
        <Link to="/">
          <img src={logo} alt="WeatherWear Logo" width="60" className="logo-img" />
        </Link>
        <Link to="/" className="brand-name">WeatherWear</Link>
      </section>

      {children}

      <section className="topbar-login">
        {user ? (
          <div className="login-link">
            <span className="login-username">
              Hi, {displayName}
            </span>{" "}
            |{" "}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="login-link">
            <Link to="/login" className="login-link">Login</Link>
            <span style={{ margin: "0 4px" }}>|</span>
            <Link to="/signup" className="login-link">Register</Link>
          </div>
        )}
        <a href="#" className="profile-section">
          <img src={userPlaceholder} alt="User Profile" className="profile-img" />
        </a>
      </section>
    </header>
  );
}