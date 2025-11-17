import { useState } from "react";
import { FaUser , FaLock} from "react-icons/fa";
import Sidebar from "../components/NavBar/NavBar.tsx";
import "../pages/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { loginWithEmailPassword } from "../lib/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // TODO: expand to sessionStorage
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    /*
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMsg, setResetMsg] = useState<string | null>(null);
    */
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

    /* reset password */
    /*
    const handleSendReset = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setResetMsg(null);
        if (!resetEmail.trim()) {
            setResetMsg("Please enter an email.");
            return;
        }
        try {
            // <-- log full response for debugging
            const res = await sendPasswordReset(resetEmail.trim(), {
                redirectTo: window.location.origin + "/login"
            });
            console.log("sendPasswordReset result:", res);
            if (res?.error) {
                console.error("sendPasswordReset error:", res.error);
                throw res.error;
            }
            setResetMsg("Password reset email sent. Check your inbox.");
        } catch (err: any) {
            console.error("reset error (caught):", err);
            setResetMsg(err?.message ?? "Failed to send reset email");
        }
    };
    */
   
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
                            <div style={{ marginLeft: 12 }}>
                                <span style={{ fontSize: 13, color: "#666" }}>
                                  Don't have an account?{" "}
                                  <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    style={{ background: "none", border: "none", color: "#2b9ecb", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                                  >
                                    Sign up here
                                  </button>
                                </span>
                            </div>
                        </div>

                        {/* Forgot password toggle */}
                        {/*
                        <div style={{ marginTop: 8 }}>
                            <button
                              type="button"
                              onClick={() => { setShowReset(!showReset); setResetMsg(null); }}
                              style={{ background: "none", border: "none", color: "#2b9ecb", cursor: "pointer", padding: 0 }}
                            >
                              Forgot password?
                            </button>
                        </div>

                        {showReset && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                style={{ height: 36, borderRadius: 8, padding: "0 8px", flex: 1 }}
                              />
                              <button
                                type="button"
                                onClick={() => handleSendReset()}
                                style={{ height: 36, borderRadius: 8, background: "#89e0df", border: "none", cursor: "pointer" }}
                              >
                                Send
                              </button>
                            </div>
                            {resetMsg && (
                              <div style={{ marginTop: 8, color: resetMsg.includes("sent") ? "green" : "#d9534f" }}>
                                {resetMsg}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="forgot-link" style={{ marginTop: 10 }}></div>
                        */}
                    </form>
                </div>
            </div>
        </div>
    );
}