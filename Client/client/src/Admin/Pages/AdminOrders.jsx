import { useEffect, useState } from "react";
import {
  FiPackage,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";

import {
  getAllOrdersAdminAPI,
  updateOrderAPI,
} from "../../Services/api";

const AdminOrderPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ===============================
  // FETCH ALL ORDERS
  // ===============================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await getAllOrdersAdminAPI();

        console.log("ALL ORDERS:", response.data);

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===============================
  // UPDATE ORDER STATUS
  // ===============================

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const response = await updateOrderAPI(
        orderId,
        status
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: response.data.order.status,
              }
            : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: response.data.order.status,
        }));
      }
    } catch (error) {
      console.error(
        "Failed to update order:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ===============================
  // STATUS COLORS
  // ===============================

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "returned":
        return "bg-gray-100 text-gray-700 border-gray-300";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="mt-2 text-gray-600">
          Manage and track all customer orders.
        </p>
      </div>

      {/* ORDER COUNT */}

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#B87575]/10 text-[#B87575]">
          <FiPackage size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <p className="text-xl font-bold text-gray-800">
            {orders.length}
          </p>
        </div>
      </div>

      {/* TABLE */}

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Order
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Items
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Total
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  {/* ORDER */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </td>

                  {/* CUSTOMER */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {order.user?.name || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {order.user?.email || "-"}
                    </p>
                  </td>

                  {/* ITEMS */}

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.items?.length || 0} Items
                  </td>

                  {/* TOTAL */}

                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    Rs{" "}
                    {Number(
                      order.pricing?.total || 0
                    ).toLocaleString()}
                  </td>

                  {/* PAYMENT */}

                  <td className="px-5 py-4">
                    <p className="text-sm capitalize text-gray-700">
                      {order.payment?.provider || "-"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-gray-400">
                      {order.payment?.status || ""}
                    </p>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <div className="relative inline-block">

                      <select
                        value={order.status || "pending"}
                        disabled={
                          updatingOrder === order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className={`cursor-pointer appearance-none rounded-md border px-3 py-1.5 pr-8 text-xs font-medium capitalize outline-none ${
                          getStatusClass(order.status)
                        }`}
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                        <option value="returned">
                          Returned
                        </option>
                      </select>

                      <FiChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                      />

                    </div>
                  </td>

                  {/* VIEW */}

                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="flex items-center gap-2 text-xs font-medium text-[#B87575] hover:text-[#9e5e5e]"
                    >
                      <FiEye size={16} />
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">

            {/* HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* CUSTOMER INFORMATION */}

            <div className="mb-6 border-b pb-5">

              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                Customer Information
              </h3>

              <p className="text-sm text-gray-800">
                <span className="font-medium">
                  Name:
                </span>{" "}
                {selectedOrder.user?.name || "Unknown"}
              </p>

              <p className="mt-2 text-sm text-gray-800">
                <span className="font-medium">
                  Email:
                </span>{" "}
                {selectedOrder.user?.email || "-"}
              </p>

              <p className="mt-2 text-sm text-gray-800">
                <span className="font-medium">
                  Shipping Address:
                </span>{" "}
                {selectedOrder.shippingAddress || "-"}
              </p>

            </div>

            {/* ORDER ITEMS */}

            <div className="mb-6 border-b pb-5">

              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                Order Items
              </h3>

              <div className="space-y-4">

                {selectedOrder.items?.map(
                  (item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-4 border-b pb-4 last:border-0"
                    >

                      <img
                        src={
                          item.product?.images?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.name}
                        className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
                      />

                      <div className="flex-1">

                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        {item.color && (
                          <p className="mt-1 text-xs text-gray-500">
                            Color: {item.color}
                          </p>
                        )}

                        {item.size && (
                          <p className="mt-1 text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                        )}

                      </div>

                      <p className="text-sm font-semibold text-gray-800">
                        Rs{" "}
                        {Number(
                          item.lineTotal || 0
                        ).toLocaleString()}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div>

              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    Rs{" "}
                    {Number(
                      selectedOrder.pricing?.subtotal || 0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>

                  <span>
                    Rs{" "}
                    {Number(
                      selectedOrder.pricing?.discount || 0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    Rs{" "}
                    {Number(
                      selectedOrder.pricing?.shipping || 0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>

                  <span>
                    Rs{" "}
                    {Number(
                      selectedOrder.pricing?.total || 0
                    ).toLocaleString()}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrderPage;