import { useState, useEffect } from 'react';
import api, { orderAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Return Modal State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
    const [returnReason, setReturnReason] = useState('size');
    const [returnDescription, setReturnDescription] = useState('');
    const [submittingReturn, setSubmittingReturn] = useState(false);

    const [returnImage, setReturnImage] = useState(null);

    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${imagePath}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const openReturnModal = (order) => {
        setSelectedOrderForReturn(order);
        setReturnReason('size');
        setReturnDescription('');
        setReturnImage(null);
        setReturnModalOpen(true);
    };

    const submitReturn = async (e) => {
        e.preventDefault();
        setSubmittingReturn(true);
        try {
            await orderAPI.requestReturn(selectedOrderForReturn.id, returnReason, returnDescription, returnImage);
            setReturnModalOpen(false);
            fetchOrders(); // Refresh to get update status
            alert("Return requested successfully. We will review your request shortly.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to submit return request");
        } finally {
            setSubmittingReturn(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guild-red"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                    <Link
                        to="/"
                        className="bg-guild-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors inline-block"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Helper map for better status formatting
    const statusMap = {
        'placed': { label: 'Placed', color: 'bg-yellow-100 text-yellow-800' },
        'shipped': { label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
        'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
        'return_requested': { label: 'Return Pending', color: 'bg-orange-100 text-orange-800' },
        'returned': { label: 'Returned', color: 'bg-gray-100 text-gray-800' },
        'return_rejected': { label: 'Return Rejected', color: 'bg-red-100 text-red-800' },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate('/')}
                className="mb-4 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Store
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

            <div className="space-y-8">
                {orders.map((order) => {
                    const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
                    return (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Order Placed</p>
                                        <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Total</p>
                                        <p className="font-medium text-gray-900">
                                            ₹ {order.total_price}
                                            {Number(order.shipping_cost) > 0 && <span className="text-xs text-gray-500 block">inc. ₹{order.shipping_cost} shipping</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-sm text-gray-500">Order # <span className="text-gray-900 font-mono">{order.id}</span></p>

                                    {order.status === 'delivered' && (
                                        <button
                                            onClick={() => openReturnModal(order)}
                                            className="text-sm text-guild-red hover:text-red-800 font-medium underline"
                                        >
                                            Return Order
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 py-4 divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-4 flex items-center space-x-6">
                                        <div className="flex-shrink-0 h-20 w-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={getImageUrl(item.product_image)}
                                                alt={item.product_name}
                                                className="h-full w-full object-contain"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                                                <Link to={`/product/${item.product}`} className="hover:text-guild-red transition-colors">
                                                    {item.product_name}
                                                </Link>
                                            </h4>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span>Quantity: {item.quantity}</span>
                                                {item.size && <span>Size: {item.size}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right font-medium text-gray-900">
                                            ₹ {item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Return Request Modal */}
            {returnModalOpen && selectedOrderForReturn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Request Return</h2>
                            <button onClick={() => setReturnModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitReturn}>
                            <p className="text-sm text-gray-600 mb-4">
                                Returning Order #{selectedOrderForReturn.id} (₹{selectedOrderForReturn.total_price})
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                                <select
                                    value={returnReason}
                                    onChange={(e) => {
                                        setReturnReason(e.target.value);
                                        if (e.target.value !== 'damaged') setReturnImage(null);
                                    }}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-guild-red focus:border-guild-red p-2 border"
                                    required
                                >
                                    <option value="size">Size Issue (Too big/small)</option>
                                    <option value="damaged">Product Damaged/Defective</option>
                                    <option value="not_liked">Did Not Like the Product</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {returnReason === 'damaged' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Required)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReturnImage(e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-guild-red hover:file:bg-red-100 cursor-pointer border border-gray-300 rounded-lg p-2"
                                        required
                                    />
                                    {returnImage && <p className="text-xs text-green-600 mt-1">Image selected: {returnImage.name}</p>}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Required)</label>
                                <textarea
                                    value={returnDescription}
                                    onChange={(e) => setReturnDescription(e.target.value)}
                                    rows="3"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-guild-red focus:border-guild-red p-2 border"
                                    placeholder="Please provide more details on why you are returning this item..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReturnModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReturn}
                                    className="px-4 py-2 bg-guild-red text-white hover:bg-red-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {submittingReturn ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
