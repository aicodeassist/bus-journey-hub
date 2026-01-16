export interface Booking {
  id: string;
  routeId: string;
  from: string;
  to: string;
  date: string;
  boardingCity: string;
  boardingStation: string;
  boardingTime: string;
  alightingCity: string;
  alightingStation: string;
  alightingTime: string;
  adults: number;
  children: number;
  ticketPrice: number;
  totalPrice: number;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: 'active' | 'cancelled' | 'modified';
  createdAt: string;
  cancelledAt?: string;
  refundAmount?: number;
}

const STORAGE_KEY = 'bus_bookings';

export const generateBookingId = (): string => {
  return `BK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getBookingById = (id: string): Booking | undefined => {
  const bookings = getBookings();
  return bookings.find(b => b.id === id);
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  const existingIndex = bookings.findIndex(b => b.id === booking.id);
  
  if (existingIndex >= 0) {
    bookings[existingIndex] = booking;
  } else {
    bookings.push(booking);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const calculateRefund = (booking: Booking): { refundAmount: number; refundPercentage: number; message: string } => {
  const tripDate = new Date(booking.date);
  const now = new Date();
  const hoursUntilTrip = (tripDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let refundPercentage: number;
  let message: string;
  
  if (hoursUntilTrip >= 48) {
    refundPercentage = 100;
    message = "Повне повернення коштів (понад 48 годин до рейсу)";
  } else if (hoursUntilTrip >= 24) {
    refundPercentage = 80;
    message = "Повернення 80% (24-48 годин до рейсу)";
  } else if (hoursUntilTrip >= 6) {
    refundPercentage = 50;
    message = "Повернення 50% (6-24 години до рейсу)";
  } else if (hoursUntilTrip >= 0) {
    refundPercentage = 20;
    message = "Повернення 20% (менше 6 годин до рейсу)";
  } else {
    refundPercentage = 0;
    message = "Повернення неможливе (рейс вже відбувся)";
  }
  
  const refundAmount = Math.round(booking.totalPrice * refundPercentage / 100);
  
  return { refundAmount, refundPercentage, message };
};

export const cancelBooking = (bookingId: string): { success: boolean; refundAmount: number; message: string } => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex < 0) {
    return { success: false, refundAmount: 0, message: "Бронювання не знайдено" };
  }
  
  const booking = bookings[bookingIndex];
  
  if (booking.status === 'cancelled') {
    return { success: false, refundAmount: 0, message: "Бронювання вже скасовано" };
  }
  
  const { refundAmount, message } = calculateRefund(booking);
  
  bookings[bookingIndex] = {
    ...booking,
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    refundAmount,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return { success: true, refundAmount, message };
};
