import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import Sidebar from "../components/NavBar/NavBar.tsx";
import "../pages/SignUpPage.css";

import sunglasses from "../components/OutfitSection/Frame-3.png";
import tshirt from "../components/OutfitSection/Vector-6.png";
import shorts from "../components/OutfitSection/Frame-4.png";

import { signUpWithEmailPassword } from "../lib/auth";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const navigate = useNavigate();

    const validate = () => {
        if (!email.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return "Please enter a valid email.";

        if (!password) return "Password is required.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            return "Password must contain at least one letter and one number.";
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        const validationError = validate();
        if (validationError) {
            setMsg(validationError);
            return;
        }

        setLoading(true);
        const res = await signUpWithEmailPassword({
            email: email.trim(),
            password,
            username: username.trim() || undefined,
            phone: phone.trim() || undefined,
        });
        setLoading(false);

        if (res.error) {
            const raw = res.error.message ?? "";
            if (raw.toLowerCase().includes("already registered")) {
                setMsg("This email is already registered.");
            } else if (raw.toLowerCase().includes("duplicate key")) {
                setMsg("This account information is already used.");
            } else {
                setMsg(raw || "Sign up failed. Please try again.");
            }
            return;
        }

        setMsg("Sign up successful. Please log in.");
        navigate("/login");
    };

    return (
        <div className="signuppage-container">
            <Sidebar />
            <div className="signup-content">
                <div className="signup-box">
                    <div className="signup-left">
                        <div className="signup-header">
                            <div className="signup-icon">
                                <FaUser size={40} color="white" />
                            </div>
                            <h2 className="signup-title">Sign up</h2>
                        </div>

                        <form className="signup-form" onSubmit={handleSignUp}>
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
                                    <FaEnvelope size={18} color="gray" />
                                </span>
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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

                            <div className="input-group">
                                <span className="input-icon">
                                    <FaLock size={18} color="gray" />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-create" disabled={loading}>
                                {loading ? "Creating..." : "Create Account"}
                            </button>

                            {msg && (
                                <div style={{ marginTop: 8, color: msg.includes("successful") ? "green" : "#d9534f" }}>
                                    {msg}
                                </div>
                            )}

                            <div className="already-account">
                                Already have an account?{" "}
                                <span className="login-link" onClick={() => navigate("/login")}>
                                    Login here
                                </span>
                            </div>
                        </form>
                    </div>

                    <div className="signup-right">
                        <img src={sunglasses} alt="Sunglasses" className="signup-img sunglasses" />
                        <img src={tshirt} alt="T-Shirt" className="signup-img tshirt" />
                        <img src={shorts} alt="Shorts" className="signup-img shorts" />
                    </div>
                    <div className="signup-tip">Check Your Daily Outfit!</div>
                </div>
            </div>
        </div>
    );
}