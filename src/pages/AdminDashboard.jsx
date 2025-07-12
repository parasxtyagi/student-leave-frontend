// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faSignOutAlt,
  faClipboardList,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarAlt,
  faUsers,
  faHourglassHalf,
  faBan,
  faTasks,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // ⭐ Import useAuth
import API from '../utils/axios'; // ⭐ Import the API instance

const AdminDashboard = () => {
  const { user, setUser } = useAuth(); // ⭐ Get user and setUser from AuthContext
  const [requests, setRequests] = useState([]);
  // ⭐ Removed local userName state, now using user.name from context
  const [notification, setNotification] = useState({ message: '', type: '' }); // For success/error messages
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  // Function to show transient notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  };

  // Function to fetch all leave requests
  const fetchLeaveRequests = async () => { // Renamed from fetchDashboardData
    try {
      // ⭐ Using API instance for backend calls
      const leaveRes = await API.get('/leave/all', { withCredentials: true });
      const fetchedRequests = leaveRes.data.leaves || [];
      setRequests(fetchedRequests);

      // Calculate leave statistics
      const approved = fetchedRequests.filter((leave) => leave.status === 'Approved').length;
      const pending = fetchedRequests.filter((leave) => leave.status === 'Pending').length;
      const rejected = fetchedRequests.filter((leave) => leave.status === 'Rejected').length;
      setLeaveStats({
        total: fetchedRequests.length,
        approved,
        pending,
        rejected,
      });
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);

      if (err.response && err.response.status === 401) {
        setUser(null); // ⭐ Clear user from context if auth fails
        navigate('/login');
      }
      showNotification(
        err.response?.data?.message || 'Failed to load leave requests. Please try again.',
        'error'
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      // ⭐ Using API instance for backend calls
      await API.put(`/leave/update/${id}`, { status }, { withCredentials: true });
      showNotification(`Leave request ${status.toLowerCase()} successfully!`, 'success');
      fetchLeaveRequests(); // Refresh requests after update
    } catch (err) {
      showNotification(err.response?.data?.message || `Failed to ${status.toLowerCase()} request.`, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      // ⭐ Using API instance for backend calls
      await API.post('/auth/logout', {}, { withCredentials: true });
      setUser(null); // ⭐ Clear user from context on logout
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
      showNotification(err.response?.data?.message || "Failed to logout.", 'error');
    }
  };

  useEffect(() => {
    fetchLeaveRequests(); // Fetch leave data on component mount
  }, [user]); // ⭐ Re-run effect if user context changes

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-100 font-sans">
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

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center mb-4 md:mb-0">
        <FontAwesomeIcon icon={faUserShield} className="text-indigo-600 mr-3" /> Welcome, {user?.name || 'Admin'}!
                </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
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
          <h4 className="text-md font-semibold text-gray-500">Total Requests</h4>
          <p className="text-4xl font-bold text-blue-700">{leaveStats.total}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-yellow-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Pending Requests</h4>
          <p className="text-4xl font-bold text-yellow-700">{leaveStats.pending}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-green-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Approved Leaves</h4>
          <p className="text-4xl font-bold text-green-700">{leaveStats.approved}</p>
        </motion.div>
        <motion.div
          className="bg-white p-5 rounded-xl shadow-md text-center border-l-4 border-red-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-md font-semibold text-gray-500">Rejected Leaves</h4>
          <p className="text-4xl font-bold text-red-700">{leaveStats.rejected}</p>
        </motion.div>
      </div>
      {/* End Summary Cards */}

      {/* Leave Requests Table */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faClipboardList} className="text-indigo-600 mr-2" /> All Leave Requests
        </h3>
        {requests.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left border-b-2 border-gray-200"><FontAwesomeIcon icon={faUsers} className="mr-2" />Student</th>
                  <th className="py-3 px-6 text-left border-b-2 border-gray-200">Email</th>
                  <th className="py-3 px-6 text-left border-b-2 border-gray-200"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />From</th>
                  <th className="py-3 px-6 text-left border-b-2 border-gray-200"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />To</th>
                  <th className="py-3 px-6 text-left border-b-2 border-gray-200">Reason</th>
                  <th className="py-3 px-6 text-center border-b-2 border-gray-200"><FontAwesomeIcon icon={faHourglassHalf} className="mr-2" />Status</th>
                  <th className="py-3 px-6 text-center border-b-2 border-gray-200"><FontAwesomeIcon icon={faTasks} className="mr-2" />Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                <AnimatePresence>
                  {requests.map((leave) => (
                    <motion.tr
                      key={leave._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {leave.studentId?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {leave.studentId?.email || 'N/A'}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {formatDate(leave.fromDate)}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
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
                      <td className="py-3 px-6 text-center space-x-2">
                        {leave.status === "Pending" && (
                          <>
                            <motion.button
                              onClick={() => updateStatus(leave._id, "Approved")}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 shadow-sm"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Approve
                            </motion.button>
                            <motion.button
                              onClick={() => updateStatus(leave._id, "Rejected")}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 shadow-sm"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} className="mr-1" /> Reject
                            </motion.button>
                          </>
                        )}

                        {leave.status !== "Pending" && (
                          <span className="text-gray-500 text-sm italic">
                            Actioned
                          </span>
                        )}
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
  );
};

export default AdminDashboard;