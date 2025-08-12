

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;// backend base url
console.log("API_BASE_URL:", API_BASE_URL);
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in the environment variables.");
}


let token = localStorage.getItem("token");   //check if token is present in local storage

export const setToken = (newToken) => {  // function to set the token
  token = newToken;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const getHeaders = () => {              // function to get headers for API requests
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (endpoint, options = {}) => {  // function to make API requests, with endpoint and options
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
export const register = (userData) => {                    // function to register a new user
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = (credentials) => {          // function to login a user, credentials are email and password
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = () => {           // function to get the current logged-in user
  return request("/auth/me");
};

export const logout = () => {                     // function to logout the user
  return request("/auth/logout", { method: "POST" });
};






// Product methods
export const getProducts = (params = {}) => {                           // function to get products, with optional query parameters
  const queryString = new URLSearchParams(params).toString();
  return request(`/products?${queryString}`);
};

export const getProduct = (id) => {                               // function to get a single product by ID
  return request(`/products/${id}`);
};




// Order methods
export const createOrder = (orderData) => {                    // function to create a new order,orderData contains order details
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getUserOrders = () => {                      // function to get orders of the current user
  return request("/orders/my-orders");
};

export const getOrder = (id) => {                        // function to get a single order by ID                   
  return request(`/orders/${id}`);
};





// User methods

export const getUsers = () => {                   // function to get all users
  return request("/users");
};

export const createProduct = (productData) => {        // function to create a new product, productData contains product details                         
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
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

const apiService = {                     //this object contains all the methods for API requests
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
  getAllOrders,
  getUserOrdersById,
  updateOrderStatus
};

export default apiService;