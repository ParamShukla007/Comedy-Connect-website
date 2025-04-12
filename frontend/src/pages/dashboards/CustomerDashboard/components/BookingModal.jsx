import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Ticket, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateInvoice } from "@/utils/generateInvoice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Theater from "../pages/Threater";
import { toast } from "sonner"; // Add this import
import Razorpay from "./Razorpay";
import { useNavigate } from "react-router-dom";

const PROMO_CODES = [
  { code: "FIRST10", discount: 10, description: "First time user discount" },
  {
    code: "COMEDY20",
    discount: 20,
    description: "Special comedy show discount",
  },
  { code: "WEEKEND15", discount: 15, description: "Weekend special offer" },
];

const BookingModal = ({ isOpen, onClose, event }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: tickets & promo, 2: seat selection
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const basePrice = event?.proposedPrice || 0;

  const calculatePrices = () => {
    const ticketSubtotal = basePrice * ticketCount;
    const seatPrices = selectedSeats.reduce((total, seat) => {
      const isPremium = seat.charAt(0) <= "B";
      return total + (isPremium ? 200 : 150);
    }, 0);
    const subtotal = ticketSubtotal + seatPrices;
    const discount =
      isPromoApplied && selectedPromo
        ? (subtotal * selectedPromo.discount) / 100
        : 0;

    return {
      ticketSubtotal,
      seatPrices,
      subtotal,
      discount,
      total: subtotal - discount,
    };
  };

  const handlePromoSelect = (promoCode) => {
    const selected = PROMO_CODES.find((p) => p.code === promoCode);
    setSelectedPromo(selected);
    setIsPromoApplied(false);
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handlePayment = async () => {
    if (selectedSeats.length !== ticketCount) {
      toast.error(`Please select ${ticketCount} seats`);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      await Razorpay({
        amount: calculatePrices().total * 100,
        userId,
        eventId: event._id,
        seats: selectedSeats,
        ticketCount,
        discount: isPromoApplied ? selectedPromo.discount : 0,
        promoCode: isPromoApplied ? selectedPromo.code : null,
        onSuccess: () => {
          toast.success("Booking confirmed!");
          onClose();
          navigate("/customer/tickets");
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const PriceSummary = () => {
    const prices = calculatePrices();

    return (
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Show Tickets ({ticketCount})
          </span>
          <span>₹{prices.ticketSubtotal}</span>
        </div>
        {selectedSeats.length > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seat Charges</span>
            <span>₹{prices.seatPrices}</span>
          </div>
        )}
        <div className="flex justify-between text-lg border-t pt-2">
          <span>Subtotal</span>
          <span>₹{prices.subtotal}</span>
        </div>
        {isPromoApplied && selectedPromo && (
          <div className="flex justify-between text-green-500">
            <span>Discount ({selectedPromo.discount}%)</span>
            <span>-₹{prices.discount}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>Final Amount</span>
          <span>₹{prices.total}</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={step === 2 ? "sm:max-w-[800px]" : "sm:max-w-[425px]"}
      >
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Tickets" : "Choose Your Seats"}
          </DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="py-4 space-y-4">
            {/* Ticket Counter */}
            <div className="space-y-2">
              <Label>Number of Tickets</Label>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center text-lg font-medium">
                  {ticketCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Promo Code Selection */}
            <div className="space-y-2">
              <Label>Select Promo Code</Label>
              <Select onValueChange={handlePromoSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a promo code" />
                </SelectTrigger>
                <SelectContent>
                  {PROMO_CODES.map((promo) => (
                    <SelectItem key={promo.code} value={promo.code}>
                      <div className="flex flex-col">
                        <span>
                          {promo.code} - {promo.discount}% OFF
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {promo.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPromo && !isPromoApplied && (
                <Button
                  variant="secondary"
                  className="w-full mt-2"
                  onClick={() => setIsPromoApplied(true)}
                >
                  Apply {selectedPromo.code}
                </Button>
              )}
            </div>

            {isPromoApplied && selectedPromo && (
              <Alert className="bg-green-500/10 text-green-500">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  {selectedPromo.discount}% discount applied!
                </AlertDescription>
              </Alert>
            )}

            <PriceSummary />

            {/* Continue Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(2)}
                disabled={ticketCount < 1}
              >
                Continue (₹{calculatePrices().total})
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <Theater
              maxSeats={ticketCount}
              onSeatSelect={handleSeatSelect}
              selectedSeats={selectedSeats}
            />

            <PriceSummary />

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={selectedSeats.length !== ticketCount}
              >
                Pay ₹{calculatePrices().total}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
