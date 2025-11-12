import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import WardrobePage from "./pages/WardrobePage";
import EditPage from "./pages/EditPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wardrobe" element={<WardrobePage />} />
            <Route path="/edit/:id" element={<EditPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
    );
}

export default App;
