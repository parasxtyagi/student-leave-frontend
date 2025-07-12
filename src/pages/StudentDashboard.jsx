import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faSignOutAlt,
  faCalendarPlus,
  faHistory,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarAlt,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axios';

const StudentDashboard = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    reason: '',
    fromDate: '',
    toDate: '',
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  // Fetch leave data
  const fetchLeaveData = async () => {
    try {
      const leaveRes = await API.get('/leave/my');
      const leaves = leaveRes.data.leaves || [];
      setLeaveHistory(leaves);

      // Calculate leave statistics
      const approved = leaves.filter((leave) => leave.status === 'Approved').length;
      const pending = leaves.filter((leave) => leave.status === 'Pending').length;
      const rejected = leaves.filter((leave) => leave.status === 'Rejected').length;
      setLeaveStats({
        total: leaves.length,
        approved,
        pending,
        rejected,
      });
    } catch (err) {
      console.error('Failed to fetch leave data:', err);

      // If authentication fails, clear user context and redirect to login
      if (err.response && err.response.status === 401) {
        setUser(null);
        navigate('/login');
      }
      showNotification(
        err.response?.data?.message || 'Failed to load dashboard data. Please try again.',
        'error'
      );
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      showNotification('From Date cannot be after To Date.', 'error');
      return;
    }
    if (new Date(formData.fromDate) < new Date().setHours(0, 0, 0, 0)) {
      showNotification('From Date cannot be in the past.', 'error');
      return;
    }

    try {
      // 🔴 FIXED: removed '/api'
      const res = await API.post('/leave/apply', formData);
      showNotification(res.data.message, 'success');
      setFormData({ reason: '', fromDate: '', toDate: '' });
      fetchLeaveData(); // Refresh leave history
    } catch (err) {
      showNotification(err.response?.data?.message || 'Leave application failed', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      showNotification(err.response?.data?.message || 'Failed to logout', 'error');
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Approved':
        return 'bg-green-600';
      case 'Rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return faClock;
      case 'Approved':
        return faCheckCircle;
      case 'Rejected':
        return faTimesCircle;
      default:
        return faExclamationCircle;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center mb-4 md:mb-0">
          <FontAwesomeIcon icon={faUserCircle} className="text-indigo-500 mr-3" /> Welcome, {user?.name || 'Student'}!
        </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
        </button>
      </div>
      {/* End Dashboard Header */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-blue-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Total Leaves</h4>
          <p className="text-4xl font-bold text-blue-700">{leaveStats.total}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-green-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Approved</h4>
          <p className="text-4xl font-bold text-green-700">{leaveStats.approved}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-yellow-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Pending</h4>
          <p className="text-4xl font-bold text-yellow-700">{leaveStats.pending}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-red-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Rejected</h4>
          <p className="text-4xl font-bold text-red-700">{leaveStats.rejected}</p>
        </motion.div>
      </div>
      {/* End Summary Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Application Form */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FontAwesomeIcon icon={faCalendarPlus} className="text-indigo-500 mr-2" /> Apply for Leave
          </h2>
          <form onSubmit={applyLeave} className="space-y-5">
            <div>
              <label htmlFor="reason" className="block text-gray-700 text-sm font-semibold mb-2">
                Reason for Leave
              </label>
              <input
                type="text"
                name="reason"
                id="reason"
                placeholder="e.g., Vacation, Sickness, Family Event"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                required
                onChange={handleChange}
                value={formData.reason}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromDate" className="block text-gray-700 text-sm font-semibold mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                  required
                  onChange={handleChange}
                  value={formData.fromDate}
                />
              </div>
              <div>
                <label htmlFor="toDate" className="block text-gray-700 text-sm font-semibold mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  id="toDate"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                  required
                  onChange={handleChange}
                  value={formData.toDate}
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" /> Submit Leave Request
            </motion.button>
          </form>
        </motion.div>

        {/* Leave History Table */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FontAwesomeIcon icon={faHistory} className="text-indigo-500 mr-2" /> Leave History
          </h3>
          {leaveHistory.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left border-b-2 border-gray-200">From</th>
                    <th className="py-3 px-6 text-left border-b-2 border-gray-200">To</th>
                    <th className="py-3 px-6 text-left border-b-2 border-gray-200">Reason</th>
                    <th className="py-3 px-6 text-center border-b-2 border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  <AnimatePresence>
                    {leaveHistory.map((leave) => (
                      <motion.tr
                        key={leave._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                          {formatDate(leave.fromDate)}
                        </td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                          {formatDate(leave.toDate)}
                        </td>
                        <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis">
                          {leave.reason}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(
                              leave.status
                            )}`}
                          >
                            <FontAwesomeIcon icon={getStatusIcon(leave.status)} className="mr-1" />
                            {leave.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
