// frontend/src/pages/VerifyOtp.jsx
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faRedoAlt, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Expects { email: 'user@example.com' }
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
  const [canResend, setCanResend] = useState(false);
  const email = state?.email; // Safely access email

  useEffect(() => {
    // Redirect if email is not present in state (e.g., direct access)
    if (!email) {
      navigate('/signup', { replace: true });
      showNotification('Please sign up first to get an OTP.', 'error');
    }

    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [email, navigate, resendTimer]); // Added email and navigate to dependency array

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000); // Notification disappears after 4 seconds
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
        showNotification('Email is missing. Please go back to signup.', 'error');
        return;
    }
    if (otp.length !== 4) {
        showNotification('OTP must be exactly 4 digits.', 'error');
        return;
    }
    try {
      const res = await axios.post('/api/auth/verify', {
        email: email,
        otp
      });
      showNotification(res.data.message, 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Give user time to read success message
    } catch (err) {
      showNotification(err.response?.data?.message || "OTP verification failed. Please try again.", 'error');
    }
  };

  const handleResendOtp = async () => {
    setCanResend(false);
    setResendTimer(60); // Reset timer
    try {
      const res = await axios.post('/api/auth/resend-otp', { email: email });
      showNotification(res.data.message, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to resend OTP.', 'error');
      setCanResend(true); // Allow resend if failed immediately
      setResendTimer(0);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } flex items-center space-x-2`}
          >
            <FontAwesomeIcon icon={notification.type === 'success' ? faCheckCircle : faExclamationCircle} />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-6">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-indigo-600 text-5xl mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600 text-md">
            We've sent a 4-digit code to <span className="font-semibold text-indigo-700">{email || 'your email'}</span>.
            Please enter it below to verify your account.
          </p>
        </div>

        <div>
          <label htmlFor="otp" className="sr-only">Enter OTP</label>
          <input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-2xl font-bold border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-400 transition-all duration-200 text-gray-800 placeholder-gray-400"
            maxLength={4}
            pattern="[0-9]{4}" // Enforce numeric and 4 digits
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            required
            autoComplete="off"
            inputMode="numeric" // Optimize for numeric input on mobile
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Verify OTP
        </motion.button>

        <div className="text-center pt-4 border-t border-gray-100 mt-6">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <motion.button
            type="button"
            onClick={handleResendOtp}
            className={`font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center mx-auto ${
              !canResend ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canResend}
            whileTap={{ scale: canResend ? 0.95 : 1 }}
          >
            <FontAwesomeIcon icon={faRedoAlt} className="mr-2" />
            {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
          </motion.button>
          <Link to="/signup" className="block mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Go back to Sign Up
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default VerifyOtp;