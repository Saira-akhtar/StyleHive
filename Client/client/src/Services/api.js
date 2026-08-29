import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ===============================
// PRODUCT APIs
// ===============================

export const getProductsAPI = () => {
  return API.get("/product/get-products");
};

export const addProductAPI = (data) => {
  return API.post("/product/add-product", data);
};

export const updateProductAPI = (id, data) => {
  return API.put(`/product/update-product/${id}`, data);
};

export const deleteProductAPI = (id) => {
  return API.delete(`/product/delete-product/${id}`);
};

export const getCategoriesAPI = () => {
  return API.get("/category/get-categories");
};

export const getProductAPI = (id) => {
  return API.get(`/product/get-product/${id}`);
};
export const addToCartAPI = (data) => {
  return API.post("/cart/add-to-cart", data);
};

// Cart APIs

export const getCartAPI = (userId) => API.get(`/cart/get-cart/${userId}`);

export const updateCartQuantityAPI = (
  userId,
  productId,
  variantSku,
  quantity,
) =>
  API.put(
    `/cart/update-cart-item-quantity/${userId}/${productId}/${variantSku || "null"}`,
    { quantity },
  );

export const removeFromCartAPI = (userId, productId, variantSku) =>
  API.delete(
    `/cart/remove-from-cart/${userId}/${productId}/${variantSku || "null"}`,
  );

export const clearCartAPI = (userId) =>
  API.delete(`/cart/clear-cart/${userId}`);

export const createOrderAPI = (data) => {
  return API.post("/order/create-order", data);
};
export const getMyOrdersAPI = (userId) => {
  return API.get(`/order/get-all-orders/${userId}`);
};

// Coupon API

export const applyCouponAPI = ({ code, cartTotal }) => {
  return API.post("/coupon/apply-coupon", {
    code,
    cartTotal,
  });
};

// ===============================
// REVIEW APIs
// ===============================

export const getAllReviewsAPI = (productId) => {
  return API.get(`/review/get-all-reviews/${productId}`);
};

export const getMyReviewsAPI = (userId) => {
  return API.get(`/review/get-my-reviews/${userId}`);
};

export const createReviewAPI = (data) => {
  return API.post("/review/create-review", data);
};

export const updateReviewAPI = (reviewId, data) => {
  return API.put(`/review/update-review/${reviewId}`, data);
};

export const deleteReviewAPI = (reviewId) => {
  return API.delete(`/review/delete-review/${reviewId}`);
};

// ===============================
// RETURN REQUEST APIs
// ===============================

export const createReturnRequestAPI = (data) => {
  return API.post("/return-request/create-return-request", data);
};

export const getReturnRequestsOfUserAPI = (userId) => {
  return API.get(`/return-request/get-return-request-of-user/${userId}`);
};

export const getAllOrdersAdminAPI = () => {
  return API.get("/order/get-all-orders-admin");
};

export const updateOrderAPI = (orderId, status) => {
  return API.put(`/order/update-order/${orderId}`, {
    status,
  });
};
// ===============================
// RETURN REQUEST APIs
// ===============================

export const getAllReturnRequestsAPI = () => {
  return API.get("/return-request/get-all-return-requests");
};

export const updateReturnRequestAPI = (returnRequestId, status) => {
  return API.put(`/return-request/update-return-request/${returnRequestId}`, {
    status,
  });
};

export const getAllUsersAPI = () => {
  return API.get("/auth/get-all-users");
};
export default API;
