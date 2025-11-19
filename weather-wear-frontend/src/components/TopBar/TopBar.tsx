import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import { getCurrentUser, logout } from "../../lib/auth";
import '../TopBar/TopBar.css';

import logo from '../TopBar/raining.png';
import userPlaceholder from '../TopBar/user.png';

interface TopBarProps {
  children?: ReactNode;
}

export default function TopBar({ children }: TopBarProps) {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null); // username or email

    useEffect(() => {
        let mounted = true;

        async function loadUserAndProfile() {
          const u = await getCurrentUser();
          if (!mounted) return;

          const email = u?.email ?? null;
          setUserEmail(email);

          if (u?.id) {
            const { data } = await supabase
              .from("profiles")
              .select("username")
              .eq("id", u.id)
              .maybeSingle();

            if (!mounted) return;

            const username = (data as any)?.username as string | null;
            setDisplayName(username || email);
          } else {
            setDisplayName(email);
          }
        }

        loadUserAndProfile();

        const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!session?.user) {
            setUserEmail(null);
            setDisplayName(null);
            return;
          }

          const email = session.user.email ?? null;
          setUserEmail(email);

          const { data } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .maybeSingle();

          const username = (data as any)?.username as string | null;
          setDisplayName(username || email);
        });

        return () => {
            mounted = false;
            sub?.subscription?.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setUserEmail(null);
        setDisplayName(null);
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
                {userEmail ? (
                  <div className="login-link">
                    <span className="login-username">Hi, {displayName ?? userEmail}</span>{" | "}
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
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