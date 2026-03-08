import axiosInstance from './axiosInstance';


export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get('/products', { params });
  return response.data;
};


export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};


export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};


export const createCategory = async (formData) => {
  const response = await axiosInstance.post('/create-category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateCategory = async (id, formData) => {
  const response = await axiosInstance.put(`/update-cat/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/delete-cat/${id}`);
  return response.data;
};

export const getBestsellingProducts = async () => {
  const response = await axiosInstance.get('/products/bestsellers');
  return response.data;
};


export const getNewArrivals = async () => {
  const response = await axiosInstance.get('/products/new-arrivals');
  return response.data;
};

export const getHomeReviews = async () => {
  const response = await axiosInstance.get('/reviews/home-reviews');
  console.log(response.data)
  return response.data;
};


export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};


export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/reviews/get-reviews/${productId}`);
  return response.data;
};


export const addReview = async (reviewData) => {
  const response = await axiosInstance.post('/reviews/add-review', reviewData);
  return response.data;
};


export const createCheckoutSession = async (paymentData) => {
  const response = await axiosInstance.post('/payment/create-checkout-session', paymentData);
  return response.data; 
};


export const getOrderDetails = async (tranId) => {
  const response = await axiosInstance.get(`/payment/order-details/${tranId}`);
  return response.data;
};


export const getUserOrders = async () => {
  try {
    const response = await axiosInstance.get('/payment/my-orders');
    return response.data; 
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  const response = await axiosInstance.put('/auth/update-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axiosInstance.post('/auth/change-password', passwordData);
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/payment/order/${orderId}`);
  return response.data;
};



// Admin Stats API
export const getAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  console.log(response.data.data);
  return response.data.data;
};


export const addProduct = (data) => axiosInstance.post('/create-product', data);


export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);



export const addProductImage = async (formData) => {
  const response = await axiosInstance.post('/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAllOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/payment/all-orders', { params });
    return response.data;
  } catch (error) {
    console.error("GetAllOrders API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(`/payment/update-order-status/${orderId}`, { status });
  return response.data;
};


export const getManageCustomers = async (params = {}) => {
  const response = await axiosInstance.get('/admin/manage-customers', { params });
  return response.data;
};


export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`/admin/delete-user/${id}`);
    return response.data;
};

export const updateProfileByAdmin = async (data) => {
  const response = await axiosInstance.patch(`/admin/update-profile`, data);
  return response.data;
};

export const updateAdminSettings = async (settingsData) => {
  const response = await axiosInstance.put('/admin/update-settings', settingsData);
  return response.data;
};

export const forgetPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forget-password', { email });
  return response.data;
};


export const resetPassword = async (token, password) => {
  const response = await axiosInstance.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};


