export const serviceCatalog = {
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

export const flattenServices = (catalog = serviceCatalog) => (
  Object.entries(catalog).flatMap(([category, services]) =>
    services.map((service) => ({ ...service, category }))
  )
);
