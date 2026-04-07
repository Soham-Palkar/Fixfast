import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("bookings");
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const value = useMemo(() => ({
    bookings,
    addBooking: (service) => {
      const newBooking = {
        id: crypto.randomUUID(),
        serviceId: service.id,
        title: service.title,
        price: service.price,
        image: service.image,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    },
    removeBooking: (id) => setBookings((prev) => prev.filter((b) => b.id !== id)),
    clearBookings: () => setBookings([]),
  }), [bookings]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside BookingProvider");
  return ctx;
}
