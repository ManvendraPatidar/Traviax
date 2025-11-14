"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Hotel, Calendar, Users, Search, MapPin } from "lucide-react";

export default function BookingSearch() {
  const [bookingType, setBookingType] = useState<"flight" | "hotel">("flight");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    checkin: "",
    checkout: "",
    passengers: "1",
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    // Mock search results
    setTimeout(() => {
      const mockResults =
        bookingType === "flight"
          ? [
              {
                id: "1",
                title: "Turkish Airlines TK1234",
                description: "DXB → IST • 4h 15m • Boeing 777",
                price: 450,
                provider: "Turkish Airlines",
              },
              {
                id: "2",
                title: "Emirates EK567",
                description: "DXB → IST • 3h 45m • Airbus A380",
                price: 680,
                provider: "Emirates",
              },
            ]
          : [
              {
                id: "1",
                title: "Sultanahmet Palace Hotel",
                description:
                  "⭐ 4.8 • Historic District • WiFi, Breakfast, Spa",
                price: 180,
                provider: "Traviax Hotels",
              },
              {
                id: "2",
                title: "Four Seasons Bosphorus",
                description:
                  "⭐ 4.9 • Bosphorus View • WiFi, Breakfast, Spa, Pool",
                price: 350,
                provider: "Traviax Hotels",
              },
            ];

      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient-gold">Book</span> Your Journey
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
          Find the best flights and hotels for your next adventure
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Booking Type Selector */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setBookingType("flight")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                bookingType === "flight"
                  ? "bg-gradient-gold text-primary"
                  : "bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              <Plane size={20} />
              <span>Flights</span>
            </button>
            <button
              onClick={() => setBookingType("hotel")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                bookingType === "hotel"
                  ? "bg-gradient-gold text-primary"
                  : "bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              <Hotel size={20} />
              <span>Hotels</span>
            </button>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {bookingType === "flight" ? "From" : "Destination"}
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  value={searchData.from}
                  onChange={(e) =>
                    setSearchData((prev) => ({ ...prev, from: e.target.value }))
                  }
                  placeholder={
                    bookingType === "flight"
                      ? "Departure city"
                      : "City or hotel name"
                  }
                  className="w-full bg-card border border-border-light rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {bookingType === "flight" && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={searchData.to}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, to: e.target.value }))
                    }
                    placeholder="Destination city"
                    className="w-full bg-card border border-border-light rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            <div className={bookingType === "flight" ? "" : "lg:col-span-2"}>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {bookingType === "flight" ? "Departure" : "Check-in"}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                />
                <input
                  type="date"
                  value={searchData.checkin}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      checkin: e.target.value,
                    }))
                  }
                  className="w-full bg-card border border-border-light rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {bookingType === "flight" ? "Return" : "Check-out"}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                />
                <input
                  type="date"
                  value={searchData.checkout}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      checkout: e.target.value,
                    }))
                  }
                  className="w-full bg-card border border-border-light rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {bookingType === "flight" ? "Passengers" : "Guests"}
              </label>
              <div className="relative">
                <Users
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                />
                <select
                  value={searchData.passengers}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      passengers: e.target.value,
                    }))
                  }
                  className="w-full bg-card border border-border-light rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-6 bg-gradient-gold text-primary py-4 rounded-lg font-semibold hover:shadow-gold transition-all disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Search size={20} />
                <span>Search</span>
              </div>
            )}
          </motion.button>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Search Results
            </h2>
            {results.map((result) => (
              <div key={result.id} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      {result.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-2">
                      {result.description}
                    </p>
                    <p className="text-text-muted text-xs">
                      by {result.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent mb-1">
                      ${result.price}
                    </div>
                    <div className="text-text-muted text-sm">USD</div>
                  </div>
                </div>
                <motion.button
                  className="bg-gradient-gold text-primary px-6 py-2 rounded-lg font-semibold hover:shadow-gold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Now
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
