import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/NavBar/NavBar.tsx";
import "../pages/SignUpPage.css";

import sunglasses from "../components/OutfitSection/Frame-3.png";
import tshirt from "../components/OutfitSection/Vector-6.png";
import shorts from "../components/OutfitSection/Frame-4.png";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("Creating your account...");

        const { data, error } = await supabase
            .from("user")
            .insert([
                {
                    username: username,
                    email: email,
                    phone_number: phone,
                    password: password,
                },
            ])
            .select();

        if (error) {
            console.error("Supabase error:", error);
            setMessage(`Error: ${error.message}`);
            return;
        }

        console.log("User successfully created:", data);
        setMessage("Account created successfully!");

        setTimeout(() => navigate("/login"), 1500);
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
                                    required
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
                                    placeholder="Phone Number"
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

                            <button type="submit" className="btn-create">
                                Create Account
                            </button>

                            <div className="already-account">
                                Already have an account?{" "}
                                <span
                                    className="login-link"
                                    onClick={() => navigate("/login")}
                                >
                                    Login here
                                </span>
                            </div>
                        </form>

                        {message && <p className="signup-message">{message}</p>}
                    </div>

                    <div className="signup-right">
                        <img
                            src={sunglasses}
                            alt="Sunglasses"
                            className="signup-img sunglasses"
                        />
                        <img
                            src={tshirt}
                            alt="T-Shirt"
                            className="signup-img tshirt"
                        />
                        <img
                            src={shorts}
                            alt="Shorts"
                            className="signup-img shorts"
                        />
                    </div>
                    <div className="signup-tip">Check Your Daily Outfit!</div>
                </div>
            </div>
        </div>
    );
}
