import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-[var(--color-primary)]/20 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Página no encontrada</h2>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe, fue movida o no tenés permisos para verla.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors font-medium shadow-sm"
      >
        <Home size={20} />
        Volver al inicio
      </Link>
    </div>
  );
}
