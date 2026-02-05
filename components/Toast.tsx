import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3 bg-slate-800 text-white rounded-full shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300 border border-slate-700">
      <CheckCircle size={18} className="text-emerald-400" />
      <span className="font-medium text-sm pr-2">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors ml-auto border-l border-slate-600 pl-3">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;