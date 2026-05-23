import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  Clock3,
  DollarSign,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  XCircle
} from 'lucide-react';
import {
  authAPI,
  bookingsAPI,
  clearStoredToken,
  getStoredToken,
  setStoredToken
} from '../services/api';

const emptyEditForm = {
  name: '',
  phone: '',
  date: '',
  time: '',
  services: ''
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const toDateInputValue = (dateString) => {
  if (!dateString) return '';
  return String(dateString).slice(0, 10);
};

const formatCurrency = (value) => `N$${Number(value || 0).toLocaleString('en-NA')}`;

const servicesToText = (services) => (
  Array.isArray(services) ? services.join(', ') : ''
);

const parseServices = (value) => (
  value.split(',').map((service) => service.trim()).filter(Boolean)
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase text-stone-500">{label}</p>
        <p className="mt-2 text-3xl font-black text-stone-950">{value}</p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-amber-800">
        <Icon size={22} />
      </span>
    </div>
  </div>
);

const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(password);
      setStoredToken(response.data.token);
      onLogin(response.data.token);
      setPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase text-amber-700">Vintage Fades</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Enter the admin password to manage appointments and booking status.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-bold text-stone-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-stone-950 px-5 py-3 font-black text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
};

const AdminPage = () => {
  const [token, setToken] = useState(getStoredToken());
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const logout = () => {
    clearStoredToken();
    setToken('');
    setBookings([]);
    setEditingId(null);
  };

  const fetchDashboard = async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const [bookingsResponse, statsResponse] = await Promise.all([
        bookingsAPI.getAll({ includePast: true }),
        bookingsAPI.getStats()
      ]);
      setBookings(bookingsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        setError('Your session expired. Please sign in again.');
      } else {
        setError(err?.response?.data?.message || 'Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const refreshInterval = setInterval(fetchDashboard, 15 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [token]);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch = !term || [
        booking.name,
        booking.phone,
        servicesToText(booking.services)
      ].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const updateStatus = async (id, status) => {
    setSaving(true);
    setError('');
    try {
      await bookingsAPI.updateStatus(id, status);
      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return;

    setSaving(true);
    setError('');
    try {
      await bookingsAPI.delete(id);
      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete booking.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      name: booking.name || '',
      phone: String(booking.phone || ''),
      date: toDateInputValue(booking.date),
      time: booking.time || '',
      services: servicesToText(booking.services)
    });
  };

  const handleUpdateBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await bookingsAPI.update(editingId, {
        name: editForm.name,
        phone: editForm.phone,
        date: editForm.date,
        time: editForm.time,
        services: parseServices(editForm.services)
      });
      setEditingId(null);
      setEditForm(emptyEditForm);
      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update booking.');
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return <LoginView onLogin={setToken} />;
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-stone-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-amber-300">Vintage Fades</p>
            <h1 className="mt-1 text-3xl font-black">Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-stone-950 transition hover:bg-amber-300"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total Bookings" value={stats.total} />
          <StatCard icon={CheckCircle} label="Confirmed" value={stats.confirmed} />
          <StatCard icon={Clock3} label="Completed" value={stats.completed} />
          <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.totalRevenue)} />
        </section>

        {editingId && (
          <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-amber-700">Edit booking</p>
                <h2 className="mt-1 text-2xl font-black">Appointment details</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditForm(emptyEditForm);
                }}
                className="rounded-md p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
                aria-label="Cancel editing"
              >
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateBooking} className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                className="rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={editForm.phone}
                onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })}
                className="rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                required
              />
              <input
                type="date"
                value={editForm.date}
                onChange={(event) => setEditForm({ ...editForm, date: event.target.value })}
                className="rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                required
              />
              <input
                type="time"
                value={editForm.time}
                onChange={(event) => setEditForm({ ...editForm, time: event.target.value })}
                className="rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                required
              />
              <input
                type="text"
                placeholder="Services, comma separated"
                value={editForm.services}
                onChange={(event) => setEditForm({ ...editForm, services: event.target.value })}
                className="rounded-md border border-stone-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 md:col-span-2"
                required
              />
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-stone-950 px-5 py-3 font-black text-white transition hover:bg-stone-800 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditForm(emptyEditForm);
                  }}
                  className="rounded-md bg-stone-200 px-5 py-3 font-black text-stone-800 transition hover:bg-stone-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8 rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-stone-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-amber-700">Bookings</p>
              <h2 className="mt-1 text-2xl font-black">Appointments</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search bookings"
                  className="w-full rounded-md border border-stone-300 py-2 pl-10 pr-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 sm:w-72"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
              <thead className="bg-stone-100 text-xs font-black uppercase text-stone-600">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Services</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center font-semibold text-stone-500">Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center font-semibold text-stone-500">No bookings found.</td>
                  </tr>
                ) : filteredBookings.map((booking) => (
                  <tr key={booking._id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-black text-stone-950">{booking.name}</p>
                      <p className="mt-1 text-stone-500">{booking.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold">{formatDate(booking.date)}</p>
                      <p className="mt-1 text-stone-500">{booking.time}</p>
                    </td>
                    <td className="max-w-xs px-4 py-4 text-stone-600">{servicesToText(booking.services)}</td>
                    <td className="px-4 py-4 font-black">{formatCurrency(booking.total)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={booking.status}
                        onChange={(event) => updateStatus(booking._id, event.target.value)}
                        disabled={saving}
                        className="rounded-md border border-stone-300 px-3 py-2 font-semibold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(booking)}
                          className="rounded-md bg-amber-100 p-2 text-amber-800 transition hover:bg-amber-200"
                          aria-label={`Edit ${booking.name}`}
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBooking(booking._id)}
                          className="rounded-md bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                          aria-label={`Delete ${booking.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
