import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import WardrobePage from "./pages/WardrobePage";
import EditPage from "./pages/EditPage";
import UpdatePage from "./pages/UpdatePage"; // <-- 1. Import the new UpdatePage
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import './App.css';
import { AuthProvider } from "./lib/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wardrobe" element={
                    <ProtectedRoute><WardrobePage /></ProtectedRoute>
                } />

                {/* Route for adding a NEW item (no ID parameter) */}
                <Route path="/edit" element={
                    <ProtectedRoute><EditPage /></ProtectedRoute>
                } />

                {/* Route for EDITING an existing item (requires ID parameter) */}
                <Route path="/edit/:id" element={
                    <ProtectedRoute><UpdatePage /></ProtectedRoute>
                } />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;