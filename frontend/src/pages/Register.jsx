import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/auth.service';
import Toast from '../components/Toast';
import { Calendar, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { rol: 'entrevistador' }
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch('password') || '';
  const rol = watch('rol');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol
      };
      await authService.register(payload);
      setSuccessMsg('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '44px',
    borderRadius: '10px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#F8F7FF',
    padding: '0 40px',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#5B3FE0';
    e.target.style.boxShadow = '0 0 0 3px rgba(91, 63, 224, 0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  // Fuerza de la contraseña
  let strength = 0;
  if (password.length > 0) strength = 1; // 1+ char
  if (password.length >= 6) strength = 2; // 6+ chars
  if (password.length >= 8 && /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength = 3;

  const segments = [
    { color: strength >= 1 ? (strength === 1 ? '#EF4444' : strength === 2 ? '#F59E0B' : '#10B981') : '#E5E7EB' },
    { color: strength >= 2 ? (strength === 2 ? '#F59E0B' : '#10B981') : '#E5E7EB' },
    { color: strength >= 3 ? '#10B981' : '#E5E7EB' }
  ];
  
  const strengthText = strength === 0 ? '' : strength === 1 ? 'Débil' : strength === 2 ? 'Media' : 'Fuerte';
  const strengthColor = strength === 1 ? '#EF4444' : strength === 2 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0EEFF 0%, #E8E4FF 50%, #EEF0FF 100%)', overflowY: 'auto' }}>
      {errorMsg && <div style={{ position: 'fixed', top: '20px', zIndex: 10 }}><Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} /></div>}
      {successMsg && <div style={{ position: 'fixed', top: '20px', zIndex: 10 }}><Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} /></div>}

      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(100, 80, 200, 0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', margin: 'auto' }}>
        
        <Calendar size={40} color="#5B3FE0" />
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#5B3FE0', marginTop: '6px' }}>AgendaHR</span>
        
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e', marginTop: '12px', marginBottom: 0 }}>Crear Cuenta</h1>
        <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '2px', marginBottom: '20px' }}>Completá tus datos para registrarte</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ position: 'relative' }}>
            <User size={20} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <input 
              type="text" 
              placeholder="Tu nombre completo"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.nombre && <span style={{ color: '#B91C1C', fontSize: '0.82rem', marginTop: '4px', display: 'block' }}>{errors.nombre.message}</span>}
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={20} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <input 
              type="email" 
              placeholder="tu@email.com"
              {...register('email', { required: 'El email es obligatorio' })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.email && <span style={{ color: '#B91C1C', fontSize: '0.82rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Contraseña"
              {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </button>
            {errors.password && <span style={{ color: '#B91C1C', fontSize: '0.82rem', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
            
            {/* Indicador de fortaleza */}
            <div style={{ marginTop: '8px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                {segments.map((seg, i) => (
                  <div key={i} style={{ height: '4px', borderRadius: '2px', flex: 1, backgroundColor: seg.color, transition: 'background-color 0.3s' }}></div>
                ))}
              </div>
              <div style={{ color: strengthColor, fontSize: '0.8rem', marginTop: '4px', fontWeight: 600, minHeight: '16px' }}>{strengthText}</div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Repetir contraseña"
              {...register('confirmPassword', { required: 'Debes repetir la contraseña' })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: '14px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </button>
            {errors.confirmPassword && <span style={{ color: '#B91C1C', fontSize: '0.82rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword.message}</span>}
          </div>

          {/* Selector de Rol */}
          <div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '10px', padding: '4px', display: 'flex', boxSizing: 'border-box' }}>
            <button
              type="button"
              onClick={() => setValue('rol', 'entrevistador')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.15s',
                backgroundColor: rol === 'entrevistador' ? '#5B3FE0' : 'transparent',
                color: rol === 'entrevistador' ? 'white' : '#6B7280',
                boxShadow: rol === 'entrevistador' ? '0 2px 4px rgba(91,63,224,0.3)' : 'none'
              }}
            >
              Entrevistador
            </button>
            <button
              type="button"
              onClick={() => setValue('rol', 'rrhh')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.15s',
                backgroundColor: rol === 'rrhh' ? '#5B3FE0' : 'transparent',
                color: rol === 'rrhh' ? 'white' : '#6B7280',
                boxShadow: rol === 'rrhh' ? '0 2px 4px rgba(91,63,224,0.3)' : 'none'
              }}
            >
              RRHH
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#5B3FE0',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '16px',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ width: '100%', borderTop: '1px solid #F0F0F0', marginTop: '24px', paddingTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.95rem', color: '#6B7280' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color: '#5B3FE0', fontWeight: 600, textDecoration: 'none' }}>
              Iniciá sesión
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
