import { useEffect, useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import {
  getCartAPI,
  updateCartQuantityAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../Services/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch cart for update, delete and clear
  const fetchCart = async () => {
    try {
      const response = await getCartAPI(userId);

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Initial cart loading
  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCartAPI(userId);

        setCart(response.data.cart || response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  // Increase / decrease quantity
  const updateQuantity = async (productId, variantSku, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartQuantityAPI(userId, productId, variantSku, quantity);

      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove product
  const removeItem = async (productId, variantSku) => {
    try {
      await removeFromCartAPI(userId, productId, variantSku);

      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await clearCartAPI(userId);

      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f6]">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#faf8f6] flex flex-col items-center justify-center">
        <FiShoppingBag size={55} className="text-[#c98f8b] mb-5" />

        <h2 className="text-2xl font-semibold text-gray-800">
          Please login first
        </h2>

        <p className="text-gray-500 mt-2">Login to view your shopping cart.</p>
      </div>
    );
  }

  const cartItems = cart?.cartItems || [];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.priceAtAdd * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 250 : 0;

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#faf8f6] py-12 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-sm tracking-[3px] text-[#c98f8b] uppercase mb-2">
          Your Shopping Bag
        </p>

        <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
          Shopping Cart
        </h1>

        <div className="w-16 h-[2px] bg-[#c98f8b] mt-5"></div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-white py-20 px-6 text-center shadow-sm">
          <FiShoppingBag size={65} className="mx-auto text-[#c98f8b] mb-6" />

          <h2 className="text-2xl font-semibold text-gray-800">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-3">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm">
              <div className="hidden md:grid grid-cols-12 px-6 py-5 border-b text-sm uppercase tracking-wider text-gray-500">
                <div className="col-span-6">Product</div>

                <div className="col-span-2 text-center">Price</div>

                <div className="col-span-3 text-center">Quantity</div>

                <div className="col-span-1"></div>
              </div>

              {cartItems.map((item) => {
                const product = item.product;

                return (
                  <div
                    key={`${item.product?._id}-${item.variantSku || ""}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center px-6 py-7 border-b"
                  >
                    <div className="md:col-span-6 flex items-center gap-5">
                      <div className="w-24 h-28 bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            product?.image ||
                            product?.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-medium text-lg text-gray-800">
                          {product?.name}
                        </h3>

                        {product?.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}

                        {item.variantSku && (
                          <p className="text-sm text-gray-500 mt-2">
                            Variant: {item.variantSku}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 text-center">
                      <p className="font-medium text-gray-800">
                        Rs. {item.priceAtAdd?.toLocaleString()}
                      </p>
                    </div>

                    <div className="md:col-span-3 flex justify-center">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product?._id,
                              item.variantSku,
                              item.quantity - 1,
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiMinus size={14} />
                        </button>

                        <span className="w-10 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              product?._id,
                              item.variantSku,
                              item.quantity + 1,
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() =>
                          removeItem(product?._id, item.variantSku)
                        }
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={19} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Clear Shopping Cart
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white p-7 shadow-sm sticky top-24">
              <h2 className="text-2xl font-serif text-gray-900 mb-7">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

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
                onClick={() => navigate("/checkout")}
                className="w-full mt-8 bg-[#c98f8b] text-white py-4 flex items-center justify-center gap-3 hover:bg-[#b97d79] transition duration-300 uppercase tracking-wider text-sm"
              >
                Proceed to Checkout
                <FiArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-gray-400 mt-5">
                Secure checkout • Easy returns
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
