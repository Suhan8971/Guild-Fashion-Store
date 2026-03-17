import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId } = location.state || {}; // Get order ID passed from navigation

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
            <Link
                to="/"
                className="absolute top-0 left-4 mt-8 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto mt-12">
                <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>

                {orderId && (
                    <p className="text-lg text-gray-600 mb-6">
                        Order ID: <span className="font-mono font-bold text-guild-red">#{orderId}</span>
                    </p>
                )}

                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Thank you for your purchase. We have received your order and are processing it. You will receive an email confirmation shortly.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        to="/"
                        className="bg-guild-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    {/* Future: Link to Order History */}
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
