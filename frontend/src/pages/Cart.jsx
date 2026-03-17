import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useModal } from '../context/ModalContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Initialize selection when cart loads
    useEffect(() => {
        if (cart.length > 0) {
            // By default, select all items
            const allIds = new Set(cart.map(item => item.id));
            setSelectedItems(allIds);
        }
    }, [cart.length]); // Only run when cart length changes (initial load or item added/removed)

    // Helper for image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${imagePath}`;
    };

    const handleToggleItem = (itemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === cart.length) {
            setSelectedItems(new Set()); // Deselect all
        } else {
            const allIds = new Set(cart.map(item => item.id));
            setSelectedItems(allIds); // Select all
        }
    };

    const selectedSubtotal = cart
        .filter(item => selectedItems.has(item.id))
        .reduce((total, item) => total + (item.total_price || (item.product_details.price * item.quantity)), 0);

    const handleCheckout = async () => {
        if (selectedItems.size === 0) {
            showModal({
                title: 'No Items Selected',
                message: 'Please select at least one item to proceed to checkout.',
                type: 'warning',
                confirmText: 'Okay'
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showModal({
                    title: 'Login Required',
                    message: 'Please login to proceed to checkout.',
                    type: 'warning',
                    confirmText: 'Login',
                    onConfirm: () => navigate('/login'),
                    showCancel: true,
                    cancelText: 'Cancel'
                });
                return;
            }
            // Pass selected items to Checkout page
            navigate('/checkout', { state: { selectedItems: Array.from(selectedItems) } });
        } catch (err) {
            console.error('Checkout error:', err);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-4xl mx-auto my-8">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 mt-6">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any items to the cart yet.</p>
                <Link to="/" className="inline-block bg-guild-red text-guild-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl mx-auto my-8">
            <button
                onClick={() => navigate('/')}
                className="mb-4 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Store
            </button>
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-guild-black">Shopping Cart</h1>
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={selectedItems.size === cart.length && cart.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-guild-red rounded focus:ring-guild-red border-gray-300"
                    />
                    <span className="text-gray-700 font-medium">Select All</span>
                </label>
            </div>

            <div className="space-y-6">
                {cart.map((item) => (
                    <div key={item.id} className={`flex flex-col sm:flex-row items-center border-b border-gray-100 pb-6 last:border-0 p-4 rounded-lg transition-colors ${selectedItems.has(item.id) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                        {/* Checkbox */}
                        <div className="mr-4 sm:mr-6 mb-4 sm:mb-0">
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={() => handleToggleItem(item.id)}
                                className="w-5 h-5 text-guild-red rounded focus:ring-guild-red border-gray-300"
                            />
                        </div>

                        <div className="flex items-center space-x-6 w-full sm:w-auto flex-1">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden bg-white">
                                <img
                                    src={getImageUrl(item.product_details.image)}
                                    alt={item.product_details.name}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{item.product_details.name}</h3>
                                <p className="text-guild-red font-bold text-lg mt-1">₹ {item.product_details.price}</p>
                                {item.size && (
                                    <p className="text-sm text-gray-500 mt-1">Size: <span className="font-medium text-gray-700">{item.size}</span></p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-8 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                <button
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-guild-red transition-colors"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 text-gray-900 font-medium border-l border-r border-gray-300 min-w-[3rem] text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right min-w-[5rem]">
                                <p className="font-bold text-gray-900">₹ {(item.total_price || (item.product_details.price * item.quantity)).toFixed(2)}</p>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                aria-label="Remove item"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex flex-col sm:items-end">
                    <div className="flex justify-between w-full max-w-md mb-6 border-b border-gray-200 pb-4">
                        <span className="text-lg text-gray-600">Subtotal ({selectedItems.size} items selected)</span>
                        <span className="text-2xl font-bold text-gray-900">₹ {selectedSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to="/" className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white hover:border-gray-400 transition-all text-center">
                            Continue Shopping
                        </Link>
                        <button
                            onClick={handleCheckout}
                            className={`bg-guild-red text-white w-full sm:w-auto px-8 py-3 rounded-lg font-bold hover:bg-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center ${selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedItems.size === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
