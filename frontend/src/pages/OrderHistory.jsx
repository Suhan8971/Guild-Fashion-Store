import { useState, useEffect } from 'react';
import api, { orderAPI, postOrderAPI, policyAPI, cartAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { getImageUrl } from '../utils/imageUrl';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postOrderRequests, setPostOrderRequests] = useState([]);

    // Return Modal State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
    const [submittingReturn, setSubmittingReturn] = useState(false);
    
    // Multi-item returns state
    const [eligibleData, setEligibleData] = useState(null);
    const [selectedItems, setSelectedItems] = useState({}); // itemId -> { checked, quantity, request_type, reason, exchange_size, imageFile, imageName }
    const [fetchingEligibility, setFetchingEligibility] = useState(false);

    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const { showAlert } = useModal();

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

    const downloadInvoice = (order) => {
        try {
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(22);
            doc.setTextColor(136, 14, 14); // Guild Red color
            doc.text("GUILD FASHION STORE", 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Premium Apparel & Streetwear", 14, 26);
            doc.text("Email: support@guildfashion.com | Website: guildfashion.com", 14, 31);
            
            // Divider line
            doc.setDrawColor(220, 220, 220);
            doc.line(14, 36, 196, 36);
            
            // Invoice details
            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);
            doc.setFont("helvetica", "bold");
            doc.text(`INVOICE: #INV-${order.id}`, 14, 45);
            doc.setFont("helvetica", "normal");
            doc.text(`Order Date: ${new Date(order.created_at).toLocaleString()}`, 14, 51);
            
            // Determine Payment Method and Status
            const isOnline = order.transactions && order.transactions.length > 0;
            const payMethod = isOnline ? "Online (Razorpay)" : "COD (Cash on Delivery)";
            const payStatus = isOnline ? "Paid" : "Pending (Cash on Delivery)";
            
            doc.text(`Payment Method: ${payMethod}`, 14, 57);
            doc.text(`Payment Status: ${payStatus}`, 14, 63);
            
            // Shipping Address details
            doc.setFont("helvetica", "bold");
            doc.text("Shipping Address:", 120, 45);
            doc.setFont("helvetica", "normal");
            doc.text(`${order.shipping_name || 'Customer'}`, 120, 51);
            doc.text(`${order.shipping_address || ''}`, 120, 57);
            doc.text(`${order.shipping_city || ''}, ${order.shipping_state || ''} - ${order.shipping_pincode || ''}`, 120, 63);
            doc.text(`Phone: ${order.shipping_phone || ''}`, 120, 69);
            
            // Table of items
            const tableColumn = ["Product Name", "Size", "Quantity", "Unit Price", "Total"];
            const tableRows = [];
            
            order.items.forEach(item => {
                const itemData = [
                    item.product_name,
                    item.size || 'N/A',
                    item.quantity,
                    `INR ${item.price}`,
                    `INR ${parseFloat(item.price) * item.quantity}`
                ];
                tableRows.push(itemData);
            });
            
            doc.autoTable({
                startY: 78,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [136, 14, 14] }, // Guild Red
                styles: { fontSize: 9 }
            });
            
            // Totals
            let finalY = doc.lastAutoTable.finalY + 12;
            doc.setFont("helvetica", "bold");
            doc.text(`Subtotal: INR ${order.total_price - order.shipping_cost}`, 140, finalY);
            doc.text(`Shipping: INR ${order.shipping_cost}`, 140, finalY + 6);
            doc.setFontSize(13);
            doc.text(`Order Total: INR ${order.total_price}`, 140, finalY + 14);
            
            doc.save(`Invoice_Order_${order.id}.pdf`);
        } catch (err) {
            console.error("Failed to generate PDF invoice:", err);
            showAlert({ title: 'Invoice Failed', message: 'Failed to download PDF invoice.', type: 'error' });
        }
    };

    const handleReorder = async (order) => {
        try {
            for (const item of order.items) {
                await cartAPI.addToCart(item.product, item.quantity, item.size);
            }
            await fetchCart();
            showAlert({ title: 'Cart Updated', message: 'All items from this order have been added to your cart!', type: 'success' });
            navigate('/cart');
        } catch (err) {
            console.error("Reorder failed:", err);
            showAlert({ title: 'Reorder Failed', message: 'Failed to add some items to your cart.', type: 'error' });
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await postOrderAPI.getRequests();
            setPostOrderRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch return requests", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchRequests();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const openReturnModal = async (order) => {
        setSelectedOrderForReturn(order);
        setFetchingEligibility(true);
        try {
            const res = await orderAPI.getEligibleItems(order.id);
            setEligibleData(res.data);
            
            const initialSelection = {};
            res.data.items.forEach(item => {
                initialSelection[item.id] = {
                    checked: false,
                    quantity: 1,
                    request_type: 'return',
                    reason: res.data.reasons[0] || 'Other',
                    exchange_size: item.available_variants[0]?.size || '',
                    imageFile: null,
                    imageName: ''
                };
            });
            setSelectedItems(initialSelection);
            setReturnModalOpen(true);
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Eligibility Error', message: error.response?.data?.error || "Failed to fetch return eligibility details.", type: 'error' });
        } finally {
            setFetchingEligibility(false);
        }
    };

    const handleTrackRequest = async (requestId) => {
        try {
            const res = await postOrderAPI.trackRequest(requestId);
            const data = res.data;
            if (data.tracking_data && data.tracking_data.length > 0) {
                const activities = data.tracking_data.map(act => `${act.date || ''}: ${act.activity} at ${act.location || ''}`).join('\n');
                showAlert({
                    title: `Tracking Request #${requestId}`,
                    message: `AWB: ${data.awb}\nStatus: ${data.shiprocket_status || data.status}\nCourier: ${data.courier}\n\nActivities:\n${activities}`,
                    type: 'info'
                });
            } else {
                showAlert({
                    title: `Tracking Request #${requestId}`,
                    message: `AWB: ${data.awb}\nStatus: ${data.status}\nCourier: ${data.courier}\nNo detailed tracking events yet.`,
                    type: 'info'
                });
            }
            fetchRequests(); // Refresh request state
        } catch (error) {
            console.error("Track failed:", error);
            showAlert({ title: 'Tracking Failed', message: "Failed to fetch tracking details from Shiprocket.", type: 'error' });
        }
    };

    const submitReturn = async (e) => {
        e.preventDefault();
        
        const itemsPayload = [];
        Object.keys(selectedItems).forEach(itemId => {
            const selectInfo = selectedItems[itemId];
            if (selectInfo.checked) {
                itemsPayload.push({
                    order_item_id: parseInt(itemId),
                    quantity: selectInfo.quantity,
                    request_type: selectInfo.request_type,
                    reason: selectInfo.reason,
                    exchange_size: selectInfo.exchange_size,
                    imageFile: selectInfo.imageFile
                });
            }
        });
        
        if (itemsPayload.length === 0) {
            showAlert({ title: 'No Items Selected', message: "Please select at least one item to return/exchange/replace.", type: 'warning' });
            return;
        }
        
        setSubmittingReturn(true);
        try {
            await postOrderAPI.submitRequest(selectedOrderForReturn.id, itemsPayload);
            setReturnModalOpen(false);
            fetchOrders();
            fetchRequests();
            showAlert({ title: 'Request Submitted', message: "Post-order request submitted successfully.", type: 'success' });
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Submission Failed', message: error.response?.data?.error || "Failed to submit request.", type: 'error' });
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
        'placed': { label: 'Order Placed', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
        'shipped': { label: 'Shipped', color: 'bg-blue-50 text-blue-800 border-blue-200' },
        'delivered': { label: 'Delivered', color: 'bg-green-50 text-green-800 border-green-200' },
        'return_requested': { label: 'Return Pending', color: 'bg-orange-50 text-orange-800 border-orange-200' },
        'returned': { label: 'Returned', color: 'bg-gray-50 text-gray-800 border-gray-200' },
        'return_rejected': { label: 'Return Rejected', color: 'bg-red-50 text-red-800 border-red-200' },
        'cancelled': { label: 'Order Cancelled', color: 'bg-red-50 text-red-800 border-red-200' },
        'refunded': { label: 'Refunded', color: 'bg-green-50 text-green-800 border-green-200' },
    };

    const isWithinReturnWindow = (order) => {
        if (order.status !== 'delivered' || !order.delivered_at) return false;
        const deliveredDate = new Date(order.delivered_at);
        const diffDays = (new Date().getTime() - deliveredDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
    };

    const getRemainingReturnDays = (order) => {
        if (!order.delivered_at) return 0;
        const deliveredDate = new Date(order.delivered_at);
        const diffDays = (new Date().getTime() - deliveredDate.getTime()) / (1000 * 3600 * 24);
        const remaining = 7 - Math.floor(diffDays);
        return remaining > 0 ? remaining : 0;
    };

    const renderProgressBar = (status) => {
        if (status === 'cancelled') {
            return (
                <div className="flex items-center text-red-600 font-semibold gap-1.5 text-xs py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Order Cancelled
                </div>
            );
        }
        if (status === 'refunded') {
            return (
                <div className="flex items-center text-green-600 font-semibold gap-1.5 text-xs py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                    Payment Refunded Successfully
                </div>
            );
        }
        if (status === 'returned') {
            return (
                <div className="flex items-center text-gray-500 font-semibold gap-1.5 text-xs py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                    Returned & Refunded
                </div>
            );
        }
        if (status === 'return_requested') {
            return (
                <div className="flex items-center text-orange-600 font-semibold gap-1.5 text-xs py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Return Review Pending
                </div>
            );
        }
        if (status === 'return_rejected') {
            return (
                <div className="flex items-center text-red-600 font-semibold gap-1.5 text-xs py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    Return Policy Rejected
                </div>
            );
        }

        const steps = [
            { key: 'placed', label: 'Placed' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' }
        ];

        let activeIdx = 0;
        if (status === 'shipped') activeIdx = 1;
        if (status === 'delivered') activeIdx = 2;

        return (
            <div className="w-full max-w-md py-4">
                <div className="flex items-center justify-between relative">
                    {/* Background track line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0">
                        <div 
                            className="h-full bg-guild-red transition-all duration-500" 
                            style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                    {steps.map((step, idx) => {
                        const isCompleted = idx <= activeIdx;
                        const isActive = idx === activeIdx;
                        return (
                            <div key={step.key} className="flex flex-col items-center relative z-10">
                                <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm transition-all duration-300
                                        ${isCompleted ? 'bg-guild-red text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                                >
                                    {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'text-guild-red' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center text-gray-500 hover:text-guild-red transition-colors text-sm font-semibold"
            >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Store
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Orders</h1>

            <div className="space-y-8">
                {orders.map((order) => {
                    const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-800 border-gray-200' };
                    const isEligible = isWithinReturnWindow(order);
                    const remainingDays = getRemainingReturnDays(order);
                    const isOnline = order.transactions && order.transactions.length > 0;
                    const paymentMethodLabel = isOnline ? "Online (Razorpay)" : "COD (Cash on Delivery)";
                    const paymentStatusLabel = isOnline ? "Paid" : "Pending";

                    return (
                        <div key={order.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${['cancelled', 'refunded'].includes(order.status) ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200'}`}>
                            {/* Order Header */}
                            <div className="bg-neutral-50 px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
                                    <div>
                                        <p className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Order Date</p>
                                        <p className="font-semibold text-gray-800 mt-0.5">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Order ID</p>
                                        <p className="font-mono font-bold text-gray-900 mt-0.5">#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Status</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 capitalize ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Total Price</p>
                                        <p className="font-extrabold text-gray-900 mt-0.5">
                                            ₹ {order.total_price}
                                        </p>
                                    </div>
                                </div>

                                {/* Header Actions */}
                                <div className="flex flex-wrap gap-2.5">
                                    <button
                                        onClick={() => downloadInvoice(order)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-xs font-bold transition-all shadow-sm"
                                        title="Download Invoice PDF"
                                    >
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Invoice
                                    </button>
                                    <button
                                        onClick={() => handleReorder(order)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                        <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reorder
                                    </button>
                                    {isEligible && (
                                        <button
                                            onClick={() => openReturnModal(order)}
                                            className="px-3.5 py-1.5 bg-guild-red hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                        >
                                            Return / Exchange ({remainingDays}d left)
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Order Details Body */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                {/* Product Items list */}
                                <div className="lg:col-span-2 p-6 divide-y divide-gray-100">
                                    <div className="space-y-4 pb-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-start gap-4">
                                                <div className="h-20 w-20 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden bg-neutral-50 p-1">
                                                    <img
                                                        src={getImageUrl(item.product_image)}
                                                        alt={item.product_name}
                                                        className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link 
                                                        to={`/product/${item.product}`} 
                                                        className="text-base font-bold text-gray-900 hover:text-guild-red transition-colors line-clamp-1"
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 font-medium">
                                                        <span>Size: <strong className="text-gray-800">{item.size || 'N/A'}</strong></span>
                                                        <span>Qty: <strong className="text-gray-800">{item.quantity}</strong></span>
                                                        <span>Price: <strong className="text-gray-800">₹{item.price}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="text-right font-bold text-gray-900 text-sm">
                                                    ₹ {parseFloat(item.price) * item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.status === 'cancelled' && (
                                        <div className="bg-red-50 text-red-800 rounded-xl p-4 text-xs font-semibold mb-4 border border-red-200">
                                            We couldn't ship your order at this moment. We apologize for the inconvenience.
                                            {order.cancellation_reason && (
                                                <div className="mt-1 text-[10px] text-red-650 font-normal">
                                                    Reason: "{order.cancellation_reason}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {order.status === 'cancelled' && isOnline && !order.refund_transaction_id && (
                                        <div className="bg-yellow-50 text-yellow-855 rounded-xl p-4 text-xs font-semibold mb-4 border border-yellow-200">
                                            Your order has been cancelled. The refund is currently being processed by the administrator.
                                        </div>
                                    )}
                                    {order.status === 'refunded' && (
                                        <div className="bg-green-50 text-green-800 rounded-xl p-4 text-xs font-semibold mb-4 border border-green-200">
                                            Your payment has been refunded successfully. The amount will be credited to your original payment method within 5–7 business days.
                                            {order.refund_transaction_id && (
                                                <div className="mt-1 text-[10px] text-green-650 font-normal">
                                                    Refund ID: <span className="font-mono font-bold">{order.refund_transaction_id}</span> | Refunded Amount: ₹{order.refund_amount}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tracking Timeline / Progress Stepper */}
                                    <div className="pt-4 border-t border-neutral-100">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Status</h5>
                                        {renderProgressBar(order.status)}
                                    </div>
                                </div>

                                {/* Shipping & Payment Meta Details Panel */}
                                <div className="p-6 bg-neutral-50/50 flex flex-col gap-5 text-xs">
                                    <div>
                                        <h5 className="font-extrabold text-neutral-400 uppercase tracking-wider text-[10px] mb-2.5">Shipping Address</h5>
                                        <p className="font-bold text-gray-850">{order.shipping_name || 'Customer'}</p>
                                        <p className="text-gray-600 mt-1 leading-relaxed">{order.shipping_address}</p>
                                        <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                                        <p className="text-gray-500 font-semibold mt-1.5">Phone: {order.shipping_phone}</p>
                                    </div>

                                    <div className="border-t border-gray-200/60 pt-4">
                                        <h5 className="font-extrabold text-neutral-400 uppercase tracking-wider text-[10px] mb-2.5">Payment Details</h5>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 font-medium">Method</span>
                                                <span className="font-bold text-gray-800">{paymentMethodLabel}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 font-medium">Status</span>
                                                <span className={`font-bold ${isOnline ? 'text-green-600' : 'text-gray-700'}`}>{paymentStatusLabel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.awb_code && (
                                        <div className="border-t border-gray-200/60 pt-4">
                                            <h5 className="font-extrabold text-neutral-400 uppercase tracking-wider text-[10px] mb-2.5">Shipping Carrier</h5>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-medium">Provider</span>
                                                    <span className="font-bold text-gray-850">Shiprocket</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-medium">AWB Code</span>
                                                    <span className="font-mono font-extrabold text-gray-900 bg-neutral-100 px-1.5 py-0.5 rounded">{order.awb_code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Return Requests Status Timeline */}
                            {postOrderRequests.filter(r => r.order === order.id).length > 0 && (
                                <div className="bg-red-50/20 border-t border-gray-150 px-6 py-5">
                                    <h4 className="font-extrabold text-xs text-neutral-500 mb-3.5 uppercase tracking-wider">Return & Size Exchange History</h4>
                                    <div className="space-y-3.5">
                                        {postOrderRequests.filter(r => r.order === order.id).map((req) => (
                                            <div key={req.id} className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-sm text-xs">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-gray-100 mb-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="font-bold text-gray-900">Request #{req.id}</span>
                                                        <span className="text-gray-300">|</span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                            ${req.status === 'requested' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                                                              req.status === 'approved' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                                                              req.status === 'pickup_scheduled' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                                                              req.status === 'picked_up' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                                                              req.status === 'refunded' ? 'bg-green-50 text-green-800 border border-green-200' :
                                                              req.status === 'replacement_shipped' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                                                              req.status === 'completed' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                                            {req.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-400 font-semibold text-[10px]">{new Date(req.created_at).toLocaleString()}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    {req.items.map((reqItem) => (
                                                        <div key={reqItem.id} className="flex justify-between items-center gap-4 text-xs">
                                                            <div className="flex-1">
                                                                <span className="font-bold text-gray-800">{reqItem.product_name}</span>
                                                                <span className="text-gray-400 ml-1">({reqItem.original_size})</span>
                                                                <span className="text-gray-800 font-extrabold mx-2">&times; {reqItem.quantity}</span>
                                                                <span className="inline-block bg-neutral-100 text-neutral-600 rounded-lg px-2 py-0.5 text-[9px] capitalize font-bold">{reqItem.request_type}</span>
                                                                {reqItem.request_type === 'exchange' && (
                                                                    <span className="text-guild-red font-extrabold ml-2 bg-red-50 px-1.5 py-0.5 rounded text-[10px]">Desired: {reqItem.exchange_size}</span>
                                                                )}
                                                            </div>
                                                            <div className="text-gray-500 text-right italic">Reason: "{reqItem.reason}"</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {req.awb_code && (
                                                    <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                        <div className="text-[11px] text-gray-600">
                                                            <span className="font-semibold text-gray-700">Reverse Shipment AWB:</span> <span className="font-mono text-gray-900 font-extrabold">{req.awb_code}</span> ({req.courier_name || 'Shiprocket'})
                                                        </div>
                                                        <button
                                                            onClick={() => handleTrackRequest(req.id)}
                                                            className="text-xs font-bold text-white bg-guild-red hover:bg-red-800 px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
                                                        >
                                                            Track Return
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {req.admin_notes && (
                                                    <div className="mt-3 bg-yellow-50/50 text-yellow-800 rounded-xl p-3 text-xs border border-yellow-200/50">
                                                        <span className="font-bold">Admin Remarks:</span> {req.admin_notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Return Request Modal */}
            {returnModalOpen && selectedOrderForReturn && eligibleData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Return / Exchange / Replace</h2>
                            <button onClick={() => setReturnModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitReturn} className="space-y-6">
                            <p className="text-sm text-gray-600">
                                Select items from Order #{selectedOrderForReturn.id} to initiate Return (Refund), Size Exchange, or Replacement.
                            </p>

                            <div className="space-y-4 divide-y divide-gray-100 max-h-[50vh] overflow-y-auto pr-2">
                                {eligibleData.items.map((item) => {
                                    const selectInfo = selectedItems[item.id] || {};
                                    return (
                                        <div key={item.id} className="pt-4 flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id={`check-${item.id}`}
                                                    checked={selectInfo.checked || false}
                                                    onChange={(e) => {
                                                        setSelectedItems({
                                                            ...selectedItems,
                                                            [item.id]: { ...selectInfo, checked: e.target.checked }
                                                        });
                                                    }}
                                                    className="rounded border-gray-300 text-guild-red focus:ring-guild-red h-5 w-5 cursor-pointer"
                                                />
                                                <label htmlFor={`check-${item.id}`} className="flex items-center gap-4 cursor-pointer flex-1">
                                                    <img
                                                        src={getImageUrl(item.product_image)}
                                                        alt={item.product_name}
                                                        className="w-12 h-12 object-contain border rounded bg-gray-50"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{item.product_name}</p>
                                                        <p className="text-xs text-gray-500">Size: {item.original_size} | Purchased Qty: {item.purchased_quantity} (Eligible: {item.remaining_quantity})</p>
                                                    </div>
                                                </label>
                                            </div>

                                            {selectInfo.checked && (
                                                <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Request Type</label>
                                                        <select
                                                            value={selectInfo.request_type}
                                                            onChange={(e) => {
                                                                setSelectedItems({
                                                                    ...selectedItems,
                                                                    [item.id]: { ...selectInfo, request_type: e.target.value }
                                                                });
                                                            }}
                                                            className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-guild-red focus:border-guild-red bg-white"
                                                        >
                                                            {item.is_returnable && <option value="return">Return (Refund)</option>}
                                                            {item.is_exchangeable && <option value="exchange">Size Exchange</option>}
                                                            {item.is_replaceable && <option value="replacement">Replacement (Defective/Incorrect)</option>}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label>
                                                        <select
                                                            value={selectInfo.quantity}
                                                            onChange={(e) => {
                                                                setSelectedItems({
                                                                    ...selectedItems,
                                                                    [item.id]: { ...selectInfo, quantity: parseInt(e.target.value) }
                                                                });
                                                            }}
                                                            className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-guild-red focus:border-guild-red bg-white"
                                                        >
                                                            {Array.from({ length: item.remaining_quantity }, (_, i) => i + 1).map(n => (
                                                                <option key={n} value={n}>{n}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reason</label>
                                                        <select
                                                            value={selectInfo.reason}
                                                            onChange={(e) => {
                                                                setSelectedItems({
                                                                    ...selectedItems,
                                                                    [item.id]: { ...selectInfo, reason: e.target.value }
                                                                });
                                                            }}
                                                            className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-guild-red focus:border-guild-red bg-white"
                                                        >
                                                            {eligibleData.reasons.map(r => (
                                                                <option key={r} value={r}>{r}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {selectInfo.request_type === 'exchange' && (
                                                        <div className="sm:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Exchange Size</label>
                                                            <select
                                                                value={selectInfo.exchange_size}
                                                                onChange={(e) => {
                                                                    setSelectedItems({
                                                                        ...selectedItems,
                                                                        [item.id]: { ...selectInfo, exchange_size: e.target.value }
                                                                    });
                                                                }}
                                                                className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-guild-red focus:border-guild-red bg-white"
                                                                required
                                                            >
                                                                {item.available_variants.map(v => (
                                                                    <option key={v.size} value={v.size}>{v.size} ({v.stock} in stock)</option>
                                                                ))}
                                                                {item.available_variants.length === 0 && (
                                                                    <option value="">No other sizes in stock</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* Image Proof Upload (required if reason is damaged/defective/incorrect) */}
                                                    {(selectInfo.reason.toLowerCase().includes('damage') || selectInfo.reason.toLowerCase().includes('defect') || selectInfo.reason.toLowerCase().includes('incorrect') || selectInfo.reason.toLowerCase().includes('wrong')) && (
                                                        <div className="sm:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Photo Proof (Required)</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    setSelectedItems({
                                                                        ...selectedItems,
                                                                        [item.id]: {
                                                                            ...selectInfo,
                                                                            imageFile: file,
                                                                            imageName: file ? file.name : ''
                                                                        }
                                                                    });
                                                                }}
                                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-red-50 file:text-guild-red hover:file:bg-red-100 cursor-pointer border border-gray-300 rounded-lg p-1.5"
                                                                required
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
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
                                    className="px-6 py-2 bg-guild-red text-white hover:bg-red-800 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-md"
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
