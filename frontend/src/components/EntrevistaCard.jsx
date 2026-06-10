import { MapPin, Video, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function EntrevistaCard({ entrevista }) {
  const { id, fecha, horaInicio, horaFin, modalidad, ubicacion, link, estado, postulante, entrevistador } = entrevista;

  const isVirtual = modalidad === 'virtual';

  const formatFecha = (dateString) => {
    try {
      const parts = dateString.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return format(d, "EEEE d 'de' MMMM", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-[var(--radius-md)] p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text)]">
            {postulante?.nombre} {postulante?.apellido}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">
            Postulante a {postulante?.puesto}
          </p>
        </div>
        <StatusBadge status={estado} type="entrevista" />
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-label)]">
          <Calendar size={16} className="text-[var(--color-secondary)]" />
          <span className="capitalize">{formatFecha(fecha)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-label)]">
          <Clock size={16} className="text-[var(--color-secondary)]" />
          <span>{horaInicio} - {horaFin} hs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-label)]">
          {isVirtual ? (
             <Video size={16} className="text-[var(--color-secondary)]" />
          ) : (
             <MapPin size={16} className="text-[var(--color-secondary)]" />
          )}
          <span>{isVirtual ? 'Virtual (ver link en detalle)' : `Presencial: ${ubicacion}`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-label)] pt-2 border-t border-[var(--color-border)]">
          <span className="font-medium">Entrevistador:</span> {entrevistador?.nombre}
        </div>
      </div>

      <Link 
        to={`/entrevistas/${id}`}
        className="flex items-center justify-center gap-1 w-full bg-[var(--color-bg-secondary)] text-[var(--color-primary)] font-medium py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-light)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white"
      >
        Ver detalle
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
