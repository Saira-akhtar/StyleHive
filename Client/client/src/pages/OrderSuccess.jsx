import { useLocation, NavLink } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] py-16 px-4">

      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm">

        {/* Success Message */}

        <div className="text-center">

          <FiCheckCircle
            size={65}
            className="mx-auto text-green-600"
          />

          <h1 className="mt-5 text-3xl font-semibold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-500">
            Thank you for shopping with StyleHive.
          </p>

        </div>


        {/* Order Details */}

        <div className="mt-10 border-t border-b py-6">

          <div className="flex justify-between mb-4">

            <span className="text-gray-500">
              Order Number
            </span>

            <span className="font-medium text-gray-900">
              {order.orderNumber}
            </span>

          </div>


          <div className="flex justify-between mb-4">

            <span className="text-gray-500">
              Payment Method
            </span>

            <span className="font-medium capitalize text-gray-900">
              {order.payment?.provider}
            </span>

          </div>


          <div className="flex justify-between">

            <span className="text-gray-500">
              Payment Status
            </span>

            <span className="font-medium capitalize text-gray-900">
              {order.payment?.status}
            </span>

          </div>

        </div>


        {/* Shipping Address */}

        <div className="mt-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Shipping Address
          </h2>

          <p className="mt-3 text-gray-600 leading-7">
            {order.shippingAddress}
          </p>

        </div>


        {/* Order Items */}

        <div className="mt-8">

          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Order Summary
          </h2>

          <div className="space-y-4">

            {order.items?.map((item, index) => (

              <div
                key={item._id || index}
                className="flex justify-between border-b border-gray-200 pb-4"
              >

                <div>

                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                </div>

                <p className="font-medium text-gray-900">

                  Rs. {Number(item.lineTotal).toLocaleString()}

                </p>

              </div>

            ))}

          </div>

        </div>


        {/* Pricing */}

        <div className="mt-8 border-t pt-5">

          <div className="flex justify-between text-gray-600">

            <span>Subtotal</span>

            <span>
              Rs. {Number(order.pricing?.subtotal || 0).toLocaleString()}
            </span>

          </div>


          <div className="flex justify-between text-gray-600 mt-3">

            <span>Shipping</span>

            <span>
              Rs. {Number(order.pricing?.shipping || 0).toLocaleString()}
            </span>

          </div>


          <div className="flex justify-between text-xl font-semibold text-gray-900 mt-5 border-t pt-5">

            <span>Total</span>

            <span>
              Rs. {Number(order.pricing?.total || 0).toLocaleString()}
            </span>

          </div>

        </div>


        {/* Continue Shopping */}

        <NavLink
          to="/shop"
          className="mt-10 w-full bg-black text-white py-4 flex items-center justify-center text-sm tracking-wider hover:bg-[#333] transition"
        >
          CONTINUE SHOPPING
        </NavLink>

      </div>

    </div>
  );
};

export default OrderSuccess;