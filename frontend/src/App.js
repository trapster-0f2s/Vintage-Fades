import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import AdminPage from './components/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const services = [
    {
      id: 1,
      name: 'Classic Haircut',
      price: 35,
      duration: '45 min',
      description: 'Traditional haircut with precision styling and finishing touches'
    },
    {
      id: 2,
      name: 'Modern Fade',
      price: 45,
      duration: '60 min',
      description: 'Contemporary fade haircut with sharp edges and clean lines'
    },
    {
      id: 3,
      name: 'Beard Trim',
      price: 25,
      duration: '30 min',
      description: 'Professional beard shaping and grooming'
    },
    {
      id: 4,
      name: 'Hot Towel Shave',
      price: 40,
      duration: '45 min',
      description: 'Luxurious traditional shave with hot towels and premium products'
    },
    {
      id: 5,
      name: 'Hair & Beard Combo',
      price: 65,
      duration: '90 min',
      description: 'Complete grooming package with haircut and beard trim'
    },
    {
      id: 6,
      name: 'Kids Haircut',
      price: 25,
      duration: '30 min',
      description: 'Gentle and patient haircut service for children under 12'
    }
  ];

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
        {currentPage === 'home' && <HomePage services={services} setCurrentPage={setCurrentPage} />}
        {currentPage === 'booking' && <BookingPage services={services} setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin' && <AdminPage />}
      
    </div>
  );
}

export default App;