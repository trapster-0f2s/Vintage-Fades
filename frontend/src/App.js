import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import AdminPage from './components/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const services = {
    'Service Price': [
      { id: 1, name: 'Normal Haircut', price: 120, duration: '45 min', description: 'Traditional haircut with precision styling' },
      { id: 2, name: 'Lineup', price: 80, duration: '30 min', description: 'Clean and sharp lineup' },
      { id: 3, name: 'Bald', price: 100, duration: '30 min', description: 'Complete bald shave' },
      { id: 4, name: 'Beard Trim', price: 30, duration: '20 min', description: 'Professional beard shaping' },
      { id: 5, name: 'Enhancement', price: 30, duration: '20 min', description: 'Hair enhancement treatment' },
      { id: 6, name: 'Full Color', price: 60, duration: '60 min', description: 'Full hair coloring' },
      { id: 7, name: 'Facial & Steam', price: 80, duration: '45 min', description: 'Facial treatment with steam' },
      { id: 8, name: 'Line Design', price: 30, duration: '20 min', description: 'Custom line design' }
    ],
    'Students Service Price': [
      { id: 9, name: 'Haircut', price: 100, duration: '45 min', description: 'Student haircut' },
      { id: 10, name: 'Haircut + Color', price: 140, duration: '90 min', description: 'Haircut with coloring for students' },
      { id: 11, name: 'Trim (Lineup)', price: 50, duration: '30 min', description: 'Trim and lineup for students' },
      { id: 12, name: 'Haircut + Facials', price: 170, duration: '90 min', description: 'Haircut with facial for students' },
      { id: 13, name: 'Haircut + Enhancer', price: 120, duration: '75 min', description: 'Haircut with enhancer for students' },
      { id: 14, name: 'Full Combo (Facial + Color + Haircut)', price: 200, duration: '120 min', description: 'Complete combo for students' }
    ],
    'Kids (11 & below)': [
      { id: 15, name: 'Haircut', price: 80, duration: '30 min', description: 'Gentle haircut for kids' },
      { id: 16, name: 'Lineup', price: 30, duration: '20 min', description: 'Lineup for kids' },
      { id: 17, name: 'Line Design', price: 20, duration: '15 min', description: 'Line design for kids' }
    ],
    'Combo Price': [
      { id: 18, name: 'Haircut + Beard Trim', price: 150, duration: '65 min', description: 'Haircut and beard trim combo' },
      { id: 19, name: 'Haircut + Color', price: 180, duration: '105 min', description: 'Haircut with color combo' },
      { id: 20, name: 'Haircut + Facial', price: 200, duration: '90 min', description: 'Haircut with facial combo' },
      { id: 21, name: 'Haircut + Enhancement', price: 150, duration: '65 min', description: 'Haircut with enhancement combo' },
      { id: 22, name: 'Haircut + Color + Facial', price: 260, duration: '135 min', description: 'Complete combo with haircut, color, and facial' }
    ]
  };

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