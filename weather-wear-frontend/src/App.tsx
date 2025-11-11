import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import WardrobePage from "./pages/WardrobePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wardrobe" element={<WardrobePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
    );
}

export default App;
