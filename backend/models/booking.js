const { getSupabase } = require('../config/supabase');

const TABLE_NAME = 'bookings';

const columnMap = {
  id: 'id',
  _id: 'id',
  name: 'name',
  phone: 'phone',
  date: 'date',
  time: 'time',
  services: 'services',
  serviceIds: 'service_ids',
  subtotal: 'subtotal',
  subscriptionStatus: 'subscription_status',
  subscriptionReference: 'subscription_reference',
  subscriptionPlan: 'subscription_plan',
  subscriptionCoveredService: 'subscription_covered_service',
  subscriptionDiscount: 'subscription_discount',
  subscriptionCharge: 'subscription_charge',
  total: 'total',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
};

const pad = (value) => String(value).padStart(2, '0');

const toDateOnly = (value) => {
  if (!value) return value;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      value.getFullYear(),
      pad(value.getMonth() + 1),
      pad(value.getDate())
    ].join('-');
  }

  return String(value).slice(0, 10);
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const mapRowToBooking = (row) => {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    phone: row.phone,
    date: row.date,
    time: row.time,
    services: Array.isArray(row.services) ? row.services : [],
    serviceIds: Array.isArray(row.service_ids) ? row.service_ids : [],
    subtotal: toNumber(row.subtotal),
    subscriptionStatus: row.subscription_status || 'none',
    subscriptionReference: row.subscription_reference || '',
    subscriptionPlan: row.subscription_plan || '',
    subscriptionCoveredService: row.subscription_covered_service || '',
    subscriptionDiscount: toNumber(row.subscription_discount),
    subscriptionCharge: toNumber(row.subscription_charge),
    total: toNumber(row.total),
    status: row.status || 'confirmed',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const mapBookingToRow = (booking = {}) => {
  const row = {};

  if (booking.name !== undefined) row.name = booking.name;
  if (booking.phone !== undefined) row.phone = booking.phone;
  if (booking.date !== undefined) row.date = toDateOnly(booking.date);
  if (booking.time !== undefined) row.time = booking.time;
  if (booking.services !== undefined) row.services = booking.services;
  if (booking.serviceIds !== undefined) row.service_ids = booking.serviceIds;
  if (booking.subtotal !== undefined) row.subtotal = booking.subtotal;
  if (booking.subscriptionStatus !== undefined) row.subscription_status = booking.subscriptionStatus;
  if (booking.subscriptionReference !== undefined) row.subscription_reference = booking.subscriptionReference;
  if (booking.subscriptionPlan !== undefined) row.subscription_plan = booking.subscriptionPlan;
  if (booking.subscriptionCoveredService !== undefined) {
    row.subscription_covered_service = booking.subscriptionCoveredService;
  }
  if (booking.subscriptionDiscount !== undefined) row.subscription_discount = booking.subscriptionDiscount;
  if (booking.subscriptionCharge !== undefined) row.subscription_charge = booking.subscriptionCharge;
  if (booking.total !== undefined) row.total = booking.total;
  if (booking.status !== undefined) row.status = booking.status;

  return row;
};

const applyFilterValue = (query, column, value) => {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    let nextQuery = query;

    if (value.$gte !== undefined) {
      nextQuery = nextQuery.gte(column, column === 'date' ? toDateOnly(value.$gte) : value.$gte);
    }

    if (value.$in !== undefined) {
      nextQuery = nextQuery.in(column, value.$in);
    }

    return nextQuery;
  }

  return query.eq(column, column === 'date' ? toDateOnly(value) : value);
};

const applyFilters = (query, filter = {}) => (
  Object.entries(filter).reduce((nextQuery, [field, value]) => {
    if (value === undefined) return nextQuery;

    const column = columnMap[field] || field;
    return applyFilterValue(nextQuery, column, value);
  }, query)
);

const applySort = (query, sortSpec = {}) => (
  Object.entries(sortSpec).reduce((nextQuery, [field, direction]) => {
    const column = columnMap[field] || field;
    return nextQuery.order(column, { ascending: Number(direction) >= 0 });
  }, query)
);

const selectBookings = async (filter = {}, sortSpec = {}) => {
  let query = getSupabase().from(TABLE_NAME).select('*');
  query = applyFilters(query, filter);
  query = applySort(query, sortSpec);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapRowToBooking);
};

class BookingQuery {
  constructor(filter = {}) {
    this.filter = filter;
    this.sortSpec = {};
  }

  sort(sortSpec = {}) {
    this.sortSpec = sortSpec;
    return this.exec();
  }

  exec() {
    return selectBookings(this.filter, this.sortSpec);
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

class Booking {
  constructor(data = {}) {
    Object.assign(this, {
      status: 'confirmed',
      services: [],
      serviceIds: [],
      subtotal: 0,
      subscriptionStatus: 'none',
      subscriptionReference: '',
      subscriptionPlan: '',
      subscriptionCoveredService: '',
      subscriptionDiscount: 0,
      subscriptionCharge: 0
    }, data);
  }

  async save() {
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .insert(mapBookingToRow(this))
      .select('*')
      .single();

    if (error) throw error;

    Object.assign(this, mapRowToBooking(data));
    return this;
  }

  static async countDocuments(filter = {}) {
    let query = getSupabase()
      .from(TABLE_NAME)
      .select('id', { count: 'exact', head: true });

    query = applyFilters(query, filter);

    const { count, error } = await query;
    if (error) throw error;

    return count || 0;
  }

  static find(filter = {}) {
    return new BookingQuery(filter);
  }

  static async findById(id) {
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return mapRowToBooking(data);
  }

  static async findByIdAndUpdate(id, updateData = {}) {
    const row = mapBookingToRow(updateData);

    if (Object.keys(row).length === 0) {
      return Booking.findById(id);
    }

    row.updated_at = new Date().toISOString();

    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .update(row)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return mapRowToBooking(data);
  }

  static async findByIdAndDelete(id) {
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return mapRowToBooking(data);
  }
}

module.exports = Booking;
