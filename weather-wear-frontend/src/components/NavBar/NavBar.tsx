import '../NavBar/NavBar.css';
import { FaUser, FaHome, FaTshirt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="sidebar-container">
            <div className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </div>

            <div className={`sidebar-dropdown ${open ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => navigate("/")}>
                        <FaHome size={15} color="white" />{" "} Home
                    </li>
                    <li onClick={() => navigate("/profile")}>
                        <FaUser size={15} color="white" />{" "} Profile
                    </li>

                    <Link to="/wardrobe" style={{ textDecoration: "none" }}>
                        <li>
                            <FaTshirt size={15} color="white" />{" "} Wardrobe
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}