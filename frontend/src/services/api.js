import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname.includes('serveo.net')
        ? 'https://suhan-backend.serveo.net/api'
        : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'),
    headers: {
        'Content-Type': 'application/json',
    },
});

export const orderAPI = {
    createOrder: (data) => api.post('/orders/', data),
    getOrders: () => api.get('/orders/'),
    calculateShipping: (deliveryPincode, selectedItemIds) => api.post('/orders/calculate_shipping/', {
        delivery_pincode: deliveryPincode,
        selected_item_ids: selectedItemIds
    }),
    requestReturn: (orderId, reason, description, imageFile) => {
        const formData = new FormData();
        formData.append('reason', reason);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        return api.post(`/orders/${orderId}/request_return/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const returnAPI = {
    getReturns: () => api.get('/returns/'),
    approveReturn: (returnId) => api.post(`/returns/${returnId}/approve/`),
    rejectReturn: (returnId) => api.post(`/returns/${returnId}/reject/`),
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const cartAPI = {
    getCart: () => api.get('/cart/'),
    addToCart: (productId, quantity, size) => api.post('/cart/add/', { product_id: productId, quantity, size }),
    removeFromCart: (itemId) => api.post('/cart/remove_item/', { item_id: itemId }),
    updateQuantity: (itemId, quantity) => api.post('/cart/update_quantity/', { item_id: itemId, quantity }),
};

export const contactAPI = {
    submitQuery: (data) => api.post('/queries/', data),
    getQueries: () => api.get('/queries/'),
    markResolved: (queryId) => api.patch(`/queries/${queryId}/`, { is_resolved: true }),
};

export default api;
