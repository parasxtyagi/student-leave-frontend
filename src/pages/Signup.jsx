import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

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
      const res = await axios.post('/api/auth/signup', formData);
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
            e.currentTarget.style.borderColor = '#10B981';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />

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
            e.currentTarget.style.borderColor = '#10B981';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
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
            e.currentTarget.style.borderColor = '#10B981';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />

        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          style={{
            width: '100%',
            border: '1px solid #D1D5DB',
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: '#fff',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.5em 1.5em',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#10B981';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
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
          style={{
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
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
        >
          Register
        </motion.button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#10B981',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.color = '#10B981'}
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default Signup;