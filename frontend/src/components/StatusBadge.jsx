export default function StatusBadge({ status, type = 'entrevista' }) {
  const styles = {
    entrevista: {
      programada: 'bg-[var(--color-programada-bg)] text-[var(--color-programada-text)]',
      realizada: 'bg-[var(--color-realizada-bg)] text-[var(--color-realizada-text)]',
      cancelada: 'bg-[var(--color-cancelada-bg)] text-[var(--color-cancelada-text)]',
      reprogramada: 'bg-[var(--color-reprogramada-bg)] text-[var(--color-reprogramada-text)]',
    },
    postulante: {
      nuevo: 'bg-[var(--color-nuevo-bg)] text-[var(--color-nuevo-text)]',
      en_proceso: 'bg-[var(--color-en-proceso-bg)] text-[var(--color-en-proceso-text)]',
      rechazado: 'bg-[var(--color-rechazado-bg)] text-[var(--color-rechazado-text)]',
      contratado: 'bg-[var(--color-contratado-bg)] text-[var(--color-contratado-text)]',
    }
  };

  const formattedStatus = status.replace('_', ' ');
  const badgeStyle = styles[type]?.[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-full)] inline-block uppercase tracking-wide ${badgeStyle}`}>
      {formattedStatus}
    </span>
  );
}
