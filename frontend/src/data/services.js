export const serviceCatalog = {
  'Service Price': [
    { id: 1, name: 'Normal Haircut', price: 120, duration: '45 min', subscriptionCredit: 120, description: 'Traditional haircut with precision styling' },
    { id: 2, name: 'Lineup', price: 80, duration: '30 min', subscriptionCredit: 80, description: 'Clean and sharp lineup' },
    { id: 3, name: 'Bald', price: 100, duration: '30 min', subscriptionCredit: 100, description: 'Complete bald shave' },
    { id: 4, name: 'Beard Trim', price: 30, duration: '20 min', description: 'Professional beard shaping' },
    { id: 5, name: 'Enhancement', price: 30, duration: '20 min', description: 'Hair enhancement treatment' },
    { id: 6, name: 'Full Color', price: 60, duration: '60 min', description: 'Full hair coloring' },
    { id: 7, name: 'Facial & Steam', price: 80, duration: '45 min', description: 'Facial treatment with steam' },
    { id: 8, name: 'Line Design', price: 30, duration: '20 min', description: 'Custom line design' }
  ],
  'Students Service Price': [
    { id: 9, name: 'Haircut', price: 100, duration: '45 min', subscriptionCredit: 100, description: 'Student haircut' },
    { id: 10, name: 'Haircut + Color', price: 140, duration: '90 min', subscriptionCredit: 100, description: 'Haircut with coloring for students' },
    { id: 11, name: 'Trim (Lineup)', price: 50, duration: '30 min', subscriptionCredit: 50, description: 'Trim and lineup for students' },
    { id: 12, name: 'Haircut + Facials', price: 170, duration: '90 min', subscriptionCredit: 100, description: 'Haircut with facial for students' },
    { id: 13, name: 'Haircut + Enhancer', price: 120, duration: '75 min', subscriptionCredit: 100, description: 'Haircut with enhancer for students' },
    { id: 14, name: 'Full Combo (Facial + Color + Haircut)', price: 200, duration: '120 min', subscriptionCredit: 100, description: 'Complete combo for students' }
  ],
  'Kids (11 & below)': [
    { id: 15, name: 'Haircut', price: 80, duration: '30 min', subscriptionCredit: 80, description: 'Gentle haircut for kids' },
    { id: 16, name: 'Lineup', price: 30, duration: '20 min', subscriptionCredit: 30, description: 'Lineup for kids' },
    { id: 17, name: 'Line Design', price: 20, duration: '15 min', description: 'Line design for kids' }
  ],
  'Combo Price': [
    { id: 18, name: 'Haircut + Beard Trim', price: 150, duration: '65 min', subscriptionCredit: 120, description: 'Haircut and beard trim combo' },
    { id: 19, name: 'Haircut + Color', price: 180, duration: '105 min', subscriptionCredit: 120, description: 'Haircut with color combo' },
    { id: 20, name: 'Haircut + Facial', price: 200, duration: '90 min', subscriptionCredit: 120, description: 'Haircut with facial combo' },
    { id: 21, name: 'Haircut + Enhancement', price: 150, duration: '65 min', subscriptionCredit: 120, description: 'Haircut with enhancement combo' },
    { id: 22, name: 'Haircut + Color + Facial', price: 260, duration: '135 min', subscriptionCredit: 120, description: 'Complete combo with haircut, color, and facial' }
  ],
  'Instagram Picks': [
    { id: 23, name: 'Crispy Fade', price: 120, duration: '45 min', subscriptionCredit: 120, description: 'A sharp fade inspired by the shop reels and fresh-cut posts' },
    { id: 24, name: 'Classic Fade', price: 120, duration: '45 min', subscriptionCredit: 120, description: 'Clean classic fade with a polished Vintage Fades finish' },
    { id: 25, name: 'Back-to-School Cut', price: 100, duration: '45 min', subscriptionCredit: 100, description: 'Student-friendly fresh cut for school days and photo days' },
    { id: 26, name: 'Facials + Crispy Fade', price: 200, duration: '90 min', subscriptionCredit: 120, description: 'Crispy fade paired with a facial and steam refresh' },
    { id: 27, name: 'Fade + Line Design', price: 150, duration: '65 min', subscriptionCredit: 120, description: 'Fresh fade finished with a custom line design' }
  ]
};

export const monthlySubscription = {
  id: 'monthly-fresh-pass',
  name: 'Monthly Fresh Pass',
  price: 450,
  cadence: 'monthly',
  description: 'Covers the cut, fade, lineup, trim, or bald value on eligible bookings. Beard, colour, facial, enhancement, and line-design add-ons remain payable.',
  signupSteps: [
    'Choose the monthly pass option while booking.',
    'Book an eligible haircut, fade, lineup, trim, or bald service.',
    'Vintage Fades confirms payment and activates the pass by phone or at the shop.'
  ]
};

const businessHours = {
  default: { open: '09:00', close: '20:00' },
  0: { open: '10:00', close: '17:00' },
  6: { open: '09:00', close: '18:00' }
};

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTimeValue = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const formatTimeLabel = (time) => {
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteString} ${suffix}`;
};

export const getTodayInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTimeOptions = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  const hours = businessHours[date.getDay()] || businessHours.default;
  const options = [];

  for (let minutes = toMinutes(hours.open); minutes < toMinutes(hours.close); minutes += 60) {
    const value = formatTimeValue(minutes);
    options.push({ value, label: formatTimeLabel(value) });
  }

  return options;
};

export const getEstimatedDuration = (services) => services.reduce((sum, service) => {
  const match = (service.duration || '').match(/(\d+)/);
  return sum + (match ? Number(match[1]) : 0);
}, 0);

export const getSubscriptionCredit = (service) => Number(service?.subscriptionCredit || 0);

export const getCoveredSubscriptionService = (services = []) => (
  services.reduce((covered, service) => (
    getSubscriptionCredit(service) > getSubscriptionCredit(covered) ? service : covered
  ), null)
);

export const calculateBookingPricing = (services = [], subscriptionStatus = 'none') => {
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const coveredService = getCoveredSubscriptionService(services);
  const subscriptionApplies = ['active', 'signup'].includes(subscriptionStatus) && coveredService;
  const subscriptionDiscount = subscriptionApplies ? getSubscriptionCredit(coveredService) : 0;
  const subscriptionCharge = subscriptionStatus === 'signup' ? monthlySubscription.price : 0;

  return {
    subtotal,
    coveredService,
    subscriptionDiscount,
    subscriptionCharge,
    total: Math.max(subtotal - subscriptionDiscount, 0) + subscriptionCharge
  };
};

export const flattenServices = (catalog = serviceCatalog) => (
  Object.entries(catalog).flatMap(([category, services]) =>
    services.map((service) => ({ ...service, category }))
  )
);

export const normalizeServiceCatalog = (catalog = {}) => {
  const fallbackServicesById = new Map(flattenServices(serviceCatalog).map((service) => [service.id, service]));
  const normalized = Object.entries(catalog).reduce((nextCatalog, [category, services]) => {
    nextCatalog[category] = (services || []).map((service) => {
      const fallback = fallbackServicesById.get(service.id) || {};
      return { ...fallback, ...service };
    });
    return nextCatalog;
  }, {});

  Object.entries(serviceCatalog).forEach(([category, services]) => {
    if (!normalized[category]) {
      normalized[category] = services;
    }
  });

  return normalized;
};
