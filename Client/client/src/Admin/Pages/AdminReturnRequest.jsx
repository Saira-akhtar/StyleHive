import { useEffect, useState } from "react";
import {
  FiRefreshCcw,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";

import {
  getAllReturnRequestsAPI,
  updateReturnRequestAPI,
} from "../../Services/api";

const AdminReturnRequest = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingRequest, setUpdatingRequest] = useState(null);

  // ===============================
  // FETCH ALL RETURN REQUESTS
  // ===============================

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        setLoading(true);

        const response = await getAllReturnRequestsAPI();

        console.log("RETURN REQUESTS:", response.data);

        setReturnRequests(
          response.data.returnRequests ||
            response.data.retturnRequests ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to fetch return requests:",
          error.response?.data || error.message
        );

        setReturnRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnRequests();
  }, []);

  // ===============================
  // UPDATE RETURN REQUEST STATUS
  // ===============================

  const handleStatusChange = async (requestId, status) => {
    try {
      setUpdatingRequest(requestId);

      const response = await updateReturnRequestAPI(
        requestId,
        status
      );

      const updatedRequest =
        response.data.returnRequest;

      setReturnRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: updatedRequest.status,
                adminNote: updatedRequest.adminNote,
              }
            : request
        )
      );

      if (selectedRequest?._id === requestId) {
        setSelectedRequest((prev) => ({
          ...prev,
          status: updatedRequest.status,
          adminNote: updatedRequest.adminNote,
        }));
      }
    } catch (error) {
      console.error(
        "Failed to update return request:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update return request"
      );
    } finally {
      setUpdatingRequest(null);
    }
  };

  // ===============================
  // STATUS COLORS
  // ===============================

  const getStatusClass = (status) => {
    switch (status) {
      case "requested":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "refunded":
        return "bg-green-50 text-green-700 border-green-200";

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
          Loading return requests...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Return Requests
        </h1>

        <p className="mt-2 text-gray-600">
          Manage customer product return requests.
        </p>
      </div>

      {/* RETURN REQUEST COUNT */}

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#B87575]/10 text-[#B87575]">
          <FiRefreshCcw size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Return Requests
          </p>

          <p className="text-xl font-bold text-gray-800">
            {returnRequests.length}
          </p>
        </div>
      </div>

      {/* TABLE */}

      {returnRequests.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">
            No return requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Order
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Items
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Date
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
              {returnRequests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* CUSTOMER */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {request.user?.name || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {request.user?.email || ""}
                    </p>
                  </td>

                  {/* ORDER */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {request.order?.orderNumber || "N/A"}
                    </p>
                  </td>

                  {/* ITEMS */}

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {request.items?.length || 0} Items
                  </td>

                  {/* DATE */}

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {request.createdAt
                      ? new Date(
                          request.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <div className="relative inline-block">
                      <select
                        value={request.status}
                        disabled={
                          updatingRequest === request._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            request._id,
                            e.target.value
                          )
                        }
                        className={`cursor-pointer appearance-none rounded-md border px-3 py-1.5 pr-8 text-xs font-medium capitalize outline-none ${getStatusClass(
                          request.status
                        )}`}
                      >
                        <option value="requested">
                          Requested
                        </option>

                        <option value="approved">
                          Approved
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>

                        <option value="refunded">
                          Refunded
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
                        setSelectedRequest(request)
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

      {/* RETURN REQUEST DETAILS MODAL */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Return Request Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Order:{" "}
                  {selectedRequest.order?.orderNumber || "N/A"}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* CUSTOMER */}

            <div className="mb-6 border-b pb-5">

              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                Customer Information
              </h3>

              <p className="text-sm text-gray-800">
                <span className="font-medium">
                  Name:
                </span>{" "}
                {selectedRequest.user?.name || "Unknown"}
              </p>

              <p className="mt-2 text-sm text-gray-800">
                <span className="font-medium">
                  Email:
                </span>{" "}
                {selectedRequest.user?.email || "-"}
              </p>

            </div>

            {/* RETURN ITEMS */}

            <div className="mb-6 border-b pb-5">

              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                Return Items
              </h3>

              <div className="space-y-4">

                {selectedRequest.items?.map(
                  (item, index) => {
                    const orderItem =
                      selectedRequest.order?.items?.[
                        item.orderItemIndex
                      ];

                    return (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-0"
                      >

                        <p className="text-sm font-medium text-gray-800">
                          {orderItem?.name ||
                            `Product ${item.orderItemIndex + 1}`}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          Reason: {item.reason}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* REQUEST STATUS */}

            <div>

              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                Request Status
              </h3>

              <div className="flex items-center justify-between">

                <span
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize ${getStatusClass(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>

                <p className="text-xs text-gray-400">
                  {selectedRequest.createdAt
                    ? new Date(
                        selectedRequest.createdAt
                      ).toLocaleString()
                    : ""}
                </p>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturnRequest;