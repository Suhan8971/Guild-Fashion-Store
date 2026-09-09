import { createContext, useState, useContext, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info', // 'success' | 'error' | 'warning' | 'info' | 'danger'
        confirmText: 'OK',
        cancelText: 'Cancel',
        showCancel: false,
        isDanger: false,
        onConfirm: null,
        onCancel: null,
        resolvePromise: null,
    });

    const showModal = useCallback((config) => {
        return new Promise((resolve) => {
            setModalConfig({
                title: config.title || (config.type === 'error' ? 'Error' : config.type === 'success' ? 'Success' : config.type === 'warning' ? 'Warning' : 'Notification'),
                message: config.message || (typeof config === 'string' ? config : ''),
                type: config.type || 'info',
                confirmText: config.confirmText || 'OK',
                cancelText: config.cancelText || 'Cancel',
                showCancel: config.showCancel || false,
                isDanger: config.isDanger || config.type === 'danger',
                onConfirm: config.onConfirm || null,
                onCancel: config.onCancel || null,
                resolvePromise: resolve,
            });
            setIsOpen(true);
        });
    }, []);

    const showAlert = useCallback((message, title = '', type = 'info') => {
        const config = typeof message === 'object' 
            ? message 
            : { message, title, type };
        return showModal({ ...config, showCancel: false });
    }, [showModal]);

    const showConfirm = useCallback((config) => {
        const modalProps = typeof config === 'string'
            ? { message: config, title: 'Confirm Action', showCancel: true }
            : { title: 'Confirm Action', showCancel: true, ...config };
        return showModal(modalProps);
    }, [showModal]);

    const hideModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <ModalContext.Provider value={{ isOpen, modalConfig, showModal, showAlert, showConfirm, hideModal }}>
            {children}
            <GlobalModal />
        </ModalContext.Provider>
    );
};

// Custom UI/UX Modal Component
const GlobalModal = () => {
    const { isOpen, modalConfig, hideModal } = useModal();

    if (!isOpen) return null;

    const {
        title,
        message,
        type,
        confirmText,
        cancelText,
        showCancel,
        isDanger,
        onConfirm,
        onCancel,
        resolvePromise,
    } = modalConfig;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (resolvePromise) resolvePromise(true);
        hideModal();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        if (resolvePromise) resolvePromise(false);
        hideModal();
    };

    // Header badge styles & icons
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )
                };
            case 'error':
            case 'danger':
                return {
                    badgeBg: 'bg-red-100 text-red-800 border-red-200',
                    btnBg: 'bg-guild-red hover:bg-red-800 text-white focus:ring-guild-red',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    )
                };
            case 'warning':
                return {
                    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
                    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )
                };
            default:
                return {
                    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
                    btnBg: 'bg-guild-black hover:bg-gray-800 text-white focus:ring-gray-900',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop with Blur */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={handleCancel}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-xl shadow-2xl transform transition-all sm:max-w-lg w-full z-10 overflow-hidden border border-gray-100 my-8">
                {/* Header Bar */}
                <div className="bg-guild-black px-6 py-4 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-guild-red animate-pulse"></span>
                        <h3 className="text-lg font-bold text-white tracking-wide">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg focus:outline-none"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 bg-white flex items-start gap-4">
                    {typeStyles.icon}
                    <div className="flex-1 min-w-0">
                        <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                            {message}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100">
                    {showCancel && (
                        <button
                            type="button"
                            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-xs px-5 py-2.5 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        className={`w-full sm:w-auto inline-flex justify-center rounded-lg shadow-sm px-6 py-2.5 text-sm font-bold transition-all ${
                            isDanger 
                                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' 
                                : typeStyles.btnBg
                        }`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalProvider;
