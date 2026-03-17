import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, onLogout }) => {
    const { totalItems } = useCart();
    return (
        <nav className="bg-guild-black shadow-sm border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between h-24">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/guild-logo.png" alt="Guild Fashion Store" className="h-16 w-auto object-contain hover:opacity-90 transition-opacity" />
                            <span className="text-guild-white font-medium text-lg tracking-widest uppercase">Fashion Store</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex ml-10 space-x-8 items-center">
                        {user && (
                            <Link to="/" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">Shop</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">Admin Dashboard</Link>
                        )}
                        {user?.role === 'developer' && (
                            <Link to="/developer" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">Dev Dashboard</Link>
                        )}
                        {user && (
                            <Link to="/orders" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">My Orders</Link>
                        )}
                    </div>
                    <div className="flex items-center space-x-6">
                        {user && (
                            <Link to="/cart" className="text-gray-400 hover:text-white relative group">
                                <span className="sr-only">Cart</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 bg-guild-red rounded-full h-2.5 w-2.5 border border-guild-black"></span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-300">Hi, {user.username}</span>
                                <button
                                    onClick={onLogout}
                                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="bg-guild-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
