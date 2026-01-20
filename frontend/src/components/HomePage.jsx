import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const HomePage = ({ setCurrentPage, services = [] }) => { // Default empty array for safety
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 space-y-16"> {/* Added responsive container */}
      
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="text-amber-400">Vintage Fades Barbershop</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Step into Vintage Fades, where precision meets style. Our barbers are dedicated to providing contemporary haircuts and grooming services in a relaxed, welcoming atmosphere. Experience the difference today!
          </p>
          <button 
            onClick={() => setCurrentPage('booking')}
            className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Unleash Your Style with Vintage Fades</h2>
        <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          At Vintage Fades, we blend traditional barbering with modern techniques to deliver exceptional grooming experiences. Our team is dedicated to providing personalized consultations and precise haircuts that reflect your unique style and preferences. Step into our studio and discover the difference.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl">
            <span className="text-4xl mb-4">10+</span>
            <p>Top-notch barbering and grooming</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl">
            <span className="text-4xl mb-4">98%</span>
            <p>Client satisfaction rate, reflecting our commitment to excellence</p>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Premium Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.slice(0, 4).map((service, index) => (
            <div key={service.id || index} className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700 transition"> {/* Added key */}
              <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-amber-400">N${service.price}</span>
                <span className="text-sm text-gray-400">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button 
            onClick={() => setCurrentPage('booking')}
            className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition"
          >
            View All Services & Book
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Reach out to us for appointments, inquiries, or feedback. We're here to keep you looking sharp!
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl space-y-4">
            <Mail size={32} className="text-amber-400" />
            <a href="mailto:vintagebarber.na@gmail.com" className="text-xl font-semibold hover:text-amber-400 transition">vintagebarber.na@gmail.com </a>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl space-y-4">
            <Phone size={32} className="text-amber-400" />
            <a href="tel:+2648147486695" className="text-xl font-semibold hover:text-amber-400 transition">+264 81 474 86695</a>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl space-y-4 md:col-span-2">
            <MapPin size={32} className="text-amber-400" />
            <p className="text-xl font-semibold">26 Van Rhijn Street</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl space-y-4 md:col-span-2">
            <Clock size={32} className="text-amber-400" />
            <div className="space-y-1 text-left">
              <p>Mon-Fri: 9am - 8pm</p>
              <p>Sat: 9am - 6pm</p>
              <p>Sun: 10am - 5pm</p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
};

export default HomePage;
