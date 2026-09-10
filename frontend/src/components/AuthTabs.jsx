import { useNavigate, useLocation } from 'react-router-dom';

const AuthTabs = ({ activeTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSwitch = (tab) => {
        if (tab === activeTab) return;
        const targetPath = tab === 'login' ? '/login' : '/register';
        navigate(targetPath, { state: location.state });
    };

    return (
        <div className="flex border-b border-gray-200 mb-6 bg-gray-50/60 p-1 rounded-t-lg">
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
    );
};

export default AuthTabs;
