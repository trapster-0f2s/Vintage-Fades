import React from 'react';
import { Scissors } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="flex items-center gap-4 p-4 bg-black text-white"> {/* Added nav with basic styling */}
      <div 
        className="flex items-center gap-2 text-2xl font-bold cursor-pointer" 
        onClick={() => setCurrentPage('home')}
      >
        <Scissors size={32} /> {/* Added size for consistency */}
        Vintage Fades
      </div>
      
      <button 
        onClick={() => setCurrentPage('home')}
        className={`hover:text-amber-400 transition ${currentPage === 'home' ? 'text-amber-400' : ''}`}
      >
        Home
      </button>
      
      <button 
        onClick={() => setCurrentPage('booking')}
        className={`hover:text-amber-400 transition ${currentPage === 'booking' ? 'text-amber-400' : ''}`}
      >
        Services
      </button>
      
      <button 
        onClick={() => setCurrentPage('admin')}
        className={`hover:text-amber-400 transition ${currentPage === 'admin' ? 'text-amber-400' : ''}`}
      >
        Admin
      </button>
      
      <button 
        onClick={() => setCurrentPage('booking')}
        className="border-2 border-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
      >
        Book Now
      </button>
    </nav>
  );
};

export default Navigation;
