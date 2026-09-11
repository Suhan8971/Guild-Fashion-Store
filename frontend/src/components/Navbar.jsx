import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, onLogout }) => {
    const { totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Hide Shop link on Landing page (/), Login, Register, Contact, and About Us pages
    const hideShopLink = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/contact' || location.pathname === '/about-us';

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-guild-black shadow-sm border-b border-gray-800 relative z-50">
            {/* Keyframe animation for Left Arm: Resting state is 100% clean/invisible inside body. Every 5s, left arm emerges, raises up into air, waves side-to-side, and smoothly lowers back into body */}
            <style>{`
                @keyframes waveLeftArm {
                    0%, 35%, 100% { opacity: 0; transform: rotate(100deg); }
                    5% { opacity: 1; transform: rotate(40deg); }
                    10% { opacity: 1; transform: rotate(0deg); }
                    15% { opacity: 1; transform: rotate(-25deg); }
                    20% { opacity: 1; transform: rotate(20deg); }
                    25% { opacity: 1; transform: rotate(-20deg); }
                    30% { opacity: 1; transform: rotate(15deg); }
                    35% { opacity: 0; transform: rotate(100deg); }
                }
            `}</style>

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
                        {!hideShopLink && (
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
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 flex-shrink-0">
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

                        {/* Cart Icon (Visible for all users) */}
                        <Link to="/cart" className="text-gray-400 hover:text-white relative group p-1.5 transition-colors" title="Shopping Cart">
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

                        {/* Profile Icon with Clean Resting State & Left-Arm Waving Animation every 5s */}
                        <div className="relative flex items-center" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="text-gray-300 hover:text-white transition-colors p-1.5 flex items-center justify-center rounded-full hover:bg-gray-800 focus:outline-none relative group"
                                title={user ? `Profile (${user.username})` : 'User Profile'}
                                aria-expanded={profileDropdownOpen}
                            >
                                <span className="sr-only">Profile</span>
                                {/* Profile Avatar SVG: Completely clean when resting, Left arm emerges & waves every 5s */}
                                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Clean Avatar Head */}
                                    <circle cx="12" cy="7" r="4" />
                                    {/* Clean Avatar Torso/Body (Overlaps naturally, no extra resting arm lines) */}
                                    <path d="M5.5 21v-1.5a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5V21" />
                                    
                                    {/* Left Arm (Viewer's Left side): Hidden inside body when resting, emerges and raises into air to wave every 5s */}
                                    <g style={{ transformOrigin: '7.5px 15px', animation: 'waveLeftArm 5s infinite ease-in-out' }}>
                                        <path d="M7.5 15l-3-4a1.2 1.2 0 0 0-1.7 1.7l2.5 3.5" />
                                    </g>
                                </svg>
                            </button>

                            {/* Beautified Dropdown Options Menu positioned nicely below header */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 sm:w-72 bg-gradient-to-b from-gray-900 via-guild-black to-black rounded-2xl shadow-2xl p-4 border border-white/10 z-[100] text-white transform transition-all duration-200 animate-in fade-in zoom-in-95">
                                    {/* Close (X) Button */}
                                    <button
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all cursor-pointer z-20"
                                        aria-label="Close popup"
                                        title="Close"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {user ? (
                                        <div className="space-y-3 pt-1">
                                            <div className="flex items-center gap-3 pb-3 border-b border-white/10 pr-6">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-guild-red to-red-600 flex items-center justify-center text-white font-extrabold shadow-md border border-white/20 text-lg">
                                                    {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                                                    <p className="text-sm font-bold text-white truncate">{user.username || user.email}</p>
                                                    <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/10 text-guild-red border border-red-500/20">
                                                        {user.role || 'Customer'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all group"
                                                >
                                                    <svg className="w-4 h-4 text-guild-red group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all group"
                                                >
                                                    <svg className="w-4 h-4 text-guild-red group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    <span>My Orders</span>
                                                </Link>
                                            </div>

                                            <div className="pt-2 border-t border-white/10">
                                                <button
                                                    onClick={() => {
                                                        setProfileDropdownOpen(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-xl transition-all shadow-sm cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-center py-2 pt-1">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-guild-red to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/40 mb-2.5 border border-white/20">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-base font-bold text-white">Welcome to Guild</h4>
                                                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Sign in to manage your orders, cart & account details</p>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-white/10">
                                                <Link
                                                    to="/login"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-guild-red via-red-600 to-guild-red hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-red-900/40 transform hover:-translate-y-0.5 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Login</span>
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    <span>Register</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

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
                        {!hideShopLink && (
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

                        {user ? (
                            <>
                                <Link 
                                    to="/orders" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-base font-medium"
                                >
                                    My Orders
                                </Link>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-base font-medium"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 font-medium rounded-md text-base"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="pt-2 border-t border-gray-800 space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-guild-red font-bold hover:bg-gray-800 rounded-md text-base"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-white font-medium hover:bg-gray-800 rounded-md text-base"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
