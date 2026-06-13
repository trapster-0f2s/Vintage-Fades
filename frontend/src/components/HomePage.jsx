import React from 'react';
import { CalendarCheck, Clock, Instagram, Mail, MapPin, Phone, Star } from 'lucide-react';
import { monthlySubscription } from '../data/services';

const heroImageUrl = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1800&q=85';

const instagramFeatures = [
  {
    title: 'Crispy and classic fades',
    copy: 'Fresh fades, tight blends, and clean finishes inspired by the shop reels and cut posts.'
  },
  {
    title: 'Facials with the finish',
    copy: 'Steam and facial add-ons are highlighted as part of the polished grooming experience.'
  },
  {
    title: 'Kids and back-to-school cuts',
    copy: 'Student and kids services are easy to book for school-ready cuts and quick lineups.'
  }
];

const HomePage = ({ setCurrentPage, services = {}, servicesNotice = '' }) => {
  const featuredServices = Object.entries(services).flatMap(([category, serviceList]) =>
    serviceList.slice(0, 2).map((service) => ({ ...service, category }))
  ).slice(0, 6);

  return (
    <main>
      <section
        className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-stone-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(12, 10, 9, 0.9), rgba(12, 10, 9, 0.66), rgba(12, 10, 9, 0.28)), url(${heroImageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-amber-200 ring-1 ring-white/15">
              <Star size={16} />
              LOOK GOOD. FEEL GOOD. STAY VINTAGE.
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Vintage Fades Barbershop
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
              Sharp fades, clean lineups, beard work, colour, facials, and combo services delivered in a polished shop experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage('booking')}
                className="rounded-md bg-amber-400 px-6 py-3 text-base font-black text-stone-950 transition hover:bg-amber-300"
              >
                Book an Appointment
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('membership')}
                className="rounded-md bg-white px-6 py-3 text-base font-black text-stone-950 transition hover:bg-amber-300"
              >
                Membership Plans
              </button>
              <a
                href="tel:+264814748665"
                className="rounded-md bg-white/10 px-6 py-3 text-base font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                Call the Shop
              </a>
              <a
                href="https://www.instagram.com/vintage_fades_barbershop/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-base font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <Instagram size={18} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-stone-500">Location</p>
            <p className="mt-1 text-lg font-bold">26 Van Rhijn Street</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-stone-500">Hours</p>
            <p className="mt-1 text-lg font-bold">Mon-Fri 9am-8pm</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-stone-500">Contact</p>
            <p className="mt-1 text-lg font-bold">+264 81 474 8665</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-amber-700">From Instagram</p>
            <h2 className="mt-2 text-4xl font-black text-stone-950">Fresh cuts, clean energy</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
              The public profile points to a sharp Windhoek shop identity: fresh fades, facials, kids cuts, and the Vintage Fades promise to look good, feel good, and stay vintage.
            </p>
            <a
              href="https://www.instagram.com/vintage_fades_barbershop/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-stone-950 px-5 py-3 text-sm font-black text-white transition hover:bg-stone-800"
            >
              <Instagram size={17} />
              Follow @vintage_fades_barbershop
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {instagramFeatures.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-stone-200 p-5">
                <p className="text-lg font-black text-stone-950">{feature.title}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-amber-700">Services</p>
              <h2 className="mt-2 text-4xl font-black text-stone-950">Built for a clean finish</h2>
            </div>
            {servicesNotice && (
              <p className="max-w-md rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                {servicesNotice}
              </p>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <div key={`${service.category}-${service.id}`} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-500">{service.category}</p>
                    <h3 className="mt-2 text-xl font-black">{service.name}</h3>
                  </div>
                  <p className="rounded-md bg-stone-950 px-3 py-2 text-lg font-black text-white">N${service.price}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">{service.description}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700">
                  <Clock size={16} />
                  {service.duration}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => setCurrentPage('booking')}
              className="rounded-md bg-stone-950 px-6 py-3 text-base font-black text-white transition hover:bg-stone-800"
            >
              View All Services and Book
            </button>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-amber-300">Monthly memberships</p>
            <h2 className="mt-2 text-4xl font-black">Stay sharp all month long</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-200">
              Look fresh every week without breaking the bank. Choose Gold, Platinum, Black Card, or claim the founding members rate before the first 50 slots are gone.
            </p>
            <p className="mt-6 inline-flex rounded-md bg-amber-400 px-4 py-3 text-2xl font-black text-stone-950">
              From N$400/month
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 text-stone-950">
            <p className="text-sm font-bold uppercase text-amber-700">{monthlySubscription.name}</p>
            <h3 className="mt-2 text-2xl font-black">N${monthlySubscription.price}/month for the first 50 members</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm font-semibold leading-6 text-stone-700">
              {monthlySubscription.signupSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage('membership')}
                className="inline-flex items-center gap-2 rounded-md bg-stone-950 px-5 py-3 text-sm font-black text-white transition hover:bg-stone-800"
              >
                <CalendarCheck size={17} />
                View Plans
              </button>
              <a
                href="tel:+264814748665"
                className="rounded-md bg-stone-100 px-5 py-3 text-sm font-black text-stone-950 transition hover:bg-stone-200"
              >
                Call First
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-amber-700">Visit</p>
            <h2 className="mt-2 text-4xl font-black text-stone-950">Walk in sharp, leave sharper</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
              Book ahead to lock in your preferred time, or get in touch for appointments, student pricing, kids cuts, and grooming combos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="mailto:vintagebarber.na@gmail.com" className="rounded-lg border border-stone-200 p-5 transition hover:border-amber-400">
              <Mail className="text-amber-700" size={26} />
              <p className="mt-4 text-sm font-semibold text-stone-500">Email</p>
              <p className="mt-1 break-words font-bold">vintagebarber.na@gmail.com</p>
            </a>
            <a href="tel:+264814748665" className="rounded-lg border border-stone-200 p-5 transition hover:border-amber-400">
              <Phone className="text-amber-700" size={26} />
              <p className="mt-4 text-sm font-semibold text-stone-500">Phone</p>
              <p className="mt-1 font-bold">+264 81 474 8665</p>
            </a>
            <div className="rounded-lg border border-stone-200 p-5">
              <MapPin className="text-amber-700" size={26} />
              <p className="mt-4 text-sm font-semibold text-stone-500">Address</p>
              <p className="mt-1 font-bold">26 Van Rhijn Street</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-5">
              <Clock className="text-amber-700" size={26} />
              <p className="mt-4 text-sm font-semibold text-stone-500">Opening Hours</p>
              <p className="mt-1 font-bold">Mon-Fri 9am-8pm</p>
              <p className="font-bold">Sat 9am-6pm, Sun 10am-5pm</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
