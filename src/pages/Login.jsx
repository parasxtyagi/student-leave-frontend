import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ⭐ Added setUser from useAuth
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post(
        '/auth/login',
        formData,
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setIsError(false);

      // ⭐ Set user in context immediately (so ProtectedRoute recognizes login)
      setUser(res.data.user);

      // 🚨 CRUCIAL DEBUGGING STEP: Log the role received from the backend
      console.log("Logged-in role from backend:", res.data.user.role);

      const role = res.data.user.role;
      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/student");
      }, 800); // ⭐ Changed timeout to 800ms

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      setIsError(true);
      console.error("Login error:", err);
    }
  };

  return (
    <motion.div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #6366F1, #4F46E5)',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: '#fff',
          padding: '2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '448px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#4F46E5', fontSize: '3rem', marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1F2937' }}>Student Leave Portal</h2>
          <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Sign in to manage your leave requests</p>
        </div>

        <input
          name="email"
          type="email"
          placeholder="University Email"
          onChange={handleChange}
          style={{
            width: '100%',
            border: '1px solid #D1D5DB',
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#6366F1';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={{
            width: '100%',
            border: '1px solid #D1D5DB',
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#6366F1';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              fontWeight: '500',
              backgroundColor: isError ? '#FEE2E2' : '#D1FAE5',
              color: isError ? '#991B1B' : '#065F46',
            }}
          >
            {message}
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          style={{
            width: '100%',
            backgroundColor: '#4F46E5',
            color: '#fff',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
        >
          Login
        </motion.button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#4F46E5',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#3730A3'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4F46E5'}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default Login;