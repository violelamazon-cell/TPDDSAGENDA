import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Clock, Monitor, MapPin, Search, Calendar } from 'lucide-react';
import { entrevistasService } from '../services/entrevistas.service';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function EntrevistasList() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filtros state
  const [estadoFilter, setEstadoFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');
  
  const { rol } = useAuth();
  const navigate = useNavigate();
  const isAdminOrRRHH = ['admin', 'rrhh'].includes(rol);

  const fetchEntrevistas = async () => {
    setLoading(true);
    try {
      const filtrosActivos = {};
      if (estadoFilter) filtrosActivos.estado = estadoFilter;
      if (fechaFilter) filtrosActivos.fecha = fechaFilter;
      
      const { data } = await entrevistasService.getAll(filtrosActivos);
      setEntrevistas(data.entrevistas || []);
    } catch (err) {
      setErrorMsg('Error al cargar las entrevistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrevistas();
  }, [estadoFilter, fechaFilter]);

  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'programada': return { color: '#3B82F6', bg: '#EFF6FF', label: 'Programada' };
      case 'realizada': return { color: '#10B981', bg: '#ECFDF5', label: 'Realizada' };
      case 'cancelada': return { color: '#EF4444', bg: '#FEF2F2', label: 'Cancelada' };
      case 'reprogramada': return { color: '#F59E0B', bg: '#FFFBEB', label: 'Reprogramada' };
      default: return { color: '#6B7280', bg: '#F3F4F6', label: estado };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}
      
      {/* Barra de Filtros */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
          {/* Filtro Estado */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B5563' }}>Estado de entrevista</label>
            <div style={{ position: 'relative' }}>
              <Filter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={16} />
              <select 
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px 0 36px',
                  fontSize: '0.9rem',
                  color: '#111827',
                  appearance: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Todos los estados</option>
                <option value="programada">Programada</option>
                <option value="realizada">Realizada</option>
                <option value="reprogramada">Reprogramada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Filtro Fecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B5563' }}>Fecha</label>
            <div style={{ position: 'relative' }}>
              <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={16} />
              <input 
                type="date"
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px 0 36px',
                  fontSize: '0.9rem',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => { setEstadoFilter(''); setFechaFilter(''); }}
            style={{
              height: '40px',
              padding: '0 16px',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#4B5563',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Limpiar filtros
          </button>
          
          {isAdminOrRRHH && (
            <button 
              onClick={() => navigate('/entrevistas/nueva')}
              style={{
                height: '40px',
                padding: '0 20px',
                backgroundColor: '#7C3AED',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} />
              Nueva entrevista
            </button>
          )}
        </div>
      </div>

      {/* Contenedor de Filas */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Cargando entrevistas...</div>
        ) : entrevistas.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
            No se encontraron entrevistas con los filtros actuales.
          </div>
        ) : (
          entrevistas.map((entrevista, index) => {
            const config = getStatusConfig(entrevista?.estado);
            const isLast = index === entrevistas.length - 1;
            let fechaStr = 'Fecha inválida';
            if (entrevista?.fecha) {
              fechaStr = format(new Date(entrevista.fecha), "dd MMM yyyy", { locale: es });
            }
            
            const post = entrevista?.postulante || entrevista?.Postulante || {};
            const postNombre = post.nombre || '';
            const postApe = post.apellido || '';
            const postInicial = postNombre ? postNombre.charAt(0) : 'P';
            const postPuesto = post.puesto || 'Candidato';

            const entr = entrevista?.entrevistador || entrevista?.Entrevistador || {};
            const entrNombre = entr.nombre || '';
            const entrRol = entr.rol || '';
            const entrInicial = entrNombre ? entrNombre.charAt(0) : 'E';
            
            const modalidad = entrevista?.modalidad || 'presencial';
            const modLabel = modalidad.charAt(0).toUpperCase() + modalidad.slice(1);
            
            return (
              <div 
                key={entrevista?.id || index} 
                onClick={() => navigate(`/entrevistas/${entrevista?.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '24px',
                  borderBottom: isLast ? 'none' : '1px solid #F8F8F8',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {/* Borde izquierdo color estado */}
                <div style={{ position: 'absolute', left: 0, top: '16px', bottom: '16px', width: '4px', backgroundColor: config.color, borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}></div>
                
                {/* Columna 1: Estado y Avatar Postulante */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.color }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: config.color }}>{config.label}</span>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', fontWeight: 'bold' }}>
                    {postInicial}
                  </div>
                </div>

                {/* Columna 2: Nombre Postulante */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{postNombre} {postApe}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>{postPuesto}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>ID: #{entrevista?.id?.toString().padStart(4, '0')}</span>
                </div>

                {/* Columna 3: Fecha y Hora */}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Fecha</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{fechaStr}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: config.color }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{entrevista?.horaInicio} - {entrevista?.horaFin}</span>
                  </div>
                </div>

                {/* Columna 4: Entrevistador */}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>Entrevistador</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338CA', fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {entrInicial}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{entrNombre}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{entrRol}</span>
                    </div>
                  </div>
                </div>

                {/* Columna 5: Modalidad */}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>Modalidad</span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content',
                    backgroundColor: modalidad === 'virtual' ? '#F3E8FF' : '#E0F2FE',
                    color: modalidad === 'virtual' ? '#9333EA' : '#0284C7',
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {modalidad === 'virtual' ? <Monitor size={14} /> : <MapPin size={14} />}
                    {modLabel}
                  </div>
                </div>

                {/* Columna 6: Acciones */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '100px' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/entrevistas/${entrevista?.id}`);
                    }}
                    style={{
                      backgroundColor: '#7C3AED',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6D28D9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#7C3AED';
                    }}
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            );
          })
        )}
        
        {/* Paginación al pie */}
        {entrevistas.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0 0 12px 12px',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #F0F0F0'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
              Mostrando 1 a {entrevistas.length} de {entrevistas.length} entrevistas
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: '#7C3AED', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>1</button>
            </div>
            <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#4B5563', backgroundColor: 'white' }}>
              <option>10 por página</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
