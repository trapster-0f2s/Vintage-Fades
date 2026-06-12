import React, { useEffect, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import { normalizeServiceCatalog, serviceCatalog } from './data/services';
import { servicesAPI } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [services, setServices] = useState(serviceCatalog);
  const [servicesNotice, setServicesNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    servicesAPI.getAll()
      .then((response) => {
        if (isMounted && response.data?.categories) {
          setServices(normalizeServiceCatalog(response.data.categories));
          setServicesNotice('');
        }
      })
      .catch(() => {
        if (isMounted) {
          setServicesNotice('Using the saved menu while the live service list is unavailable.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="App bg-stone-50 text-stone-950">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && (
        <HomePage
          services={services}
          servicesNotice={servicesNotice}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'booking' && (
        <BookingPage
          services={services}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default App;
