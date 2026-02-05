import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;