import { useState, useEffect } from 'react';
import { Phone, Mail, Briefcase } from 'lucide-react';
import { postulantesService } from '../services/postulantes.service';
import Toast from '../components/Toast';

const getBadgeStyle = (estado) => {
  const baseStyle = {
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'inline-block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  switch (estado) {
    case 'nuevo':
      return { ...baseStyle, backgroundColor: '#F1F5F9', color: '#475569' };
    case 'en_proceso':
      return { ...baseStyle, backgroundColor: '#EDE9FE', color: '#7C3AED' };
    case 'rechazado':
      return { ...baseStyle, backgroundColor: '#FEF2F2', color: '#B91C1C' };
    case 'contratado':
      return { ...baseStyle, backgroundColor: '#F0FDF4', color: '#15803D' };
    default:
      return { ...baseStyle, backgroundColor: '#F1F5F9', color: '#475569' };
  }
};

const StatusDropdown = ({ estadoActual, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const opciones = [
    { value: 'nuevo', label: 'NUEVO' },
    { value: 'en_proceso', label: 'EN PROCESO' },
    { value: 'rechazado', label: 'RECHAZADO' },
    { value: 'contratado', label: 'CONTRATADO' }
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{
          ...getBadgeStyle(estadoActual),
          border: '1px solid transparent',
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {estadoActual ? estadoActual.replace('_', ' ').toUpperCase() : 'NUEVO'}
        <span style={{ fontSize: '0.6rem' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '4px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #E5E7EB',
          padding: '4px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '130px'
        }}>
          {opciones.map(opt => (
            <div
              key={opt.value}
              onMouseDown={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                ...getBadgeStyle(opt.value),
                cursor: 'pointer',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                transition: 'filter 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PostulantesList() {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await postulantesService.cambiarEstado(id, nuevoEstado);
      setPostulantes(postulantes.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
      setSuccessMsg('Estado actualizado correctamente');
    } catch (err) {
      setErrorMsg('Error al actualizar el estado');
    }
  };

  useEffect(() => {
    postulantesService.getAll()
      .then(res => setPostulantes(res.data))
      .catch(() => setErrorMsg('Error al cargar postulantes'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Cargando postulantes...</div>;

  return (
    <div style={{ padding: '32px' }}>
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}
      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}

      {/* Header de sección */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          Postulantes
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '4px' }}>
          Listado general de candidatos y su estado actual
        </p>
      </div>

      {/* Contenedor de la tabla */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>

        {/* Header de la tabla */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr 1fr 80px',
          padding: '12px 24px',
          backgroundColor: '#F8F7FF',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Postulante</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contacto</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Puesto</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Estado</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>Citas</div>
        </div>

        {/* Filas */}
        {postulantes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No hay postulantes registrados.
          </div>
        ) : (
          postulantes.map((p, index) => {
            const isLast = index === postulantes.length - 1;
            const nombreInicial = p.nombre ? p.nombre.charAt(0).toUpperCase() : '';
            const apellidoInicial = p.apellido ? p.apellido.charAt(0).toUpperCase() : '';
            
            return (
              <div 
                key={p.id} 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 80px',
                  padding: '16px 24px',
                  borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
                  alignItems: 'center',
                  transition: 'background-color 0.2s',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {/* Columna POSTULANTE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {nombreInicial}{apellidoInicial}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontWeight: 'bold', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.nombre} {p.apellido}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>ID: #{p.id}</span>
                  </div>
                </div>

                {/* Columna CONTACTO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.88rem', color: '#4B5563', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</span>
                  </div>
                  {p.telefono && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.telefono}</span>
                    </div>
                  )}
                </div>

                {/* Columna PUESTO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontSize: '0.9rem', minWidth: 0 }}>
                  <Briefcase size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.puesto}</span>
                </div>

                {/* Columna ESTADO */}
                <div>
                  <StatusDropdown
                    estadoActual={p.estado || 'nuevo'}
                    onChange={(nuevoEstado) => handleCambiarEstado(p.id, nuevoEstado)}
                  />
                </div>

                {/* Columna CITAS */}
                <div style={{ textAlign: 'center', fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>
                  {p.cantidadEntrevistas || 0}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
