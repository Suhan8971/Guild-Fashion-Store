import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        type: 'info', // info, success, warning, error
        onConfirm: null,
        onCancel: null,
        confirmText: 'OK',
        cancelText: 'Cancel',
        showCancel: false
    });

    const showModal = (content) => {
        setModalContent({
            title: content.title || '',
            message: content.message || '',
            type: content.type || 'info',
            onConfirm: content.onConfirm || null,
            onCancel: content.onCancel || null,
            confirmText: content.confirmText || 'OK',
            cancelText: content.cancelText || 'Cancel',
            showCancel: content.showCancel || false
        });
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
        // Reset content after transition ideally, but for now just close
    };

    return (
        <ModalContext.Provider value={{ isOpen, modalContent, showModal, hideModal }}>
            {children}
            {/* We will render the Modal component here or in a separate GlobalModal component */}
            <GlobalModal />
        </ModalContext.Provider>
    );
};

// Internal Modal Component
const GlobalModal = () => {
    const { isOpen, modalContent, hideModal } = useModal();

    if (!isOpen) return null;

    const { title, message, type, onConfirm, onCancel, confirmText, cancelText, showCancel } = modalContent;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        hideModal();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        hideModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50 transition-opacity"
                onClick={handleCancel}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full z-10 overflow-hidden animate-bounce-in-down">
                {/* Header */}
                <div className="flex justify-between items-center bg-guild-black px-6 py-4 border-b border-guild-red border-opacity-20">
                    <h3 className="text-xl font-bold text-guild-white" id="modal-title">
                        {title}
                    </h3>
                    {!showCancel && (
                        <button onClick={hideModal} className="text-guild-white hover:text-gray-300 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="bg-guild-cream px-6 py-6">
                    <p className="text-guild-black text-base">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-guild-cream px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                    {showCancel && (
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guild-red sm:text-sm"
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-guild-red text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guild-red sm:text-sm"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
