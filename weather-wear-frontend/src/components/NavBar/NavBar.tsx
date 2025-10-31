import '../NavBar/NavBar.css';
import {useState} from "react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar-container">
            <div className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </div>

            <div className={`sidebar-dropdown ${open ? 'open' : ''}`}>
                <ul>
                    <li>🏠 Home</li>
                    <li>👤 Profile</li>
                    <li>👕 Wardrobe</li>
                </ul>
            </div>
        </div>
    );
}
