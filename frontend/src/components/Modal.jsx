import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-[var(--radius-lg)] shadow-2xl w-full ${maxWidth} mx-4 flex flex-col max-h-[90vh] animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">{title}</h2>
          <button 
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-1 rounded-full hover:bg-[var(--color-bg-secondary)]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
