import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: 'ri-checkbox-circle-line',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: 'ri-error-warning-line',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: 'ri-alert-line',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: 'ri-information-line',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const style = config[type];

  return (
    <div className={`${style.bg} ${style.border} border-2 rounded-xl p-4 shadow-lg flex items-center space-x-3 min-w-[320px] max-w-md animate-slide-in`}>
      <i className={`${style.icon} ${style.iconColor} text-2xl`}></i>
      <p className={`${style.text} text-sm font-medium flex-1`}>{message}</p>
      <button onClick={onClose} className={`${style.iconColor} hover:opacity-70 transition-opacity`}>
        <i className="ri-close-line text-xl"></i>
      </button>
    </div>
  );
};

export default Toast;
