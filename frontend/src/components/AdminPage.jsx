import React, { useState, useEffect } from 'react';
import { bookingsAPI, authAPI } from '../services/api';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newBooking, setNewBooking] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    services: [],
    total: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchBookings();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(password);
      localStorage.setItem('adminToken', response.data.token);
      setIsLoggedIn(true);
      setLoginError('');
      fetchBookings();
    } catch (err) {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setBookings([]);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.delete(id);
        fetchBookings();
      } catch (err) {
        alert('Failed to delete booking');
        console.error(err);
      }
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.create(newBooking);
      setShowAddForm(false);
      setNewBooking({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        services: [],
        total: 0
      });
      fetchBookings();
    } catch (err) {
      alert('Failed to add booking');
      console.error(err);
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setNewBooking({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      services: booking.services,
      total: booking.total
    });
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.update(editingId, newBooking);
      setEditingId(null);
      setNewBooking({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        services: [],
        total: 0
      });
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewBooking({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      services: [],
      total: 0
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && (
              <div className="text-red-500 text-sm text-center">{loginError}</div>
            )}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Admin Dashboard</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : 'Add Booking'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Booking' : 'Add New Booking'}
          </h3>
          <form onSubmit={editingId ? handleUpdateBooking : handleAddBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newBooking.name}
                onChange={(e) => setNewBooking({...newBooking, name: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newBooking.email}
                onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newBooking.phone}
                onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Total"
                value={newBooking.total}
                onChange={(e) => setNewBooking({...newBooking, total: parseFloat(e.target.value) || 0})}
                className="border p-2 rounded"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Services (comma separated)"
              value={newBooking.services.join(', ')}
              onChange={(e) => setNewBooking({...newBooking, services: e.target.value.split(',').map(s => s.trim())})}
              className="border p-2 rounded w-full"
              required
            />
            <div className="space-x-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Booking
              </button>
              <button type="button" onClick={editingId ? cancelEdit : () => setShowAddForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold">All Bookings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.services.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => startEdit(booking)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {bookings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;