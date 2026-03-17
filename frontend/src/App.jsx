import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DeveloperDashboard from './pages/DeveloperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerStore from './pages/CustomerStore';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import MatchingProducts from './pages/MatchingProducts';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SuhanAdminLogin from './pages/SuhanAdminLogin';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { ModalProvider } from './context/ModalContext';
import FoundersModal from './components/FoundersModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsRefunds from './pages/ReturnsRefunds';
import SizeGuide from './pages/SizeGuide';
import FAQs from './pages/FAQs';

import Footer from './components/Footer';

const AppContent = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check local storage for user/token on load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('foundersModalShown'); // Reset modal flag
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-guild-white via-guild-cream to-gray-100 text-guild-black font-sans">
            <FoundersModal user={user} />
            <Navbar user={user} onLogout={handleLogout} />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/developer"
                        element={user?.role === 'developer' ? <DeveloperDashboard /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={user?.role === 'developer' || user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/suhanadmin"
                        element={<SuhanAdminLogin setUser={setUser} />}
                    />
                    <Route
                        path="/"
                        element={<CustomerStore />}
                    />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/product/:id/matches" element={<MatchingProducts />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <ModalProvider>
            <CartProvider>
                <Router>
                    <AppContent />
                </Router>
            </CartProvider>
        </ModalProvider>
    );
}

export default App;
