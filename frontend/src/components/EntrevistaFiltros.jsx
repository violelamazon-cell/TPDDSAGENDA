import { useForm } from 'react-hook-form';
import { Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EntrevistaFiltros({ onFilter, filtrosActivos, onClear }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: filtrosActivos
  });
  
  const { rol } = useAuth();
  const isAdminOrRRHH = ['admin', 'rrhh'].includes(rol);

  const onSubmit = (data) => {
    // Limpiar campos vacíos
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    onFilter(cleanData);
  };

  const handleClear = () => {
    reset({ fecha: '', estado: '', entrevistadorId: '' });
    onClear();
  };

  return (
    <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] mb-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium mb-1 w-full sm:w-auto">
          <Filter size={18} />
          Filtros:
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-label)] mb-1">Fecha</label>
          <input 
            type="date" 
            {...register('fecha')}
            className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-border-input)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-label)] mb-1">Estado</label>
          <select 
            {...register('estado')}
            className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-border-input)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="programada">Programada</option>
            <option value="realizada">Realizada</option>
            <option value="reprogramada">Reprogramada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {isAdminOrRRHH && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-label)] mb-1">ID Entrevistador</label>
            <input 
              type="text" 
              placeholder="Ej: 1"
              {...register('entrevistadorId')}
              className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-border-input)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          <button 
            type="button" 
            onClick={handleClear}
            className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] bg-gray-100 hover:bg-gray-200 rounded-[var(--radius-sm)] transition-colors"
          >
            <X size={16} className="inline mr-1" />
            Limpiar
          </button>
          <button 
            type="submit"
            className="px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-[var(--radius-sm)] transition-colors shadow-sm"
          >
            Aplicar
          </button>
        </div>
      </form>
    </div>
  );
}
