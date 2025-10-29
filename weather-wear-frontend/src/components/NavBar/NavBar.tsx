import '../NavBar/NavBar.css';
import {useState} from "react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar-container">
            {/* Hamburger Button */}
            <div className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </div>

            {/* Dropdown Menu */}
            <div className={`sidebar-dropdown ${open ? 'open' : ''}`}>
                <ul>
                    <li>🏠 Home</li>
                    <li>👤 Profile</li>
                    <li>👕 Wardrobe</li>
                    {/*<li>⚙️ Settings</li>*/}
                    {/*<li>❓ Help</li>*/}
                </ul>
            </div>
        </div>
    );
}
