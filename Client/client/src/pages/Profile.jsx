import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiStar,
} from "react-icons/fi";

import {
  getMyReviewsAPI,
  deleteReviewAPI,
  getMyOrdersAPI,
  createReturnRequestAPI,
} from "../Services/api";

import ReviewForm from "../components/ReviewForm";

const Profile = () => {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const userId = user?._id;

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  // ORDERS

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // REVIEWS

  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsReloadKey, setReviewsReloadKey] = useState(0);

  // RETURN REQUEST

  const [returnTarget, setReturnTarget] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);

  // GET MY REVIEWS

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      if (!userId) {
        setReviews([]);
        setLoadingReviews(false);
        return;
      }

      try {
        setLoadingReviews(true);

        const response = await getMyReviewsAPI(userId);

        console.log("MY REVIEWS:", response.data);

        if (!ignore) {
          setReviews(response.data.reviews || []);
        }
      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error.response?.data || error.message,
        );

        if (!ignore) {
          setReviews([]);
        }
      } finally {
        if (!ignore) {
          setLoadingReviews(false);
        }
      }
    };

    loadReviews();

    return () => {
      ignore = true;
    };
  }, [userId, reviewsReloadKey]);

  // GET MY ORDERS

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      if (!userId) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      try {
        setLoadingOrders(true);

        const response = await getMyOrdersAPI(userId);

        console.log("MY ORDERS:", response.data);

        if (!ignore) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message,
        );

        if (!ignore) {
          setOrders([]);
        }
      } finally {
        if (!ignore) {
          setLoadingOrders(false);
        }
      }
    };

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [userId]);

  // DELETE REVIEW

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewAPI(reviewId);

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId),
      );
    } catch (error) {
      console.error(
        "Failed to delete review:",
        error.response?.data || error.message,
      );
    }
  };

  // CREATE RETURN REQUEST

  const handleReturnRequest = async () => {
    if (!returnTarget) return;

    if (!returnReason.trim()) {
      alert("Please enter a reason for return.");
      return;
    }

    try {
      setReturnLoading(true);

      await createReturnRequestAPI({
        user: userId,
        order: returnTarget.orderId,
        items: [
          {
            orderItemIndex: returnTarget.orderItemIndex,
            quantity: returnTarget.quantity || 1,
            reason: returnReason,
          },
        ],
      });

      alert("Return request submitted successfully!");

      setReturnTarget(null);
      setReturnReason("");
    } catch (error) {
      console.error(
        "Failed to create return request:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message || "Failed to submit return request.",
      );
    } finally {
      setReturnLoading(false);
    }
  };

  // REVIEWED PRODUCTS

  const reviewedProductIds = new Set(
    reviews.map((review) => review.product?._id).filter(Boolean),
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1000px]">
        {/* PAGE HEADER */}

        <div className="mb-6 sm:mb-10">
          <h1 className="font-serif text-[22px] font-bold text-[#222] sm:text-[28px]">
            MY ACCOUNT
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back, {user?.name || "User"}!
          </p>
        </div>

        {/* PROFILE INFORMATION */}

        <div className="mb-6 border border-gray-200 bg-white p-4 sm:mb-8 sm:p-8">
          {/* Phone: title on top, buttons below. Tablet up: side by side. */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[15px] font-semibold tracking-wide text-[#222] sm:text-[16px]">
              PROFILE INFORMATION
            </h2>

            {/* flex-1 makes both buttons share the width on phones */}
            <div className="flex items-center gap-3">
              <button className="flex flex-1 items-center justify-center gap-2 border border-[#222] px-4 py-2.5 text-[11px] font-medium transition duration-300 hover:bg-[#222] hover:text-white sm:flex-none sm:py-2">
                <FiEdit2 size={14} />
                EDIT PROFILE
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 border border-red-400 px-4 py-2.5 text-[11px] font-medium text-red-500 transition duration-300 hover:bg-red-500 hover:text-white sm:flex-none sm:py-2"
              >
                LOGOUT
              </button>
            </div>
          </div>

          {/* 1 column on phones, 3 columns from md up */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {/* NAME */}

            <div>
              <div className="mb-2 flex items-center gap-2 text-[#B87575]">
                <FiUser size={17} />

                <span className="text-[10px] font-medium tracking-wide">
                  NAME
                </span>
              </div>

              <p className="text-sm text-[#222]">
                {user?.name || "Not available"}
              </p>
            </div>

            {/* EMAIL */}

            <div>
              <div className="mb-2 flex items-center gap-2 text-[#B87575]">
                <FiMail size={17} />

                <span className="text-[10px] font-medium tracking-wide">
                  EMAIL
                </span>
              </div>

              {/* break-all stops long emails from overflowing */}
              <p className="break-all text-sm text-[#222]">
                {user?.email || "Not available"}
              </p>
            </div>

            {/* PHONE */}

            <div>
              <div className="mb-2 flex items-center gap-2 text-[#B87575]">
                <FiPhone size={17} />

                <span className="text-[10px] font-medium tracking-wide">
                  PHONE
                </span>
              </div>

              <p className="text-sm text-[#222]">
                {user?.PhoneNumber || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* MY ORDERS */}

        <div className="mb-6 border border-gray-200 bg-white p-4 sm:mb-8 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FiPackage size={20} className="text-[#B87575]" />

            <h2 className="text-[15px] font-semibold tracking-wide text-[#222] sm:text-[16px]">
              MY ORDERS
            </h2>
          </div>

          {loadingOrders ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500">
              Your order history will appear here.
            </p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 p-4 sm:p-6"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="break-all text-sm font-semibold text-[#222]">
                      {order.orderNumber}
                    </p>

                    <span className="border border-[#B87575] px-3 py-1 text-[10px] font-medium uppercase text-[#B87575]">
                      {order.status}
                    </span>
                  </div>

                  <p className="mb-2 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="mb-2 text-sm text-gray-700">
                    Total: Rs {order.pricing?.total}
                  </p>

                  {order.status === "delivered" && (
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                      {order.items?.map((item, index) => {
                        const productId = item.product?._id || item.product;

                        const alreadyReviewed =
                          reviewedProductIds.has(productId);

                        return (
                          <div
                            key={item.product?._id || item._id || index}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                          >
                            <p className="text-sm text-[#222]">{item.name}</p>

                            <div className="flex items-center gap-2">
                              {alreadyReviewed ? (
                                <span className="text-[10px] text-gray-400">
                                  Already reviewed
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    setReviewTarget({
                                      orderId: order._id,
                                      product: item.product,
                                    })
                                  }
                                  className="flex-1 border border-[#B87575] px-3 py-2.5 text-[10px] font-medium text-[#B87575] transition duration-300 hover:bg-[#B87575] hover:text-white sm:flex-none sm:py-1.5"
                                >
                                  WRITE A REVIEW
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  setReturnTarget({
                                    orderId: order._id,
                                    orderItemIndex: index,
                                    quantity: item.quantity || 1,
                                    productName: item.name,
                                  })
                                }
                                className="flex-1 border border-red-300 px-3 py-2.5 text-[10px] font-medium text-red-500 transition duration-300 hover:bg-red-500 hover:text-white sm:flex-none sm:py-1.5"
                              >
                                REQUEST RETURN
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MY REVIEWS */}

        <div className="border border-gray-200 bg-white p-4 sm:p-8">
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <FiStar size={20} className="text-[#B87575]" />

            <h2 className="text-[15px] font-semibold tracking-wide text-[#222] sm:text-[16px]">
              MY REVIEWS
            </h2>
          </div>

          {loadingReviews ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">
                You haven't written any reviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
                    <div className="min-w-0">
                      <h3 className="mb-3 text-[15px] font-semibold text-[#222]">
                        {review.product?.name || "Product"}
                      </h3>

                      <div className="mb-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={16}
                            className={
                              star <= review.rating
                                ? "fill-[#B87575] text-[#B87575]"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {review.title && (
                        <h4 className="mb-2 text-sm font-semibold text-[#222]">
                          {review.title}
                        </h4>
                      )}

                      {review.comment && (
                        <p className="max-w-[650px] text-sm leading-6 text-gray-500">
                          {review.comment}
                        </p>
                      )}
                    </div>

                    {/* Phone: EDIT and DELETE split the row evenly */}
                    <div className="flex items-center gap-3">
                      <button className="flex flex-1 items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 text-[10px] font-medium transition duration-300 hover:border-[#B87575] hover:text-[#B87575] md:flex-none md:py-2">
                        <FiEdit2 size={14} />
                        EDIT
                      </button>

                      <button
                        onClick={() => handleDelete(review._id)}
                        className="flex flex-1 items-center justify-center gap-2 border border-red-200 px-4 py-2.5 text-[10px] font-medium text-red-500 transition duration-300 hover:bg-red-500 hover:text-white md:flex-none md:py-2"
                      >
                        <FiTrash2 size={14} />
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REVIEW FORM MODAL */}

      {reviewTarget && (
        <ReviewForm
          userId={userId}
          orderId={reviewTarget.orderId}
          product={reviewTarget.product}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => setReviewsReloadKey((prev) => prev + 1)}
        />
      )}

      {/* RETURN REQUEST MODAL */}

      {returnTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto bg-white p-4 shadow-xl sm:p-6">
            <h2 className="text-lg font-semibold text-[#222]">
              Request Return
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Product: {returnTarget.productName}
            </p>

            <label className="mb-2 mt-5 block text-sm font-medium text-[#222]">
              Reason for Return
            </label>

            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Enter your reason for return..."
              className="min-h-[120px] w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#B87575]"
            />

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setReturnTarget(null);
                  setReturnReason("");
                }}
                disabled={returnLoading}
                className="border border-gray-300 px-4 py-2.5 text-xs font-medium sm:py-2"
              >
                CANCEL
              </button>

              <button
                onClick={handleReturnRequest}
                disabled={returnLoading}
                className="bg-[#B87575] px-4 py-2.5 text-xs font-medium text-white disabled:opacity-50 sm:py-2"
              >
                {returnLoading ? "SUBMITTING..." : "SUBMIT REQUEST"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
