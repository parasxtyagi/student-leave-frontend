// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Combined imports and added BrowserRouter
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import HomeRedirect from './pages/HomeRedirect';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student" element={
                    <ProtectedRoute role="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<h1 className="text-center mt-10 text-xl">404 Page Not Found</h1>} />


            </Routes>
        </Router>
    );
}

export default App;