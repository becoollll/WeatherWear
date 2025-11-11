import '../NavBar/NavBar.css';
import { FaUser, FaHome, FaTshirt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                    <li>
                        <FaUser size={15} color="white" />{" "} Profile
                    </li>
                    <li>
                        <FaTshirt size={15} color="white" />{" "} Wardrobe
                    </li>
                </ul>
            </div>
        </div>
    );
}