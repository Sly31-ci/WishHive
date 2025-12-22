import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastConfig } from '@/components/Toast';

interface ToastContextType {
    showToast: (config: Omit<ToastConfig, 'id' | 'index'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastWithId extends ToastConfig {
    id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastWithId[]>([]);

    const showToast = useCallback((config: Omit<ToastConfig, 'id' | 'index'>) => {
        const id = Date.now().toString() + Math.random().toString(36);
        const newToast: ToastWithId = {
            ...config,
            id,
            onDismiss: () => dismissToast(id),
        };

        setToasts((prev) => {
            // Limit to 3 toasts max
            const updated = [...prev, newToast];
            return updated.slice(-3);
        });

        // Auto-dismiss after duration
        if (config.duration !== 0) {
            setTimeout(() => {
                dismissToast(id);
            }, config.duration || 3000);
        }
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    index={index}
                />
            ))}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
