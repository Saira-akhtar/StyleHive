import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartAPI, createOrderAPI, applyCouponAPI } from "../Services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "jazzcash",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCartAPI(userId);

        setCart(response.data.cart || response.data);
      } catch (error) {
        console.error(
          "Checkout cart error:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cartItems = cart?.cartItems || [];

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.priceAtAdd) * Number(item.quantity),
    0,
  );

  const shipping = subtotal > 0 ? 250 : 0;

  const total = Math.max(0, subtotal - discount + shipping);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponMessage("");

      const response = await applyCouponAPI({
        code: couponCode.trim(),
        cartTotal: Number(subtotal),
      });

      console.log("Coupon response:", response.data);

      setDiscount(Number(response.data.discount) || 0);

      setAppliedCoupon(response.data.coupon || couponCode.toUpperCase());

      setCouponMessage(response.data.message || "Coupon applied successfully!");
    } 
    catch (error) {
      console.error("Coupon error:", error.response?.data || error.message);

      setDiscount(0);
      setAppliedCoupon(null);

      setCouponMessage(error.response?.data?.message || "Invalid coupon code.");
    } 
    finally {
      setApplyingCoupon(false);
    }
  };

  // Remove Coupon
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponMessage("");
  };

  // Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Please login first.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      setMessage("Please fill all shipping information.");
      return;
    }

    if (!formData.paymentMethod) {
      setMessage("Please select a payment method.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setMessage("");

      const response = await createOrderAPI({
        user: userId,

        shippingAddress: `${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}`,

        couponCode: appliedCoupon || null,

        discount: discount,

        shipping: shipping,

        tax: 0,

        payment: {
          provider: formData.paymentMethod,
          paymentId: `PAY-${Date.now()}`,
          status: "unpaid",
        },
      });

      console.log("Order created:", response.data);

      navigate("/order-success", {
        state: {
          order: response.data.order,
        },
      });
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);

      setMessage(error.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login first.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] py-12 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-sm tracking-[3px] text-[#c98f8b] uppercase mb-2">
          Secure Checkout
        </p>

        <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
          Checkout
        </h1>

        <div className="w-16 h-[2px] bg-[#c98f8b] mt-5"></div>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        {/* LEFT SIDE */}

        <div className="lg:col-span-2">
          <div className="bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-serif text-gray-900 mb-7">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full mt-2 border border-gray-300 px-4 py-3 outline-none focus:border-[#c98f8b]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 border border-gray-300 px-4 py-3 outline-none focus:border-[#c98f8b]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-600">Address</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 px-4 py-3 outline-none focus:border-[#c98f8b]"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-600">City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 px-4 py-3 outline-none focus:border-[#c98f8b]"
              />
            </div>

            {/* Payment */}

            <div className="mt-8 border-t pt-7">
              <h2 className="text-2xl font-serif text-gray-900 mb-5">
                Payment Method
              </h2>

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#c98f8b]"
              >
                <option value="jazzcash">JazzCash</option>

                <option value="easypaisa">EasyPaisa</option>

                <option value="stripe">Credit / Debit Card</option>

                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div>
          <div className="bg-white p-7 shadow-sm sticky top-24">
            <h2 className="text-2xl font-serif text-gray-900 mb-7">
              Order Summary
            </h2>

            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={`${item.product?._id}-${item.variantSku || ""}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product?.name}
                    </p>

                    <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>

                  <span className="font-medium">
                    Rs.{" "}
                    {(
                      Number(item.priceAtAdd) * Number(item.quantity)
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}

            <div className="border-t mt-7 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Have a coupon?
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponMessage("");
                  }}
                  placeholder="Enter coupon code"
                  disabled={!!appliedCoupon}
                  className="w-full border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#c98f8b] disabled:bg-gray-100"
                />

                {!appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="bg-black px-5 text-xs font-medium tracking-wider text-white hover:bg-[#333] disabled:bg-gray-400"
                  >
                    {applyingCoupon ? "APPLYING..." : "APPLY"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-red-500 px-4 text-xs font-medium tracking-wider text-white hover:bg-red-600"
                  >
                    REMOVE
                  </button>
                )}
              </div>

              {couponMessage && (
                <p
                  className={`mt-3 text-sm ${
                    appliedCoupon ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Pricing */}

            <div className="border-t mt-7 pt-5 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>

                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span>Rs. {shipping.toLocaleString()}</span>
              </div>

              <div className="border-t pt-5 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>

                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full mt-8 bg-[#c98f8b] text-white py-4 hover:bg-[#b97d79] transition duration-300 uppercase tracking-wider text-sm disabled:bg-gray-400"
            >
              {placingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>

            {message && (
              <p
                className={`text-center text-sm mt-4 ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
