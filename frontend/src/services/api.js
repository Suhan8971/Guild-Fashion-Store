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
    getEligibleItems: (orderId) => api.get(`/orders/${orderId}/eligible_items/`),
    cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel/`, { reason }),
    refundOrder: (id) => api.post(`/orders/${id}/refund/`),
};

export const returnAPI = {
    getReturns: () => api.get('/returns/'),
    approveReturn: (returnId) => api.post(`/returns/${returnId}/approve/`),
    rejectReturn: (returnId) => api.post(`/returns/${returnId}/reject/`),
};

export const postOrderAPI = {
    getRequests: () => api.get('/post-order-requests/'),
    submitRequest: (orderId, items) => {
        const formData = new FormData();
        formData.append('order', orderId);
        const itemsPayload = items.map(item => ({
            order_item_id: item.order_item_id,
            quantity: item.quantity,
            request_type: item.request_type,
            reason: item.reason,
            exchange_size: item.exchange_size || ''
        }));
        formData.append('items', JSON.stringify(itemsPayload));
        
        items.forEach((item, index) => {
            if (item.imageFile) {
                formData.append(`image_${index}`, item.imageFile);
            }
        });
        
        return api.post('/post-order-requests/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    approveRequest: (requestId, localPickup = false) => api.post(`/post-order-requests/${requestId}/approve/`, { local_pickup: localPickup }),
    rejectRequest: (requestId, adminNotes) => api.post(`/post-order-requests/${requestId}/reject/`, { admin_notes: adminNotes }),
    trackRequest: (requestId) => api.post(`/post-order-requests/${requestId}/track/`),
    processRefund: (requestId) => api.post(`/post-order-requests/${requestId}/process_refund/`),
    shipReplacement: (requestId) => api.post(`/post-order-requests/${requestId}/ship_replacement/`),
    completeRequest: (requestId) => api.post(`/post-order-requests/${requestId}/mark_completed/`),
};

export const policyAPI = {
    getConfig: () => api.get('/return-policy-config/'),
    updateConfig: (data) => api.put('/return-policy-config/1/', data),
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

export const addressAPI = {
    getAddresses: () => api.get('/addresses/'),
    addAddress: (data) => api.post('/addresses/', data),
    editAddress: (id, data) => api.put(`/addresses/${id}/`, data),
    deleteAddress: (id) => api.delete(`/addresses/${id}/`),
    setDefault: (id) => api.post(`/addresses/${id}/set_default/`),
};

export const profileAPI = {
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (phone) => api.post('/auth/profile/', { phone_number: phone }),
};

export default api;
