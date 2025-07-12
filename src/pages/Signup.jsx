import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import API from '../utils/axios'; // ⭐ Added API import

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post( // ⭐ Updated to API.post
        '/auth/signup', // ⭐ Removed VITE_BACKEND_URL
        formData,
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setIsError(false);

      setTimeout(() => {
        navigate("/verify", { state: { email: formData.email } });
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setMessage(errorMessage);
      setIsError(true);
      console.error("Signup error:", err);
    }
  };

  return (
    <motion.div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #34D399, #10B981)',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleSignup}
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
          <FontAwesomeIcon icon={faUserPlus} style={{ color: '#10B981', fontSize: '3rem', marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1F2937' }}>Create Your Account</h2>
          <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Join the Student Leave Portal</p>
        </div>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          placeholder="University Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          style={inputStyle}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

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
          style={buttonStyle}
        >
          Register
        </motion.button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={linkStyle}
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

const inputStyle = {
  width: '100%',
  border: '1px solid #D1D5DB',
  padding: '0.875rem 1rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: '#fff',
  transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#10B981',
  color: '#fff',
  padding: '1rem',
  borderRadius: '0.5rem',
  fontWeight: '600',
  fontSize: '1.125rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const linkStyle = {
  color: '#10B981',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out',
};

export default Signup;