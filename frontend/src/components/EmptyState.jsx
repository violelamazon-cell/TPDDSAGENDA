import { SearchX } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-secondary)] mb-4">
        {icon || <SearchX size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
