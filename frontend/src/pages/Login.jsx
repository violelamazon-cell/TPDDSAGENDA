import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import Toast from '../components/Toast';
import { Calendar, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await authService.login(data.email, data.password);
      login(response.data.usuario, response.data.accessToken, response.data.usuario.rol);
      navigate('/entrevistas');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0EEFF 0%, #E8E4FF 50%, #EEF0FF 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 8px 40px rgba(100, 80, 200, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
        boxSizing: 'border-box'
      }}>
        
        {/* Header de la card */}
        <Calendar size={52} color="#5B3FE0" />
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#5B3FE0', marginTop: '8px' }}>
          AgendaHR
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginTop: '20px', marginBottom: '0' }}>
          Iniciar Sesión
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', marginTop: '4px', marginBottom: '0' }}>
          Ingresá con tu cuenta para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', marginTop: '28px' }}>
          
          {/* Campo Email */}
          <div>
            <label style={{ display: 'block', color: '#111827', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={18} />
              <input
                {...register('email', { required: 'El email es obligatorio' })}
                type="email"
                placeholder="ejemplo@correo.com"
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '10px',
                  border: '1.5px solid #E5E7EB',
                  backgroundColor: '#F8F7FF',
                  fontSize: '1rem',
                  padding: '0 16px 0 44px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#5B3FE0'; e.target.style.boxShadow = '0 0 0 3px rgba(91, 63, 224, 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {errors.email && <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{errors.email.message}</p>}
          </div>

          {/* Campo Contraseña */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', color: '#111827', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={18} />
              <input
                {...register('password', { required: 'La contraseña es obligatoria' })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '10px',
                  border: '1.5px solid #E5E7EB',
                  backgroundColor: '#F8F7FF',
                  fontSize: '1rem',
                  padding: '0 44px 0 44px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#5B3FE0'; e.target.style.boxShadow = '0 0 0 3px rgba(91, 63, 224, 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
              <div 
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', color: '#9CA3AF' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.password && <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{errors.password.message}</p>}
          </div>

          {/* Link olvidar contraseña */}
          <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.9rem', color: '#5B3FE0', cursor: 'pointer', fontWeight: 500 }}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#5B3FE0',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#4C35C0')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5B3FE0')}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Divisor */}
        <div style={{ borderTop: '1px solid #F0F0F0', width: '100%', margin: '24px 0' }}></div>

        {/* Link registro */}
        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          <span style={{ color: '#6B7280' }}>¿No tenés cuenta? </span>
          <span 
            onClick={() => navigate('/register')}
            style={{ color: '#5B3FE0', fontWeight: 600, cursor: 'pointer' }}
          >
            Registrate
          </span>
        </div>

      </div>
    </div>
  );
}
