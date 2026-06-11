import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { entrevistasService } from '../services/entrevistas.service';
import { usuariosService } from '../services/usuarios.service';
import Toast from '../components/Toast';

export default function ReprogramarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [apiError, setApiError] = useState('');
  const [entrevista, setEntrevista] = useState(null);
  const [entrevistadores, setEntrevistadores] = useState([]);

  const modalidad = watch('modalidad');

  useEffect(() => {
    usuariosService.getEntrevistadores()
      .then(res => setEntrevistadores(res.data))
      .catch(err => console.error("Error cargando entrevistadores", err));

    entrevistasService.getById(id)
      .then(res => {
        const data = res.data;
        setEntrevista(data);
        setValue('fecha', data.fecha);
        setValue('horaInicio', data.horaInicio);
        setValue('horaFin', data.horaFin);
        setValue('entrevistadorId', data.entrevistadorId);
        setValue('modalidad', data.modalidad);
        setValue('ubicacion', data.ubicacion || '');
        setValue('link', data.link || '');
      })
      .catch(err => {
        setErrorMsg('Error al cargar datos');
        if (err.response?.status === 404) navigate('/entrevistas');
      })
      .finally(() => setInitialLoading(false));
  }, [id, setValue, navigate]);

  useEffect(() => {
    const subscription = watch(() => setApiError(''));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    
    const payload = { ...data };
    if (payload.modalidad === 'virtual') payload.ubicacion = null;
    if (payload.modalidad === 'presencial') payload.link = null;

    try {
      await entrevistasService.reprogramar(id, payload);
      navigate(`/entrevistas/${id}`);
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al reprogramar';
      setApiError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    height: '44px',
    borderRadius: '8px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: '0 12px',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#7C3AED';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  if (initialLoading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Cargando datos...</div>;
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '40px',
        maxWidth: '720px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <Link 
          to={`/entrevistas/${id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6B7280',
            fontSize: '0.95rem',
            textDecoration: 'none',
            marginBottom: '16px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={18} />
          Volver a la entrevista
        </Link>
        
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px 0' }}>
          Reprogramar Entrevista
        </h1>

        {/* Card de contexto */}
        <div style={{
          backgroundColor: '#F5F3FF',
          borderLeft: '3px solid #7C3AED',
          borderRadius: '8px',
          padding: '14px 16px',
          marginBottom: '28px',
          fontSize: '0.9rem',
          color: '#4B5563',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div>Postulante: <strong style={{ color: '#1a1a2e' }}>{entrevista?.postulante?.nombre} {entrevista?.postulante?.apellido}</strong></div>
          <div>Fecha actual: {entrevista?.fecha}</div>
          <div>Entrevistador actual: {entrevista?.entrevistador?.nombre} {entrevista?.entrevistador?.apellido}</div>
        </div>

        {/* Error API */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#B91C1C',
            fontSize: '0.9rem',
            marginBottom: '20px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Grilla de campos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Nueva Fecha */}
            <div>
              <label style={labelStyle}>Nueva Fecha</label>
              <input 
                type="date" 
                {...register('fecha', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.fecha && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.fecha.message}</p>}
            </div>

            {/* Entrevistador dropdown */}
            <div>
              <label style={labelStyle}>Entrevistador</label>
              <select 
                {...register('entrevistadorId', { required: 'Debe seleccionar un entrevistador' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Seleccione un entrevistador...</option>
                {entrevistadores.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellido} ({e.email})
                  </option>
                ))}
              </select>
              {errors.entrevistadorId && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.entrevistadorId.message}</p>}
            </div>

            {/* Nueva Hora Inicio */}
            <div>
              <label style={labelStyle}>Nueva Hora Inicio</label>
              <input 
                type="time" 
                {...register('horaInicio', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.horaInicio && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.horaInicio.message}</p>}
            </div>

            {/* Nueva Hora Fin */}
            <div>
              <label style={labelStyle}>Nueva Hora Fin</label>
              <input 
                type="time" 
                {...register('horaFin', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.horaFin && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.horaFin.message}</p>}
            </div>

            {/* Modalidad Pill-Toggle */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Modalidad</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setValue('modalidad', 'presencial')}
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    border: modalidad === 'presencial' ? 'none' : '1px solid #E5E7EB',
                    backgroundColor: modalidad === 'presencial' ? '#7C3AED' : 'white',
                    color: modalidad === 'presencial' ? 'white' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Presencial
                </button>
                <button
                  type="button"
                  onClick={() => setValue('modalidad', 'virtual')}
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    border: modalidad === 'virtual' ? 'none' : '1px solid #E5E7EB',
                    backgroundColor: modalidad === 'virtual' ? '#7C3AED' : 'white',
                    color: modalidad === 'virtual' ? 'white' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Virtual
                </button>
              </div>
            </div>

            {/* Ubicación o Link */}
            <div style={{ gridColumn: '1 / -1' }}>
              {modalidad === 'presencial' ? (
                <>
                  <label style={labelStyle}>Ubicación</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Sala 3, Piso 2"
                    {...register('ubicacion', { required: 'La ubicación es requerida' })}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  {errors.ubicacion && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.ubicacion.message}</p>}
                </>
              ) : (
                <>
                  <label style={labelStyle}>Link de reunión</label>
                  <input 
                    type="url" 
                    placeholder="https://meet.google.com/..."
                    {...register('link', { required: 'El link es requerido' })}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  {errors.link && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.link.message}</p>}
                </>
              )}
            </div>

            {/* Motivo de reprogramación */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Motivo de reprogramación</label>
              <textarea 
                {...register('motivo', { required: 'El motivo es requerido' })}
                style={{
                  ...inputStyle,
                  height: '80px',
                  padding: '12px',
                  resize: 'vertical'
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Indique la razón del cambio..."
              />
              {errors.motivo && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.motivo.message}</p>}
            </div>
          </div>

          {apiError && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#B91C1C',
              fontSize: '0.9rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              {apiError}
            </div>
          )}

          {/* Pie del formulario */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #F3F4F6'
          }}>
            <Link 
              to={`/entrevistas/${id}`}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                color: '#4B5563',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#7C3AED',
                color: 'white',
                padding: '10px 28px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Reprogramando...' : 'Confirmar Reprogramación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
