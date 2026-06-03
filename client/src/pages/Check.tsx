import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Check = () => {
  const navigate = useNavigate();
  const currency = "₦";

  const {
    items,
    cartTotal,
    deliveryFee,
    finalTotal,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<"address" | "confirm" | "success">(
    "address"
  );

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const user = {
    name: "User",
    email: "user@example.com",
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setLoading(true);

    const orderPayload = {
      user,
      items,
      address: selectedAddress,
      subtotal: cartTotal,
      deliveryFee,
      total: finalTotal,
    };

    console.log("ORDER:", orderPayload);

    setTimeout(() => {
      clearCart(); 
      setLoading(false);
      setStep("success");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {/* STEP INDICATOR */}
      <div className="flex gap-2 text-sm mb-4">
        <span className={step === "address" ? "font-bold" : ""}>
          Address
        </span>
        <span>→</span>
        <span className={step === "confirm" ? "font-bold" : ""}>
          Order
        </span>
        <span>→</span>
        <span className={step === "success" ? "font-bold" : ""}>
          Success
        </span>
      </div>

      <div className="border rounded-xl p-4 bg-white">

        {/* ================= ADDRESS STEP ================= */}
        {step === "address" && (
          <div>
            <h2 className="font-semibold mb-2">
              Select Delivery Address
            </h2>

            {/* TEMP ADDRESS (replace with AddressCard later) */}
            <button
              onClick={() =>
                setSelectedAddress({
                  address: "12 Lagos Street",
                  city: "Lagos",
                  state: "Lagos",
                })
              }
              className="border px-3 py-2 rounded-lg text-sm"
            >
              Select Sample Address
            </button>

            {selectedAddress && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {selectedAddress.address},{" "}
                {selectedAddress.city}
              </p>
            )}

            <button
              onClick={() => setStep("confirm")}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* ================= ORDER SUMMARY ================= */}
        {step === "confirm" && (
          <div>
            <h2 className="font-semibold mb-3">Order Summary</h2>

            {/* ITEMS */}
            <div className="space-y-3 border rounded-xl p-3 bg-gray-50">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Cart is empty
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={item.product.image}
                        className="w-10 h-10 rounded object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {currency}
                          {item.product.price}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {currency}
                      {item.product.price * item.quantity}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* TOTALS */}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currency}
                  {cartTotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {currency}
                  {deliveryFee}
                </span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>
                  {currency}
                  {finalTotal}
                </span>
              </div>
            </div>

            {/* ADDRESS */}
            {selectedAddress && (
              <div className="mt-3 text-xs text-gray-600 border p-2 rounded-lg">
                Deliver to: {selectedAddress.address},{" "}
                {selectedAddress.city}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep("address")}
                className="border px-4 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        )}

        {/* ================= SUCCESS ================= */}
        {step === "success" && (
          <div className="text-center py-6">
            <h2 className="text-lg font-bold text-green-600">
              Order Placed Successfully 🎉
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Thank you for your order
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Check;