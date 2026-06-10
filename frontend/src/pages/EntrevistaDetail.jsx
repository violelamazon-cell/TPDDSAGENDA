import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Monitor, 
  MapPin, 
  ExternalLink, 
  FileText, 
  XCircle, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { entrevistasService } from '../services/entrevistas.service';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useAuth } from '../context/AuthContext';

export default function EntrevistaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rol, usuario } = useAuth();
  
  const [entrevista, setEntrevista] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRealizadaModal, setShowRealizadaModal] = useState(false);
  const [observacionesInput, setObservacionesInput] = useState('');

  const isAdminOrRRHH = ['admin', 'rrhh'].includes(rol);
  const isEntrevistadorAsignado = rol === 'entrevistador' && entrevista?.entrevistador?.id === usuario?.id;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entRes, histRes] = await Promise.all([
        entrevistasService.getById(id),
        entrevistasService.getHistorial(id)
      ]);
      setEntrevista(entRes.data);
      setHistorial(histRes.data);
    } catch (err) {
      setErrorMsg('Error al cargar los detalles de la entrevista');
      if(err.response?.status === 403 || err.response?.status === 404) {
          navigate('/entrevistas');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCancelar = async () => {
    try {
      await entrevistasService.cancelar(id, { motivo: observacionesInput });
      setSuccessMsg('Entrevista cancelada exitosamente');
      setShowCancelModal(false);
      setObservacionesInput('');
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al cancelar');
    }
  };

  const handleRealizar = async () => {
    try {
      await entrevistasService.realizar(id, { observaciones: observacionesInput });
      setSuccessMsg('Entrevista marcada como realizada');
      setShowRealizadaModal(false);
      setObservacionesInput('');
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al actualizar');
    }
  };

  const formatFechaLarga = (dateString) => {
    try {
      if (!dateString) return '';
      const parts = dateString.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (isoString) => {
    try {
      if (!isoString) return '';
      return format(new Date(isoString), "dd/MM/yyyy HH:mm");
    } catch {
      return isoString;
    }
  };

  const calcularDuracion = (inicio, fin) => {
    if (!inicio || !fin) return 0;
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          border: '4px solid #F0EEFF', 
          borderTopColor: '#5B3FE0', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }
  
  if (!entrevista) return null;

  const canCancel = isAdminOrRRHH && (entrevista.estado === 'programada' || entrevista.estado === 'reprogramada');
  const canReprogram = isAdminOrRRHH && (entrevista.estado === 'programada' || entrevista.estado === 'reprogramada');
  const canMarkRealizada = (isAdminOrRRHH || isEntrevistadorAsignado) && (entrevista.estado === 'programada' || entrevista.estado === 'reprogramada');

  return (
    <div style={{ padding: '32px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}
      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}

      {/* Encabezado de página */}
      <Link 
        to="/entrevistas" 
        style={{ 
          color: '#5B3FE0', 
          fontSize: '0.9rem', 
          cursor: 'pointer', 
          marginBottom: '20px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          textDecoration: 'none',
          fontWeight: 500
        }}
      >
        <ArrowLeft size={16} /> Volver a entrevistas
      </Link>

      {/* Layout de 2 columnas */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* CARD PRINCIPAL (Columna Izquierda) */}
        <div style={{ 
          flex: 2, 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
          padding: '32px', 
          overflow: 'hidden' 
        }}>
          
          {/* Header de la card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                  {entrevista.postulante?.nombre} {entrevista.postulante?.apellido}
                </h1>
                <StatusBadge status={entrevista.estado} />
              </div>
              <span style={{ 
                backgroundColor: '#EDE9FE', 
                color: '#5B3FE0', 
                padding: '4px 12px', 
                borderRadius: '6px', 
                fontSize: '0.85rem', 
                fontWeight: 500, 
                display: 'inline-block', 
                marginTop: '8px' 
              }}>
                {entrevista.postulante?.puesto}
              </span>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #F3F4F6', margin: '20px 0' }}></div>

          {/* Filas de datos */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#F0EEFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={16} color="#5B3FE0" />
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem', width: '120px', flexShrink: 0, marginTop: '6px' }}>Fecha</div>
            <div style={{ color: '#1a1a2e', fontWeight: 500, marginTop: '6px' }}>
              {formatFechaLarga(entrevista.fecha)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#F0EEFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={16} color="#5B3FE0" />
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem', width: '120px', flexShrink: 0, marginTop: '6px' }}>Hora</div>
            <div style={{ color: '#1a1a2e', fontWeight: 500, marginTop: '6px' }}>
              {entrevista.horaInicio} - {entrevista.horaFin} ({calcularDuracion(entrevista.horaInicio, entrevista.horaFin)} min)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#F0EEFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={16} color="#5B3FE0" />
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem', width: '120px', flexShrink: 0, marginTop: '6px' }}>Entrevistador</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#1a1a2e', fontWeight: 500, marginTop: '6px' }}>{entrevista.entrevistador?.nombre} {entrevista.entrevistador?.apellido}</span>
              <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>Entrevistador</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#F0EEFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {entrevista.modalidad === 'virtual' ? <Monitor size={16} color="#5B3FE0" /> : <MapPin size={16} color="#5B3FE0" />}
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem', width: '120px', flexShrink: 0, marginTop: '6px' }}>Modalidad</div>
            <div style={{ color: '#1a1a2e', fontWeight: 500, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ textTransform: 'capitalize' }}>{entrevista.modalidad}</span>
              {entrevista.modalidad === 'virtual' ? (
                <a href={entrevista.link} target="_blank" rel="noreferrer" style={{ color: '#5B3FE0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                  Abrir enlace <ExternalLink size={14} />
                </a>
              ) : (
                <span style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: 400 }}>- {entrevista.ubicacion}</span>
              )}
            </div>
          </div>

          {/* Sección observaciones */}
          {entrevista.observaciones && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>
                <FileText size={16} /> Observaciones
              </div>
              <textarea
                readOnly
                value={entrevista.observaciones}
                style={{ 
                  backgroundColor: '#F9FAFB', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  width: '100%', 
                  minHeight: '100px', 
                  resize: 'none', 
                  color: '#374151', 
                  fontFamily: 'inherit',
                  boxSizing: 'border-box' 
                }}
              />
            </div>
          )}

          {/* Botones de acción al pie */}
          {(canCancel || canReprogram || canMarkRealizada) && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              {canCancel && (
                <button 
                  onClick={() => setShowCancelModal(true)} 
                  style={{ 
                    border: '1.5px solid #EF4444', 
                    color: '#EF4444', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer', 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  <XCircle size={18} /> Cancelar
                </button>
              )}
              {canReprogram && (
                <button 
                  onClick={() => navigate(`/entrevistas/${id}/reprogramar`)} 
                  style={{ 
                    border: '1.5px solid #D1D5DB', 
                    color: '#374151', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer', 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  <Calendar size={18} /> Reprogramar
                </button>
              )}
              {canMarkRealizada && (
                <button 
                  onClick={() => setShowRealizadaModal(true)} 
                  style={{ 
                    border: 'none', 
                    color: 'white', 
                    backgroundColor: '#15803D', 
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer', 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  <CheckCircle size={18} /> Marcar Realizada
                </button>
              )}
            </div>
          )}
        </div>

        {/* CARD HISTORIAL (Columna Derecha) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
          padding: '24px', 
          position: 'sticky', 
          top: '24px' 
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px', marginTop: 0 }}>
            Historial
          </h2>

          {historial.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9CA3AF', padding: '20px 0' }}>
              <Clock size={32} color="#D1D5DB" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '0.9rem' }}>Sin registros aún</span>
            </div>
          ) : (
            <div>
              {historial.map((item, idx) => {
                const isLast = idx === historial.length - 1;
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', position: 'relative', paddingBottom: isLast ? '0' : '20px' }}>
                    {/* Línea conectora */}
                    {!isLast && (
                      <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: '0', width: '2px', backgroundColor: '#EDE9FE' }}></div>
                    )}
                    
                    {/* Ícono */}
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#F0EEFF', 
                      borderRadius: '50%', 
                      color: '#5B3FE0', 
                      flexShrink: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      zIndex: 1 
                    }}>
                      <Clock size={16} />
                    </div>

                    {/* Contenido */}
                    <div style={{ paddingTop: '2px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{formatDateTime(item.fechaHora)}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginTop: '2px' }}>
                        {item.usuario?.nombre} {item.usuario?.apellido}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#4B5563', marginTop: '2px' }}>
                        {item.accion === 'creacion' ? 'Creó la entrevista' :
                         item.accion === 'edicion' ? 'Editó los detalles' :
                         item.accion === 'reprogramacion' ? 'Reprogramó la fecha/hora' :
                         item.accion === 'realizacion' ? 'Marcó como realizada' :
                         item.accion === 'cancelacion' ? 'Canceló la entrevista' : item.accion}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL CANCELAR */}
      {showCancelModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            width: '400px', 
            borderRadius: '16px', 
            padding: '28px', 
            boxSizing: 'border-box' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <AlertTriangle size={32} color="#D97706" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px 0' }}>Cancelar Entrevista</h3>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
                ¿Estás seguro que deseas cancelar esta entrevista? Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', fontWeight: 500, marginBottom: '8px' }}>
                Motivo (opcional)
              </label>
              <textarea 
                value={observacionesInput} 
                onChange={e => setObservacionesInput(e.target.value)}
                style={{ 
                  width: '100%', 
                  border: '1px solid #D1D5DB', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  minHeight: '80px', 
                  resize: 'none', 
                  fontFamily: 'inherit', 
                  boxSizing: 'border-box' 
                }}
                placeholder="Indique el motivo..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowCancelModal(false)} 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  backgroundColor: '#F3F4F6', 
                  color: '#4B5563', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Volver
              </button>
              <button 
                onClick={handleCancelar} 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  backgroundColor: '#EF4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REALIZADA */}
      {showRealizadaModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            width: '400px', 
            borderRadius: '16px', 
            padding: '28px', 
            boxSizing: 'border-box' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <CheckCircle size={32} color="#15803D" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px 0' }}>Marcar como Realizada</h3>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
                Registrá las observaciones o resultados.
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', fontWeight: 500, marginBottom: '8px' }}>
                Observaciones finales (opcional)
              </label>
              <textarea 
                value={observacionesInput} 
                onChange={e => setObservacionesInput(e.target.value)}
                style={{ 
                  width: '100%', 
                  border: '1px solid #D1D5DB', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  minHeight: '120px', 
                  resize: 'none', 
                  fontFamily: 'inherit', 
                  boxSizing: 'border-box' 
                }}
                placeholder="Feedback del desempeño..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowRealizadaModal(false)} 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  backgroundColor: '#F3F4F6', 
                  color: '#4B5563', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleRealizar} 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  backgroundColor: '#15803D', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
