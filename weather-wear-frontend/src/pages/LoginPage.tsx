import { useState } from "react";
import { FaUser , FaLock} from "react-icons/fa";
import Sidebar from "../components/NavBar/NavBar.tsx";
import "../pages/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { loginWithEmailPassword } from "../lib/auth.ts";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // TODO: expand to sessionStorage
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await loginWithEmailPassword(email, password);
            if (error) throw error;

            // Supabase automatically persists session (localStorage)
            // Redirect to home page
            navigate("/");
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
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
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        {errorMsg && <div style={{ color: "#d9534f", fontSize: 12, marginBottom: 8 }}>{errorMsg}</div>}

                        <div className="button-group">
                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <button type="button" className="btn-signup"
                                    onClick={() => navigate("/signup")}>
                                Sign up
                            </button>
                        </div>

                        <div className="forgot-link">Forget Password?</div>
                    </form>
                </div>
            </div>
        </div>
    );
}