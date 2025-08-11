// const API_BASE_URL ="http://localhost:5000/api"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
console.log("API Base URL:", API_BASE_URL);
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in the environment variables.");
}
console.log("API Base URL:", API_BASE_URL);

let token = localStorage.getItem("token");

export const setToken = (newToken) => {
  token = newToken;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth methods
export const register = (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = (credentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = () => {
  return request("/auth/me");
};

export const logout = () => {
  return request("/auth/logout", { method: "POST" });
};

// Product methods
export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/products?${queryString}`);
};

export const getProduct = (id) => {
  return request(`/products/${id}`);
};

// Order methods
export const createOrder = (orderData) => {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getUserOrders = () => {
  return request("/orders/my-orders");
};

export const getOrder = (id) => {
  return request(`/orders/${id}`);
};

// User methods

export const getUsers = () => {
  return request("/users");
};

export const createProduct = (productData) => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = (id, productData) => {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = (id) => {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
};

export const getAllOrders = () => {
  return request("/orders");
};
export const getUserOrdersById = (userId) => {
  return request(`/users/${userId}/orders`);
};

export const updateOrderStatus = (orderId, data) => {
  return request(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

const apiService = {
  setToken,
  register,
  login,
  getCurrentUser,
  logout,
  getProducts,
  getProduct,
  createOrder,
  getUserOrders,
  getOrder,
  getUsers,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getUserOrdersById,
  updateOrderStatus
};

export default apiService;