import React from 'react';
import { CalendarCheck, Instagram } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navButtonClass = (page) => (
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      currentPage === page
        ? 'bg-amber-400 text-stone-950'
        : 'text-stone-200 hover:bg-white/10 hover:text-white'
    }`
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-left text-xl font-black tracking-normal"
          aria-label="Go to Vintage Fades home"
        >
          <img
            src="/vintage-fades-logo.svg"
            alt="Vintage Fades logo"
            className="h-11 w-11 rounded-md object-cover ring-1 ring-amber-300/50"
          />
          <span>Vintage Fades</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className={navButtonClass('home')}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('booking')}
            className={navButtonClass('booking')}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('membership')}
            className={navButtonClass('membership')}
          >
            Membership
          </button>
          <a
            href="https://www.instagram.com/vintage_fades_barbershop/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-200 transition hover:bg-white/10 hover:text-white"
          >
            <Instagram size={16} />
            Instagram
          </a>
          <button
            type="button"
            onClick={() => setCurrentPage('booking')}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-stone-950 transition hover:bg-amber-300"
          >
            <CalendarCheck size={16} />
            Book
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
