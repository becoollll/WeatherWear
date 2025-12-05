import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaArrowLeft } from "react-icons/fa";
import { supabase } from '../supabaseClient';
import { useAuth } from "../lib/AuthProvider";
import Sidebar from "../components/NavBar/NavBar";
import "../pages/ProfilePage.css";

interface Profile {
    username: string | null;
    phone: string | null;
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        let mounted = true;
        if (!user) return;

        setEmail(user.email || "");

        async function fetchProfile() {
            setLoading(true);
            if (!user) return;

            // @ts-ignore
            const { data, error } = await supabase
                .from("profiles")
                .select("username, phone")
                .eq("id", user.id)
                .maybeSingle();

            if (!mounted) return;

            if (error) {
                console.error("Error fetching profile:", error);
                setMsg("Failed to load profile data.");
            } else if (data) {
                const profileData = data as Profile;
                setUsername(profileData.username ?? "");
                setPhone(profileData.phone ?? "");
            } else {
                setMsg("Profile not found. Please contact support.");
            }
            setLoading(false);
        }

        fetchProfile();

        return () => {
            mounted = false;
        };
    }, [user]);

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
            return "Please enter a valid email address.";
        }

        if (username && (username.length < 3 || username.length > 20)) {
            return "Username must be 3–20 characters.";
        }
        if (username && !/^[A-Za-z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers and underscore.";
        }
        if (phone && !/^[0-9+\-\s]+$/.test(phone)) {
            return "Phone number can only contain digits, +, -, and spaces.";
        }
        return null;
    };


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        setRedirecting(false);

        const validationError = validate();
        if (validationError) {
            setMsg(validationError);
            return;
        }

        if (!user) return;

        setLoading(true);
        let successMessage = "Profile updated successfully!";
        let shouldRedirect = true;

        const isEmailChanged = email.trim() !== user.email;
        if (isEmailChanged) {
            const { error: authError } = await supabase.auth.updateUser({ email: email.trim() });

            if (authError) {
                setLoading(false);
                console.error("Auth update error:", authError.message);
                setMsg(`Email update failed: ${authError.message}`);
                return;
            }
            successMessage = "Email change link sent. Please check your new inbox to confirm the change.";
            shouldRedirect = false;
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                username: username.trim() || null,
                phone: phone.trim() || null,
            })
            .eq("id", user.id)
            .select();

        setLoading(false);

        if (profileError) {
            console.error("Profile update error:", profileError.message);

            if (profileError.message.includes('duplicate key value') || profileError.message.includes('violates unique constraint')) {
                setMsg("Update failed: That username may already be taken.");
            } else {
                setMsg(`Profile update failed: ${profileError.message}`);
            }
            return;
        }

        setMsg(successMessage);

        if (shouldRedirect) {
            setRedirecting(true);
            setTimeout(() => {
                navigate("/");
            }, 1000);
        }
    };

    const RedirectBar = () => (
        <div className="redirect-bar">
            <FaArrowLeft className="redirect-icon" />
            <p className="redirect-text">Returning to Home Page...</p>
        </div>
    );


    if (loading) {
    }

    return (
        <div className="profilepage-container">
            <Sidebar />
            <div className="profile-content">
                <div className="profile-box">
                    <div className="profile-header">
                        <div className="profile-icon">
                            <FaUser size={40} color="white" />
                        </div>
                        <h2 className="profile-title">User Profile</h2>
                    </div>

                    <form className="profile-form" onSubmit={handleUpdate}>

                        <div className="input-group">
                            <span className="input-icon">
                                <FaEnvelope size={18} color="gray" />
                            </span>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ background: "#ffffff" }}
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-icon">
                                <FaUser size={18} color="gray" />
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-icon">
                                <FaPhone size={18} color="gray" />
                            </span>
                            <input
                                type="tel"
                                placeholder="Phone Number (optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-update" disabled={loading}>
                            {loading ? "Updating..." : "Update Profile"}
                        </button>

                        {msg && (
                            <div style={{ marginTop: 15, color: msg.includes("successfully") || msg.includes("sent") ? "green" : "#d9534f" }}>
                                {msg}
                            </div>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                style={{ background: "none", border: "none", color: "#2b9ecb", cursor: "pointer", padding: 0 }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {redirecting && <RedirectBar />}

        </div>
    );
}