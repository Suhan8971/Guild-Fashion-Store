import { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useModal } from './ModalContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showModal } = useModal();

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCart([]);
            return;
        }
        try {
            const res = await cartAPI.getCart();
            // The backend returns { id, items: [...], ... }
            if (res.data && res.data.items) {
                setCart(res.data.items);
            } else if (Array.isArray(res.data)) {
                setCart(res.data);
            } else {
                setCart([]);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
            // Optionally set cart to empty on error
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product, quantity = 1, size = null) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showModal({
                title: 'Login Required',
                message: 'Please login to add items to your cart.',
                type: 'warning',
                confirmText: 'Got it'
            });
            return;
        }

        // Check for 15 product limit
        // We check if this exact item (product + size) is already in the cart.
        // If it is, we are just updating quantity, so no new row.
        // If it sends a new row and we are at 15, we block it.
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
            fetchCart(); // Refresh cart
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
        console.log(`[CartContext] updateQuantity called for item ${itemId} with quantity ${quantity}`);
        try {
            const response = await cartAPI.updateQuantity(itemId, quantity);
            console.log("[CartContext] updateQuantity success", response.data);

            // If the backend returns the full cart, we can just set it directly!
            // The backend view returns: Response(self.get_serializer(cart).data)
            // serialized cart has { id, items: [...], ... }
            if (response.data && response.data.items) {
                setCart(response.data.items);
            } else {
                fetchCart(); // Fallback
            }
        } catch (err) {
            console.error("[CartContext] Update failed", err);
        }
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.total_price || 0), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
