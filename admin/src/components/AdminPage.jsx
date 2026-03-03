import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';

const AdminPage = () => {
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
    fetchBookings();
  }, []);

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
              value={newBooking.services}
              onChange={(e) => setNewBooking({...newBooking, services: e.target.value.split(',').map(s => s.trim())})}
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Time</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((bk) => (
            <tr key={bk._id} className="text-center">
              <td className="py-2 px-4 border">{bk.name}</td>
              <td className="py-2 px-4 border">{bk.email}</td>
              <td className="py-2 px-4 border">{bk.phone}</td>
              <td className="py-2 px-4 border">{bk.date}</td>
              <td className="py-2 px-4 border">{bk.time}</td>
              <td className="py-2 px-4 border">{bk.total}</td>
              <td className="py-2 px-4 border">
                <select
                  value={bk.status}
                  onChange={(e) => updateStatus(bk._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="py-2 px-4 border space-x-2">
                <button
                  onClick={() => startEdit(bk)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBooking(bk._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
