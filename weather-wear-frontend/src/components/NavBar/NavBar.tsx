import '../NavBar/NavBar.css';
import {useState} from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar-container">
            <div className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </div>

            <div className={`sidebar-dropdown ${open ? 'open' : ''}`}>
                <ul>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                    <li>🏠 Home</li>
                    <li>👤 Profile</li>
                    <li>👕 Wardrobe</li>
=======
=======
>>>>>>> Stashed changes
                    <Link to = "/"> <li><FaHome size={15} color="white" />{" "} Home</li> </Link>
                    <li><FaUser size={15} color="white" />{" "} Profile</li>
                    <li><FaTshirt size={15} color="white" />{" "} Wardrobe</li>
>>>>>>> Stashed changes
                </ul>
            </div>
        </div>
    );
}
