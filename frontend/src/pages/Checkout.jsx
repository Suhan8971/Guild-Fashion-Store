import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import api, { orderAPI } from '../services/api';

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { showModal } = useModal();
    const [loading, setLoading] = useState(false);

    const [shippingCost, setShippingCost] = useState(0);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState('');

    // OTP & Captcha States
    const [otpSent, setOtpSent] = useState(() => JSON.parse(localStorage.getItem('checkout_otpSent')) || false);
    const [otpVerified, setOtpVerified] = useState(() => JSON.parse(localStorage.getItem('checkout_otpVerified')) || false);
    const [otpInput, setOtpInput] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const [captchaState, setCaptchaState] = useState({ num1: 0, num2: 0 });
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(() => JSON.parse(localStorage.getItem('checkout_captchaVerified')) || false);

    // Initialize Captcha
    useEffect(() => {
        if (!captchaVerified) {
            generateCaptcha();
        }
    }, [captchaVerified]); // Run when mount, or if captchaVerified is reset to false

    const generateCaptcha = () => {
        setCaptchaState({
            num1: Math.floor(Math.random() * 10) + 1,
            num2: Math.floor(Math.random() * 10) + 1
        });
        setCaptchaInput('');
        setCaptchaVerified(false);
    };

    const handleSendOTP = async () => {
        // Enforce all shipping details are filled
        const { fullName, address, city, state, zipCode, phone } = shippingDetails;
        if (!fullName || !address || !city || !state || !zipCode || !phone) {
            showModal({
                title: 'Missing Information',
                message: 'All shipping information fields are important for us to ship this product. Please fill them out before verifying your phone.',
                type: 'error'
            });
            return;
        }

        if (phone.length < 10) {
            showModal({
                title: 'Invalid Phone Number',
                message: 'Please enter a valid phone number (at least 10 digits).',
                type: 'error'
            });
            return;
        }

        setOtpLoading(true);
        try {
            const res = await api.post('/checkout/send-otp/', { phone: shippingDetails.phone });
            setOtpSent(true);
            console.log(`\n========================================\n PHONE VERIFICATION OTP FOR ${shippingDetails.phone}\n OTP CODE: ${res.data.otp}\n========================================\n`);
            showModal({
                title: 'OTP Sent',
                message: 'OTP sent successfully! Please check the terminal console or browser console.',
                type: 'success'
            });
        } catch (error) {
            console.error("Failed to send OTP", error);
            showModal({
                title: 'Error',
                message: 'Failed to send OTP. Please try again.',
                type: 'error'
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpInput) {
            showModal({
                title: 'Input Required',
                message: 'Please enter the 6-digit OTP.',
                type: 'error'
            });
            return;
        }
        setOtpLoading(true);
        try {
            const res = await api.post('/checkout/verify-otp/', {
                phone: shippingDetails.phone,
                otp: otpInput
            });
            if (res.data.verified) {
                setOtpVerified(true);
                showModal({
                    title: 'Verified',
                    message: 'Phone number verified successfully!',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error("Failed to verify OTP", error);
            showModal({
                title: 'Verification Failed',
                message: 'Invalid or expired OTP. Please try again.',
                type: 'error'
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleCaptchaVerify = () => {
        if (parseInt(captchaInput) === (captchaState.num1 + captchaState.num2)) {
            setCaptchaVerified(true);
        } else {
            showModal({
                title: 'Incorrect CAPTCHA',
                message: 'Incorrect answer. Please try the new math problem.',
                type: 'error'
            });
            generateCaptcha();
        }
    };

    // Get selected items from navigation state, or default to all if none (though Cart page prevents this)
    const selectedItemIds = location.state?.selectedItems || [];

    // Filter cart items based on selection
    const checkoutItems = selectedItemIds.length > 0
        ? cart.filter(item => selectedItemIds.includes(item.id))
        : cart;

    // Calculate total for checkout
    const checkoutItemsTotal = checkoutItems.reduce((total, item) => total + (item.total_price || (item.product_details.price * item.quantity)), 0);
    const checkoutTotal = checkoutItemsTotal + shippingCost;

    const [shippingDetails, setShippingDetails] = useState(() => {
        const saved = localStorage.getItem('checkout_shippingDetails');
        return saved ? JSON.parse(saved) : {
            fullName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: ''
        };
    });

    const [paymentMethod, setPaymentMethod] = useState(() => {
        return localStorage.getItem('checkout_paymentMethod') || 'cod';
    });

    // Handle Shipping Calculation when ZIP Code is typed fully
    useEffect(() => {
        const fetchShipping = async () => {
            if (shippingDetails.zipCode.length === 6) {
                setShippingLoading(true);
                setShippingError('');
                try {
                    const response = await orderAPI.calculateShipping(shippingDetails.zipCode, selectedItemIds);
                    if (response.data && response.data.shipping_cost) {
                        setShippingCost(response.data.shipping_cost);
                    } else if (response.data.error) {
                        setShippingError(response.data.error);
                        setShippingCost(0);
                    }
                } catch (error) {
                    setShippingError('Failed to calculate shipping for this pincode.');
                    setShippingCost(0);
                } finally {
                    setShippingLoading(false);
                }
            } else {
                // Reset shipping cost if zip code is not complete
                setShippingCost(0);
                setShippingError('');
            }
        };

        const timeoutId = setTimeout(() => {
            fetchShipping();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [shippingDetails.zipCode, selectedItemIds]);

    // Persist to local storage whenever these states change
    useEffect(() => {
        localStorage.setItem('checkout_otpSent', JSON.stringify(otpSent));
        localStorage.setItem('checkout_otpVerified', JSON.stringify(otpVerified));
        localStorage.setItem('checkout_captchaVerified', JSON.stringify(captchaVerified));
        localStorage.setItem('checkout_shippingDetails', JSON.stringify(shippingDetails));
        localStorage.setItem('checkout_paymentMethod', paymentMethod);
    }, [otpSent, otpVerified, captchaVerified, shippingDetails, paymentMethod]);

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        } else if (selectedItemIds.length === 0 && cart.length > 0) {
            // If user somehow got here without selecting items (e.g. direct URL), send back to cart
            // navigate('/cart'); // Optional: enforce selection
        }
    }, [cart, navigate, selectedItemIds]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (paymentMethod === 'online') {
                // 1. Create Razorpay Order
                const orderRes = await api.post('/payment/create/', { amount: checkoutTotal });
                const { id: order_id, amount, currency } = orderRes.data;

                // 2. Open Razorpay Checkout
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
                    amount: amount,
                    currency: currency,
                    name: "Guild Fashion Store",
                    description: "Order Payment",
                    order_id: order_id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment
                            const verifyRes = await api.post('/payment/verify/', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyRes.data.status === 'Payment verified successfully') {
                                // 4. Create Order on Backend (After verification)
                                await createBackendOrder();
                            }
                        } catch (err) {
                            showModal({
                                title: 'Payment Error',
                                message: 'Payment verification failed. Please contact support.',
                                type: 'error'
                            });
                        }
                    },
                    prefill: {
                        name: shippingDetails.fullName,
                        contact: shippingDetails.phone
                    },
                    theme: {
                        color: "#ef4444" // guild-red
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                setLoading(false); // Stop loading, wait for user action in modal
            } else {
                // COD Flow
                await createBackendOrder();
            }
        } catch (error) {
            console.error("Order placement failed", error);
            showModal({
                title: 'Order Failed',
                message: 'Failed to initiate order. Please try again.',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const clearCheckoutStorage = () => {
        localStorage.removeItem('checkout_otpSent');
        localStorage.removeItem('checkout_otpVerified');
        localStorage.removeItem('checkout_captchaVerified');
        localStorage.removeItem('checkout_shippingDetails');
        localStorage.removeItem('checkout_paymentMethod');
    };

    const createBackendOrder = async () => {
        try {
            // Pass selected_item_ids and shipping details to the backend
            const response = await api.post('/orders/', {
                selected_item_ids: selectedItemIds,
                shipping_cost: shippingCost,
                shipping_state: shippingDetails.state,
                shipping_city: shippingDetails.city
            });

            if (response.status === 201) {
                await fetchCart();
                clearCheckoutStorage(); // Clear saved checkout state on success
                showModal({
                    title: 'Order Placed!',
                    message: 'Your order has been placed successfully.',
                    type: 'success',
                    confirmText: 'View Order',
                    onConfirm: () => navigate('/order-success', { state: { orderId: response.data.id } })
                });
            }
        } catch (error) {
            console.error("Backend order creation failed", error);
            showModal({
                title: 'Order Creation Failed',
                message: 'Payment was successful but order creation failed. Please contact support.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${imagePath}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate('/cart')}
                className="mb-4 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Shipping & Payment */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={shippingDetails.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={shippingDetails.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={shippingDetails.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        value={shippingDetails.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={shippingDetails.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            disabled={otpVerified || otpSent}
                                            value={shippingDetails.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-guild-red focus:border-guild-red ${otpVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                                        />
                                        {!otpVerified && (
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                disabled={otpLoading || otpSent || !shippingDetails.phone}
                                                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition whitespace-nowrap disabled:opacity-50"
                                            >
                                                {otpLoading ? '...' : (otpSent ? 'Sent' : 'Send OTP')}
                                            </button>
                                        )}
                                    </div>

                                    {otpSent && !otpVerified && (
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOTP}
                                                disabled={otpLoading || !otpInput}
                                                className="bg-guild-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition whitespace-nowrap disabled:opacity-50"
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Captcha Section */}
                    {otpVerified && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Human Verification</h2>
                            {!captchaVerified ? (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        What is {captchaState.num1} + {captchaState.num2} ?
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guild-red"
                                            placeholder="Enter answer"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCaptchaVerify}
                                            disabled={!captchaInput}
                                            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-green-600 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Verification Successful
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-guild-red focus:ring-guild-red"
                                />
                                <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                            </label>
                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-guild-red focus:ring-guild-red"
                                />
                                <span className="ml-3 font-medium text-gray-900">Online Payment (Mock)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                        <div className="divide-y divide-gray-100 mb-6 max-h-96 overflow-y-auto">
                            {checkoutItems.map((item) => (
                                <div key={item.id} className="py-4 flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                                        <img
                                            src={getImageUrl(item.product_details.image)}
                                            alt={item.product_details.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.product_details.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        ₹ {item.total_price}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹ {checkoutItemsTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>
                                    {shippingLoading ? (
                                        <span className="text-gray-400">Calculating...</span>
                                    ) : shippingCost > 0 ? (
                                        `₹ ${shippingCost}`
                                    ) : (
                                        <span className="text-gray-400">Enter ZIP Code to calculate</span>
                                    )}
                                </span>
                            </div>
                            {shippingError && (
                                <p className="text-xs text-red-500 text-right">{shippingError}</p>
                            )}
                            <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹ {checkoutTotal}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading || !otpVerified || !captchaVerified || shippingLoading}
                            className={`w-full mt-6 bg-guild-red text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-red-800 transition-all transform hover:-translate-y-0.5 ${(loading || !otpVerified || !captchaVerified || shippingLoading) ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>

                        <p className="mt-4 text-xs text-center text-gray-500">
                            By placing your order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
