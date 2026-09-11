import { useNavigate, useLocation, Link } from 'react-router-dom';

const AuthTabs = ({ activeTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSwitch = (tab) => {
        if (tab === activeTab) return;
        const targetPath = tab === 'login' ? '/login' : '/register';
        navigate(targetPath, { state: location.state });
    };

    return (
        <div className="mb-6">
            {/* Responsive Top Option: Move back to Shop without logging in */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-guild-red transition-colors group"
                    title="Back to store front"
                >
                    <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-guild-red transition-transform group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Shop</span>
                </Link>
            </div>

            {/* Login & Register Toggle Tabs */}
            <div className="flex border border-gray-200 bg-gray-50/60 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => handleSwitch('login')}
                    className={`flex-1 py-2.5 sm:py-3 text-center text-sm sm:text-base font-bold transition-all rounded-md cursor-pointer ${
                        activeTab === 'login'
                            ? 'bg-guild-red text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitch('register')}
                    className={`flex-1 py-2.5 sm:py-3 text-center text-sm sm:text-base font-bold transition-all rounded-md cursor-pointer ${
                        activeTab === 'register'
                            ? 'bg-guild-red text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default AuthTabs;
