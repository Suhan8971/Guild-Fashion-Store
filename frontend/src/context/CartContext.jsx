import { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useModal } from './ModalContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const GUEST_CART_KEY = 'guild_guest_cart';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showModal } = useModal();

    const getGuestCart = () => {
        try {
            const stored = localStorage.getItem(GUEST_CART_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    };

    const saveGuestCart = (guestCart) => {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
        setCart(guestCart);
    };

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCart(getGuestCart());
            return;
        }
        try {
            const res = await cartAPI.getCart();
            if (res.data && res.data.items) {
                setCart(res.data.items);
            } else if (Array.isArray(res.data)) {
                setCart(res.data);
            } else {
                setCart([]);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const syncGuestCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
            try {
                for (const item of guestItems) {
                    const productId = item.product || item.product_details?.id;
                    if (productId) {
                        await cartAPI.addToCart(productId, item.quantity, item.size);
                    }
                }
            } catch (err) {
                console.error("Error syncing guest cart to server:", err);
            } finally {
                localStorage.removeItem(GUEST_CART_KEY);
            }
        }
        await fetchCart();
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product, quantity = 1, size = null) => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Unauthenticated Guest Cart logic
            const currentGuestCart = getGuestCart();
            const existingIndex = currentGuestCart.findIndex(
                item => (item.product === product.id || item.product_details?.id === product.id) && item.size === size
            );

            if (existingIndex === -1 && currentGuestCart.length >= 15) {
                showModal({
                    title: 'Cart Full',
                    message: 'Your cart is full. We limit carts to 15 unique items.',
                    type: 'warning',
                    confirmText: 'Understood'
                });
                return;
            }

            let newGuestCart = [...currentGuestCart];
            if (existingIndex > -1) {
                newGuestCart[existingIndex].quantity += quantity;
                newGuestCart[existingIndex].total_price = newGuestCart[existingIndex].quantity * product.price;
            } else {
                newGuestCart.push({
                    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                    product: product.id,
                    product_details: product,
                    quantity: quantity,
                    size: size,
                    total_price: product.price * quantity
                });
            }

            saveGuestCart(newGuestCart);

            showModal({
                title: 'Added to Cart',
                message: `${product.name} has been added to your cart!`,
                type: 'success',
                confirmText: 'Continue Shopping'
            });
            return;
        }

        // Authenticated Backend Cart logic
        const existingItem = cart.find(item => item.product === product.id && item.size === size);

        if (!existingItem && cart.length >= 15) {
            showModal({
                title: 'Cart Full',
                message: 'Your cart is full. To ensure the best experience, we limit carts to 15 unique items. Please remove an item before adding a new one.',
                type: 'warning',
                confirmText: 'Understood'
            });
            return;
        }

        try {
            await cartAPI.addToCart(product.id, quantity, size);
            showModal({
                title: 'Added to Cart',
                message: `${product.name} has been added to your cart!`,
                type: 'success',
                confirmText: 'Continue Shopping'
            });
            fetchCart();
        } catch (err) {
            console.error("Add to cart failed", err);
            showModal({
                title: 'Error',
                message: 'Failed to add item to cart. Please try again.',
                type: 'error'
            });
        }
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            const currentGuestCart = getGuestCart();
            const newGuestCart = currentGuestCart.filter(item => item.id !== itemId);
            saveGuestCart(newGuestCart);
            return;
        }

        try {
            await cartAPI.removeFromCart(itemId);
            fetchCart();
        } catch (err) {
            console.error("Remove failed", err);
            showModal({
                title: 'Error',
                message: 'Failed to remove item.',
                type: 'error'
            });
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            const currentGuestCart = getGuestCart();
            const newGuestCart = currentGuestCart.map(item => {
                if (item.id === itemId) {
                    const price = item.product_details?.price || 0;
                    return {
                        ...item,
                        quantity: quantity,
                        total_price: price * quantity
                    };
                }
                return item;
            });
            saveGuestCart(newGuestCart);
            return;
        }

        try {
            const response = await cartAPI.updateQuantity(itemId, quantity);
            if (response.data && response.data.items) {
                setCart(response.data.items);
            } else {
                fetchCart();
            }
        } catch (err) {
            console.error("[CartContext] Update failed", err);
        }
    };

    const clearCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem(GUEST_CART_KEY);
        }
        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.total_price || 0), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, fetchCart, syncGuestCart }}>
            {children}
        </CartContext.Provider>
    );
};
