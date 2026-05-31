import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, ToastMessage } from '../store/useNotificationStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
    const { toasts, removeToast } = useNotificationStore();

    console.log('ToastNotification rendering with toasts:', toasts);

    return (
        <div
            id="toast-container"
            className="fixed top-6 left-0 right-0 z-[99999] px-4 pointer-events-none max-w-sm mx-auto flex flex-col gap-2"
            style={{ zIndex: 99999 }}
        >
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

interface ToastItemProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const { id, message, type } = toast;

    // Configurations for each type
    const typeConfigs = {
        success: {
            bg: 'bg-[#10B981] text-white',
            border: 'border-[#34D399]/45',
            iconColor: 'text-white',
            icon: CheckCircle,
        },
        error: {
            bg: 'bg-[#F43F5E] text-white',
            border: 'border-[#FB7185]/45',
            iconColor: 'text-white',
            icon: AlertCircle,
        },
        warning: {
            bg: 'bg-[#F59E0B] text-white',
            border: 'border-[#FBBF24]/45',
            iconColor: 'text-white',
            icon: AlertTriangle,
        },
        info: {
            bg: 'bg-[#374151] dark:bg-[#1F2937] text-white',
            border: 'border-[#4B5563]/40 dark:border-[#374151]/50',
            iconColor: 'text-white border-none',
            icon: Info,
        },
    };

    const config = typeConfigs[type] || typeConfigs.info;
    const IconComponent = config.icon;

    return (
        <motion.div
            id={`toast-${id}`}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border ${config.bg} ${config.border} shadow-lg select-none relative`}
            dir="rtl"
        >
            <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
                <IconComponent size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex-grow text-[12px] font-black leading-relaxed">
                {message}
            </div>
            <button
                id={`toast-close-${id}`}
                onClick={() => onClose(id)}
                className="shrink-0 text-white/60 hover:text-white active:scale-95 transition-all p-0.5 -mt-0.5"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default ToastNotification;
