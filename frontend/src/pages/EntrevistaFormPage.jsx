import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { entrevistasService } from '../services/entrevistas.service';
import { postulantesService } from '../services/postulantes.service';
import { usuariosService } from '../services/usuarios.service';

export default function EntrevistaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      modalidad: 'presencial'
    }
  });
  const modalidad = watch('modalidad');
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errorMsg, setErrorMsg] = useState('');

  const [postulantes, setPostulantes] = useState([]);
  const [entrevistadores, setEntrevistadores] = useState([]);

  useEffect(() => {
    // Fetch dropdowns
    Promise.all([
      postulantesService.getAll(),
      usuariosService.getEntrevistadores()
    ]).then(([postRes, usrRes]) => {
      // Filtrar postulantes elegibles
      const elegibles = postRes.data.filter(p => p.estado === 'nuevo' || p.estado === 'en_proceso');
      setPostulantes(elegibles);
      setEntrevistadores(usrRes.data);
    }).catch(err => {
      console.error(err);
      setErrorMsg('Error al cargar datos de referencia.');
    });

    if (isEditing) {
      entrevistasService.getById(id)
        .then(res => {
          const data = res.data;
          setValue('postulanteId', data.postulanteId);
          setValue('entrevistadorId', data.entrevistadorId);
          setValue('fecha', data.fecha);
          setValue('horaInicio', data.horaInicio);
          setValue('horaFin', data.horaFin);
          setValue('modalidad', data.modalidad);
          setValue('ubicacion', data.ubicacion || '');
          setValue('link', data.link || '');
          setValue('observaciones', data.observaciones || '');
        })
        .catch(err => {
          setErrorMsg('Error al cargar datos de la entrevista');
          if (err.response?.status === 404 || err.response?.status === 403) navigate('/entrevistas');
        })
        .finally(() => setInitialLoading(false));
    }
  }, [id, setValue, navigate, isEditing]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    
    const payload = { ...data };
    if (payload.modalidad === 'virtual') payload.ubicacion = null;
    if (payload.modalidad === 'presencial') payload.link = null;

    try {
      if (isEditing) {
        await entrevistasService.update(id, payload);
      } else {
        await entrevistasService.create(payload);
      }
      navigate('/entrevistas');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al guardar la entrevista');
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

  if (initialLoading) return <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Cargando datos...</div>;

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '40px',
        maxWidth: '760px',
        margin: '0 auto'
      }}>
        
        {/* Header de la card */}
        <button 
          onClick={() => navigate('/entrevistas')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: 0,
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 32px 0', textAlign: 'center' }}>
          {isEditing ? 'Editar entrevista' : 'Nueva entrevista'}
        </h2>

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Fila 1: Postulante */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Postulante</label>
              <select 
                {...register('postulanteId', { required: 'Debe seleccionar un postulante' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Seleccione un postulante...</option>
                {postulantes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} — {p.puesto}
                  </option>
                ))}
              </select>
              {errors.postulanteId && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.postulanteId.message}</p>}
            </div>

            {/* Fila 2: Entrevistador */}
            <div style={{ gridColumn: '1 / -1' }}>
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
                    {e.nombre} ({e.email})
                  </option>
                ))}
              </select>
              {errors.entrevistadorId && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.entrevistadorId.message}</p>}
            </div>

            {/* Fila 3: Fecha | Vacía */}
            <div>
              <label style={labelStyle}>Fecha</label>
              <input 
                type="date" 
                {...register('fecha', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.fecha && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.fecha.message}</p>}
            </div>
            <div></div> {/* Columna vacía */}

            {/* Fila 4: Hora Inicio | Hora Fin */}
            <div>
              <label style={labelStyle}>Hora Inicio</label>
              <input 
                type="time" 
                {...register('horaInicio', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.horaInicio && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.horaInicio.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Hora Fin</label>
              <input 
                type="time" 
                {...register('horaFin', { required: 'Requerido' })}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.horaFin && <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errors.horaFin.message}</p>}
            </div>

            {/* Fila 5: Modalidad Pill-Toggle */}
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

            {/* Fila 6: Ubicación o Link */}
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

            {/* Fila 7: Observaciones */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Observaciones</label>
              <textarea 
                {...register('observaciones')}
                style={{
                  ...inputStyle,
                  height: '100px',
                  padding: '12px',
                  resize: 'vertical'
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Anotaciones adicionales..."
              />
            </div>
          </div>

          {/* Pie del formulario */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #F3F4F6'
          }}>
            <button
              type="button"
              onClick={() => navigate('/entrevistas')}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                color: '#4B5563',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Cancelar
            </button>
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
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
