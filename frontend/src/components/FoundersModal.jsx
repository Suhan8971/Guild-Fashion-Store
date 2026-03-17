import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FoundersModal = ({ user }) => {
    const [show, setShow] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only show if user is logged in
        if (!user) {
            return;
        }

        // Check if modal has already been already shown in this session
        const hasShown = sessionStorage.getItem('foundersModalShown');

        if (!hasShown) {
            setShow(true);

            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                setShow(false);
                sessionStorage.setItem('foundersModalShown', 'true');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem('foundersModalShown', 'true');
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500 ease-in-out">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 transition-transform duration-300 animate-fade-in-up border-4 border-guild-red relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-guild-black overflow-hidden shadow-lg p-1 bg-white">
                        {/* Placeholder for Founder's Image */}
                        <img
                            src="/Namith.PNG"
                            alt="Founder"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Founder: Namith</h2>

                <div className="h-1 w-16 bg-guild-red mx-auto mb-4 rounded-full"></div>

                <p className="text-lg text-gray-600 font-medium italic">
                    "Wishing you joy in every wear,may your new outfit bring confidence, comfort, and style"
                </p>
            </div>
        </div>
    );
};

export default FoundersModal;
