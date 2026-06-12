const serviceCatalog = {
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

const monthlySubscription = {
  id: 'monthly-fresh-pass',
  name: 'Monthly Fresh Pass',
  price: 450,
  cadence: 'monthly',
  description: 'Covers the cut, fade, lineup, trim, or bald value on eligible bookings. Beard, colour, facial, enhancement, and line-design add-ons remain payable.'
};

const businessHours = {
  default: { open: '09:00', close: '20:00' },
  0: { open: '10:00', close: '17:00' },
  6: { open: '09:00', close: '18:00' }
};

const flattenServices = () => (
  Object.entries(serviceCatalog).flatMap(([category, services]) =>
    services.map((service) => ({ ...service, category }))
  )
);

const servicesById = new Map(flattenServices().map((service) => [service.id, service]));
const servicesByName = new Map();

flattenServices().forEach((service) => {
  const key = service.name.toLowerCase();
  if (!servicesByName.has(key)) {
    servicesByName.set(key, service);
  }
});

const getServiceById = (id) => servicesById.get(Number(id));

const getServiceByName = (name = '') => servicesByName.get(String(name).toLowerCase());

const resolveSelectedServices = ({ serviceIds, services }) => {
  const selected = Array.isArray(serviceIds) && serviceIds.length > 0
    ? serviceIds.map(getServiceById)
    : (services || []).map(getServiceByName);

  if (selected.some((service) => !service)) {
    return null;
  }

  const uniqueById = new Map(selected.map((service) => [service.id, service]));
  return [...uniqueById.values()];
};

const calculateTotal = (services) => services.reduce((sum, service) => sum + service.price, 0);

const getSubscriptionCredit = (service) => Number((service && service.subscriptionCredit) || 0);

const getCoveredSubscriptionService = (services = []) => (
  services.reduce((covered, service) => (
    getSubscriptionCredit(service) > getSubscriptionCredit(covered) ? service : covered
  ), null)
);

const calculateBookingPricing = (services = [], subscriptionStatus = 'none') => {
  const subtotal = calculateTotal(services);
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

const dateOnlyToDate = (value) => {
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day);
};

const isFutureDate = (value) => {
  const requestedDate = dateOnlyToDate(value);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return requestedDate >= today;
};

const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + minutes;
};

const getBusinessHoursForDate = (value) => {
  const date = dateOnlyToDate(value);
  return businessHours[date.getDay()] || businessHours.default;
};

const isTimeWithinBusinessHours = (date, time) => {
  const hours = getBusinessHoursForDate(date);
  const requested = toMinutes(time);
  return requested >= toMinutes(hours.open) && requested < toMinutes(hours.close);
};

module.exports = {
  serviceCatalog,
  monthlySubscription,
  flattenServices,
  resolveSelectedServices,
  calculateBookingPricing,
  calculateTotal,
  dateOnlyToDate,
  getCoveredSubscriptionService,
  getSubscriptionCredit,
  getBusinessHoursForDate,
  isFutureDate,
  isTimeWithinBusinessHours
};
