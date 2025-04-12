const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Razorpay = ({
  amount,
  userId,
  eventId,
  seats,
  ticketCount,
  discount,
  promoCode,
  onSuccess,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        reject(new Error("Failed to load Razorpay SDK"));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount, // amount should already be in paise
        currency: "INR",
        name: "Comedy Club",
        description: `Booking ${ticketCount} tickets`,
        handler: async function (response) {
          try {
            const paymentId = response.razorpay_payment_id;

            // Send transaction details to backend
            const result = await fetch("/api/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                userId,
                eventId,
                amount: amount / 100, // Convert back to rupees
                paymentId,
                seats,
                ticketCount,
                discount,
                promoCode,
              }),
            });

            const data = await result.json();
            if (data.success) {
              onSuccess(paymentId);
              resolve({ success: true, paymentId });
            } else {
              reject(new Error(data.message || "Booking failed"));
            }
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: "Customer",
          email: localStorage.getItem("userEmail"),
        },
        theme: {
          color: "#422AFB",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      reject(error);
    }
  });
};

export default Razorpay;
