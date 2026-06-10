import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-[var(--color-success)]" size={20} />,
    error: <XCircle className="text-[var(--color-error)]" size={20} />,
    warning: <AlertCircle className="text-[var(--color-warning)]" size={20} />
  };

  const bgColors = {
    success: 'bg-[var(--color-programada-bg)] border-[var(--color-success)]',
    error: 'bg-[var(--color-cancelada-bg)] border-[var(--color-error)]',
    warning: 'bg-[var(--color-reprogramada-bg)] border-[var(--color-warning)]'
  };

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] border shadow-lg ${bgColors[type]} min-w-[300px] max-w-md`}>
        <div className="mt-0.5">{icons[type]}</div>
        <div className="flex-1 text-sm font-medium text-[var(--color-text)]">{message}</div>
        <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
