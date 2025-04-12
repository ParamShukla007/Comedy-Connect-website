import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Razorpay from "../components/Razorpay";
import { Link as Lk } from "react-router-dom";
const Theater = ({
  maxSeats,
  onSeatSelect,
  selectedSeats: propSelectedSeats,
}) => {
  const rows = 7;
  const columns = 7;
  const price = 150; // Price per seat

  const occupiedSeats = ["A1", "B5", "C3", "D4"];
  const [selectedSeats, setSelectedSeats] = useState(propSelectedSeats || []);

  useEffect(() => {
    if (propSelectedSeats) {
      setSelectedSeats(propSelectedSeats);
    }
  }, [propSelectedSeats]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      let newSelection;
      if (prev.includes(seatId)) {
        newSelection = prev.filter((seat) => seat !== seatId);
      } else if (prev.length < maxSeats) {
        newSelection = [...prev, seatId];
      } else {
        newSelection = [...prev.slice(1), seatId]; // Remove first seat and add new one
      }
      onSeatSelect(newSelection); // Notify parent component
      return newSelection;
    });
  };
  const getSeatPrice = (seatId) => {
    const isPremium = seatId.charAt(0) <= "B";
    return isPremium ? 200 : 150;
  };

  const calculateTotalSeatPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };

  return (
    <div className="bg-background text-foreground p-4">
      {/* Modified layout to fit in modal */}
      <div className="max-w-3xl mx-auto scale-75 origin-top">
        {/* Header with categories */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-primary">Select Your Seats</h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-lg font-semibold">Premium</p>
              <p className="text-muted-foreground">₹200</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Standard</p>
              <p className="text-muted-foreground">₹150</p>
            </div>
          </div>
        </div>

        {/* Enhanced Screen */}
        <div className="relative mb-16">
          <div className="h-3 bg-gradient-to-r from-transparent via-primary to-transparent mb-4"></div>
          <div className="w-4/5 h-16 bg-gradient-to-b from-primary/30 to-transparent mx-auto rounded-t-[100px] transform -rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary/5 rounded-t-[100px]"></div>
          <p className="text-center text-muted-foreground mt-4 text-sm tracking-wider">
            SCREEN
          </p>
        </div>

        {/* Seats Container with 3D effect */}
        <div className="perspective-1000">
          <div className="flex justify-center mb-12 transform-style-3d rotate-x-10">
            <div className="flex flex-col gap-4">
              {[...Array(rows)].map((_, rowIndex) => (
                <motion.div
                  key={rowIndex}
                  className="flex gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.1 }}
                >
                  <span className="w-8 text-muted-foreground text-sm flex items-center font-semibold">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {[...Array(columns)].map((_, colIndex) => {
                    const seatId = `${String.fromCharCode(65 + rowIndex)}${
                      colIndex + 1
                    }`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={colIndex}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isOccupied}
                        className={`
                          w-14 h-14 rounded-t-2xl relative group transition-all duration-300
                          transform hover:scale-105 hover:-translate-y-1
                          ${isOccupied ? "bg-red-500 shadow-red-500/50" : ""}
                          ${isSelected ? "bg-primary shadow-primary/50" : ""}
                          ${
                            !isOccupied && !isSelected
                              ? "bg-green-500 shadow-green-500/50"
                              : ""
                          }
                          border-2 border-opacity-50
                          shadow-lg hover:shadow-xl
                          before:content-[''] before:absolute before:inset-x-0 before:bottom-0 
                          before:h-2 before:bg-black/10 before:rounded-b-lg
                        `}
                      >
                        <span
                          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                          text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground
                          bg-background/80 px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {seatId}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="flex justify-center gap-12 mb-12">
          {[
            {
              color: "bg-green-500",
              label: "Available",
              border: "border-green-600",
            },
            {
              color: "bg-primary",
              label: "Selected",
              border: "border-primary",
            },
            {
              color: "bg-red-500",
              label: "Occupied",
              border: "border-red-600",
            },
          ].map(({ color, label, border }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-t-lg ${color} ${border} border-2 shadow-lg`}
              ></div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Enhanced Price Summary */}
        <motion.div
          className="glass-card p-8 rounded-xl max-w-md mx-auto border-2 border-primary/20
            backdrop-blur-lg shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between mb-6">
            <span className="text-lg">Selected Seats:</span>
            <span className="font-semibold text-primary">
              {selectedSeats.join(", ") || "None"}
            </span>
          </div>
          <div className="flex justify-between text-2xl font-bold mb-6">
            <span>Seats Total:</span>
            <span className="text-primary">₹{calculateTotalSeatPrice()}</span>
          </div>
          {selectedSeats.length > 0 && (
            <Lk  >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg
                font-bold text-lg shadow-lg hover:shadow-primary/50 
                transition-all duration-300"
            >
              Proceed to Payment
            </motion.button>
            </Lk>

          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Theater;
