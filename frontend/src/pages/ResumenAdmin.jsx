import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, XCircle, CheckCircle, Clock, MapPin, Monitor } from 'lucide-react';
import { entrevistasService } from '../services/entrevistas.service';
import Toast from '../components/Toast';

export default function ResumenAdmin() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    entrevistasService.getResumen()
      .then(res => setResumen(res.data))
      .catch(() => setErrorMsg('Error al cargar el resumen. Verificá que seas Administrador o RRHH.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Cargando resumen...</div>;
  if (!resumen) return null;

  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'programada': return { color: '#3B82F6', label: 'Programada' };
      case 'realizada': return { color: '#10B981', label: 'Realizada' };
      case 'cancelada': return { color: '#EF4444', label: 'Cancelada' };
      case 'reprogramada': return { color: '#F59E0B', label: 'Reprogramada' };
      default: return { color: '#6B7280', label: estado };
    }
  };

  // Calcular max para la barra de progreso
  const maxEntrevistas = Math.max(...(resumen.porEntrevistador || []).map(e => e.cantidad), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111827', margin: 0 }}>Resumen Ejecutivo</h1>
        <p style={{ color: '#6B7280', margin: '4px 0 0 0' }}>Métricas y estado general del sistema</p>
      </div>

      {/* 4 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F3F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Entrevistas hoy</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#111827' }}>{resumen.totalHoy || 0}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Postulantes en proceso</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#111827' }}>{resumen.postulantesEnProceso || 0}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Entrevistas canceladas</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#111827' }}>{resumen.entrevistasCanceladas || 0}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Realizadas este mes</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#111827' }}>{resumen.realizadasMes || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Tabla de Hoy */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>Agenda de Hoy</h2>
          </div>
          
          {(!resumen.entrevistasHoy || resumen.entrevistasHoy.length === 0) ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>No hay entrevistas programadas para hoy.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {resumen.entrevistasHoy.map((ent, index) => {
                const config = getStatusConfig(ent?.estado);
                const isLast = index === resumen.entrevistasHoy.length - 1;
                const post = ent?.postulante || ent?.Postulante || {};
                const entr = ent?.entrevistador || ent?.Entrevistador || {};
                const modalidad = ent?.modalidad || 'presencial';
                
                return (
                  <div key={ent.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: isLast ? 'none' : '1px solid #F8F8F8' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{post.nombre} {post.apellido}</span>
                      <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Postulante a {post.puesto || 'Candidato'}</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Entrevistador</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#374151' }}>{entr.nombre}</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="#6B7280" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{ent.horaInicio} - {ent.horaFin}</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {modalidad === 'virtual' ? <Monitor size={14} color="#9333EA" /> : <MapPin size={14} color="#0284C7" />}
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: modalidad === 'virtual' ? '#9333EA' : '#0284C7', textTransform: 'capitalize' }}>
                        {modalidad}
                      </span>
                    </div>

                    <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: config.color }}>{config.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Carga por entrevistador */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>Carga por Entrevistador</h2>
          </div>
          
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(!resumen.porEntrevistador || resumen.porEntrevistador.length === 0) ? (
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px 0' }}>Sin datos registrados.</div>
            ) : (
              resumen.porEntrevistador.map(entrev => {
                const percent = Math.min((entrev.cantidad / maxEntrevistas) * 100, 100);
                
                return (
                  <div key={entrev.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{entrev.nombre}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{entrev.cantidad}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: '#7C3AED', borderRadius: '99px', width: `${percent}%`, transition: 'width 0.5s ease-out' }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
