import React, { useMemo, useState } from 'react';
import { AlertCircle, Check, Clock, Scissors } from 'lucide-react';
import {
  calculateBookingPricing,
  getEstimatedDuration,
  getTimeOptions,
  getTodayInputValue,
  monthlySubscription
} from '../data/services';
import { bookingsAPI } from '../services/api';

const getApiError = (error) => {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors)) return data.errors.map((item) => item.msg).join(', ');
  return 'We could not create the booking. Please try again.';
};

const subscriptionOptions = [
  {
    value: 'none',
    title: 'Pay as you go',
    description: 'Pay the normal menu price for this appointment.'
  },
  {
    value: 'active',
    title: 'I have a monthly pass',
    description: 'Enter the phone or name linked to your active pass. One eligible cut value is covered.'
  },
  {
    value: 'signup',
    title: 'Sign me up',
    description: `Add the ${monthlySubscription.name} for N$${monthlySubscription.price} and cover today's eligible cut value.`
  }
];

const BookingPage = ({ services = {}, setCurrentPage }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    subscriptionStatus: 'none',
    subscriptionReference: ''
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const timeOptions = useMemo(() => getTimeOptions(bookingForm.date), [bookingForm.date]);
  const pricing = useMemo(
    () => calculateBookingPricing(selectedServices, bookingForm.subscriptionStatus),
    [selectedServices, bookingForm.subscriptionStatus]
  );
  const total = pricing.total;
  const duration = getEstimatedDuration(selectedServices);
  const wantsSubscription = bookingForm.subscriptionStatus !== 'none';
  const hasSubscriptionCut = wantsSubscription && pricing.subscriptionDiscount > 0;

  const updateForm = (field, value) => {
    setBookingForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'date') {
        const availableTimes = getTimeOptions(value).map((option) => option.value);
        if (!availableTimes.includes(next.time)) {
          next.time = '';
        }
      }
      if (field === 'subscriptionStatus' && value !== 'active') {
        next.subscriptionReference = '';
      }
      return next;
    });
    setNotice(null);
  };

  const toggleService = (service) => {
    setSelectedServices((current) => {
      const exists = current.some((item) => item.id === service.id);
      return exists
        ? current.filter((item) => item.id !== service.id)
        : [...current, service];
    });
    setNotice(null);
  };

  const validateForm = () => {
    if (selectedServices.length === 0) return 'Choose at least one service.';
    if (wantsSubscription && !hasSubscriptionCut) {
      return 'Choose a haircut, fade, lineup, trim, or bald service to use the monthly subscription.';
    }
    if (bookingForm.subscriptionStatus === 'active' && !bookingForm.subscriptionReference.trim()) {
      return 'Enter the phone or name linked to your monthly subscription.';
    }
    if (!bookingForm.name.trim()) return 'Enter your full name.';
    if (!bookingForm.phone.trim()) return 'Enter your phone number.';
    if (!bookingForm.date) return 'Choose a booking date.';
    if (!bookingForm.time) return 'Choose a booking time.';
    return '';
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setNotice({ type: 'error', message: validationMessage });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      await bookingsAPI.create({
        ...bookingForm,
        serviceIds: selectedServices.map((service) => service.id),
        services: selectedServices.map((service) => service.name)
      });

      setNotice({
        type: 'success',
        message: `Booking confirmed for ${bookingForm.name}. Total due: N$${total}.`
      });
      setBookingForm({
        name: '',
        phone: '',
        date: '',
        time: '',
        subscriptionStatus: 'none',
        subscriptionReference: ''
      });
      setSelectedServices([]);
    } catch (error) {
      setNotice({ type: 'error', message: getApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-fit text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            Back to Home
          </button>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-amber-700">Appointments</p>
            <h1 className="mt-2 text-4xl font-black text-stone-950 sm:text-5xl">Book your next cut</h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Choose your services, pick a time during opening hours, and the shop will receive your confirmed appointment.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleBooking} className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-8">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-amber-700">Step 1</p>
                <h2 className="mt-1 text-2xl font-black">Select services</h2>
              </div>
              <Scissors className="text-stone-400" size={24} />
            </div>

            <div className="mt-6 space-y-8">
              {Object.entries(services || {}).map(([category, serviceList]) => (
                <div key={category}>
                  <h3 className="text-base font-black text-stone-800">{category}</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {serviceList.map((service) => {
                      const isSelected = selectedServices.some((item) => item.id === service.id);
                      return (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => toggleService(service)}
                          aria-pressed={isSelected}
                          className={`min-h-[150px] rounded-lg border-2 p-4 text-left transition ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-stone-200 bg-white hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-lg font-black text-stone-950">{service.name}</h4>
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                              isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-400'
                            }`}>
                              <Check size={16} />
                            </span>
                          </div>
                          <p className="mt-2 min-h-[42px] text-sm leading-6 text-stone-600">{service.description}</p>
                          <div className="mt-4 flex items-center justify-between text-sm font-bold">
                            <span className="text-amber-700">N${service.price}</span>
                            <span className="inline-flex items-center gap-1 text-stone-500">
                              <Clock size={14} />
                              {service.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold uppercase text-amber-700">Step 2</p>
            <h2 className="mt-1 text-2xl font-black">Monthly subscription</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {monthlySubscription.description}
            </p>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {subscriptionOptions.map((option) => {
                const isSelected = bookingForm.subscriptionStatus === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateForm('subscriptionStatus', option.value)}
                    aria-pressed={isSelected}
                    className={`rounded-lg border-2 p-4 text-left transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-md ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-400'
                    }`}>
                      <Check size={16} />
                    </span>
                    <span className="block text-base font-black text-stone-950">{option.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-stone-600">{option.description}</span>
                  </button>
                );
              })}
            </div>

            {bookingForm.subscriptionStatus === 'active' && (
              <label className="mt-5 block">
                <span className="text-sm font-bold text-stone-700">Subscription phone or name</span>
                <input
                  type="text"
                  value={bookingForm.subscriptionReference}
                  onChange={(event) => updateForm('subscriptionReference', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  placeholder="Name or phone used for the monthly pass"
                  autoComplete="off"
                />
              </label>
            )}

            {bookingForm.subscriptionStatus === 'signup' && (
              <div className="mt-5 rounded-lg bg-stone-950 p-5 text-white">
                <p className="text-sm font-bold uppercase text-amber-300">How sign-up works</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-100">
                  {monthlySubscription.signupSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="mt-4 text-sm font-bold text-amber-200">
                  The pass adds N${monthlySubscription.price} today and applies one eligible cut credit to this booking.
                </p>
              </div>
            )}

            {wantsSubscription && (
              <p className={`mt-5 rounded-md px-4 py-3 text-sm font-semibold ${
                hasSubscriptionCut
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-amber-50 text-amber-900'
              }`}>
                {hasSubscriptionCut
                  ? `${pricing.coveredService.name} is eligible for the monthly pass credit.`
                  : 'Select a haircut, fade, lineup, trim, or bald service to activate the pass logic.'}
              </p>
            )}
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold uppercase text-amber-700">Step 3</p>
            <h2 className="mt-1 text-2xl font-black">Your details</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-stone-700">Full name</span>
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-stone-700">Phone</span>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(event) => updateForm('phone', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  placeholder="+264 81 234 5678"
                  autoComplete="tel"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-stone-700">Date</span>
                <input
                  type="date"
                  min={getTodayInputValue()}
                  value={bookingForm.date}
                  onChange={(event) => updateForm('date', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-stone-700">Time</span>
                <select
                  value={bookingForm.time}
                  onChange={(event) => updateForm('time', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Select time</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {notice && (
              <div className={`mt-6 flex items-start gap-3 rounded-md p-4 text-sm font-semibold ${
                notice.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {notice.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                <span>{notice.message}</span>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black">Booking summary</h2>
            {selectedServices.length === 0 ? (
              <p className="mt-6 rounded-md bg-stone-100 px-4 py-8 text-center text-sm font-semibold text-stone-500">
                Select services to build your appointment.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-bold text-stone-900">{service.name}</p>
                      <p className="text-stone-500">{service.duration}</p>
                    </div>
                    <p className="font-black">N${service.price}</p>
                  </div>
                ))}
                <div className="h-px bg-stone-200" />
                <div className="flex justify-between text-sm font-bold text-stone-600">
                  <span>Subtotal</span>
                  <span>N${pricing.subtotal}</span>
                </div>
                {pricing.subscriptionDiscount > 0 && (
                  <div className="flex justify-between gap-4 text-sm font-bold text-emerald-700">
                    <span>Monthly pass credit</span>
                    <span>-N${pricing.subscriptionDiscount}</span>
                  </div>
                )}
                {pricing.subscriptionCharge > 0 && (
                  <div className="flex justify-between gap-4 text-sm font-bold text-stone-700">
                    <span>{monthlySubscription.name}</span>
                    <span>N${pricing.subscriptionCharge}</span>
                  </div>
                )}
                <div className="h-px bg-stone-200" />
                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>N${total}</span>
                </div>
                <p className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
                  <Clock size={16} />
                  Estimated duration: {duration} min
                </p>
                {bookingForm.subscriptionStatus !== 'none' && (
                  <p className="rounded-md bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700">
                    {bookingForm.subscriptionStatus === 'active'
                      ? 'Existing monthly pass selected.'
                      : 'Monthly pass signup will be added to this booking.'}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-md bg-stone-950 px-5 py-4 text-base font-black text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </section>
        </aside>
      </form>
    </main>
  );
};

export default BookingPage;
