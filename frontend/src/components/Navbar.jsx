import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, onLogout }) => {
    const { totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-guild-black shadow-sm border-b border-gray-800 relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20 md:h-24">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0 pr-2">
                        <Link to="/" className="flex items-center gap-2 min-w-0">
                            <img src="/guild-logo.png" alt="Guild Fashion Store" className="h-10 sm:h-12 md:h-16 w-auto object-contain flex-shrink-0 hover:opacity-90 transition-opacity" />
                            <span className="text-guild-white font-medium text-xs sm:text-base md:text-lg tracking-wider sm:tracking-widest uppercase truncate">Fashion Store</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex ml-10 space-x-8 items-center flex-shrink-0">
                        {user && (
                            <Link to="/" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">Shop</Link>
                        )}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link to="/admin" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-guild-red animate-pulse"></span>
                                Admin Dashboard
                            </Link>
                        )}
                        {user?.role === 'developer' && (
                            <Link to="/developer" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">Dev Dashboard</Link>
                        )}
                        {user && (
                            <Link to="/orders" className="text-gray-300 hover:text-guild-red px-3 py-2 rounded-md text-sm font-medium">My Orders</Link>
                        )}
                    </div>

                    {/* Right Hand Action Items */}
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5 flex-shrink-0">
                        {/* Admin Gear Button for Medium & Small Devices Only (lg:hidden) */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link 
                                to="/admin" 
                                className="lg:hidden bg-guild-red hover:bg-red-700 text-white p-1.5 sm:px-2.5 sm:py-1 rounded-full transition-all flex items-center gap-1 shadow-sm flex-shrink-0"
                                title="Admin Dashboard"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline text-xs font-bold">Admin</span>
                            </Link>
                        )}
                        {user && (
                            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                                <Link to="/cart" className="text-gray-400 hover:text-white relative group p-1" title="Shopping Cart">
                                    <span className="sr-only">Cart</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-guild-red text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-guild-black">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors relative group p-1" title="My Orders">
                                    <span className="sr-only">My Orders</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors" title="My Profile">
                                    <span className="sr-only">Profile</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="hidden sm:inline-block text-gray-400 hover:text-white text-xs md:text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-3 flex items-center">
                                <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors">Login</Link>
                                <Link to="/register" className="bg-guild-red text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-red-700 transition-colors">Register</Link>
                            </div>
                        )}

                        {/* Hamburger Button for Mobile & Tablet */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-gray-400 hover:text-white p-1 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile / Tablet Dropdown Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-800 py-4 space-y-2 bg-guild-black">
                        {user && (
                            <Link 
                                to="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-base font-medium"
                            >
                                Shop Store
                            </Link>
                        )}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link 
                                to="/admin" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-guild-red hover:bg-gray-800 font-bold rounded-md text-base flex items-center justify-between"
                            >
                                <span>Admin Dashboard</span>
                                <span className="bg-guild-red text-white text-xs px-2 py-0.5 rounded-full font-bold">Admin</span>
                            </Link>
                        )}
                        {user?.role === 'developer' && (
                            <Link 
                                to="/developer" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-purple-400 hover:bg-gray-800 font-medium rounded-md text-base"
                            >
                                Developer Dashboard
                            </Link>
                        )}
                        {user && (
                            <Link 
                                to="/orders" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-base font-medium"
                            >
                                My Orders
                            </Link>
                        )}
                        {user && (
                            <Link 
                                to="/profile" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-base font-medium"
                            >
                                My Profile
                            </Link>
                        )}
                        {user && (
                            <button
                                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                                className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 font-medium rounded-md text-base"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
