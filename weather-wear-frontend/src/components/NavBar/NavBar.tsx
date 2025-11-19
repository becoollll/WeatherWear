import '../NavBar/NavBar.css';
import { FaUser, FaHome, FaTshirt, FaBars } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { path: "/", label: "Home", icon: <FaHome size={20} /> },
        { path: "/wardrobe", label: "Wardrobe", icon: <FaTshirt size={20} /> },
        // { path: "/profile", label: "Profile", icon: <FaUser size={20} /> },
    ];

    return (
        <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                <div className="hamburger" onClick={toggleSidebar}>
                    <FaBars />
                </div>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li 
                        key={item.path} 
                        className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}