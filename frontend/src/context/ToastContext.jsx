import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the Context
const ToastContext = createContext();

// Create a custom hook to use the Toast Context easily
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Create the Provider component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // The function that components will call to add a toast
    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9); // Create a unique ID
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);

        // Auto-remove the toast after the duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            
            {/* The actual visual container that floats on the screen */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`toast-notification toast-${toast.type} animate-slide-in`}
                    >
                        <div className="toast-icon">
                            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
