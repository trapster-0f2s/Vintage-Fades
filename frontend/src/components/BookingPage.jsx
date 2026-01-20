import React, { useState } from 'react';
import { Check, Clock } from 'lucide-react'; // Added Clock for the duration icon
import { bookingsAPI } from '../services/api';

const BookingPage = ({ services }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const handleBooking = async () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    if (!Object.values(bookingForm).every(val => val)) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        ...bookingForm,
        services: selectedServices.map(s => s.name),
        total: calculateTotal()
      };

      await bookingsAPI.create(bookingData);
      
      alert(`Booking confirmed for ${bookingForm.name}!\n\nServices: ${selectedServices.map(s => s.name).join(', ')}\nTotal: N$${calculateTotal()}\n\nWe'll send a confirmation to ${bookingForm.email}`);
      
      // Reset form
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: ''
      });
      setSelectedServices([]);
    } catch (error) {
      alert('Error creating booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Book Your Appointment</h2>
        <p className="text-gray-600">Select your services and preferred time slot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Services & Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Services Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Select Services</h3>
            {Object.entries(services).map(([category, serviceList]) => (
              <div key={category} className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-amber-600">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceList.map((service) => {
                    const isSelected = selectedServices.find(s => s.id === service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-lg">{service.name}</h5>
                          {isSelected && (
                            <div className="bg-amber-500 text-white p-1 rounded-full">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-amber-600">N${service.price}</span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock size={14} /> {service.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Your Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition bg-white"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg mt-6 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Price Calculator (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-6">
            <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
            
            {selectedServices.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">Select services to see pricing</p>
            ) : (
              <div className="space-y-4">
                {selectedServices.map((service, index) => (
                  <div key={`${service.id}-${index}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {service.name} <span className="text-xs text-gray-400">({service.duration})</span>
                    </span>
                    <span className="font-medium">N${service.price}</span>
                  </div>
                ))}
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>N${calculateTotal()}</span>
                </div>

                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex items-center gap-2 mt-4">
                  <Clock size={16} />
                  <span>
                    Total Duration: {selectedServices.reduce((sum, s) => {
                      const match = (s.duration || '').match(/(\d+)/);
                      return sum + (match ? parseInt(match[1]) : 0);
                    }, 0)} min
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;