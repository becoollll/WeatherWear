import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import WardrobePage from "./pages/WardrobePage";
import EditPage from "./pages/EditPage";
import UpdatePage from "./pages/UpdatePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import './App.css';
import { AuthProvider } from "./lib/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/wardrobe" element={
                    <ProtectedRoute><WardrobePage /></ProtectedRoute>
                } />

                <Route path="/edit" element={
                    <ProtectedRoute><EditPage /></ProtectedRoute>
                } />

                <Route path="/edit/:id" element={
                    <ProtectedRoute><UpdatePage /></ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
            </Routes>
        </AuthProvider>
    );
}

export default App;