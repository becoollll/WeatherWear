import { useState } from "react";
import { FaUser , FaLock} from "react-icons/fa";
import Sidebar from "../components/NavBar/NavBar.tsx";
import "../pages/LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Logging in:", { username, password, rememberMe });
    };

    return (
        <div className="loginpage-container">
            <Sidebar />
            <div className="login-content">
                <div className="login-box">
                    <div className="login-icon">
                        <FaUser size={40} color="white" />
                    </div>
                    <h2 className="login-title">Login</h2>

                    <form className="login-form" onSubmit={handleLogin}>
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

                        <div className="remember-section">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />{" "}
                                Remember me
                            </label>
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn-login">
                                Login
                            </button>
                            <button type="button" className="btn-signup"
                                    onClick={() => navigate("/signup")}>
                                Sign up
                            </button>
                        </div>

                        <div className="forgot-link">Forget Username / Password?</div>
                    </form>
                </div>
            </div>
        </div>
    );
}