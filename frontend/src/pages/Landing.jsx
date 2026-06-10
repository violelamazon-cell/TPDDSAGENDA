import { useNavigate, Navigate } from 'react-router-dom';
import { Calendar, User, Rocket, CalendarCheck, UserCheck, Clock, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  if (token) {
    return <Navigate to="/entrevistas" replace />;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* HERO — 60% de la pantalla */}
      <div style={{
        height: '60vh',
        background: 'linear-gradient(160deg, #0a0520 0%, #1a0a4a 50%, #2d1b69 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #7C3AED',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px'
      }}>

        {/* Decoración de puntos */}
        <div style={{ position: 'absolute', top: '30px', left: '30px', opacity: 0.2, pointerEvents: 'none', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '96px', height: '96px' }}>
          {[...Array(16)].map((_, i) => <div key={i} style={{ width: '6px', height: '6px', backgroundColor: '#7C3AED', borderRadius: '50%' }}></div>)}
        </div>

        {/* NAVBAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 48px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Logo izquierda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <Calendar color="#7C3AED" size={24} />
            <span>AgendaHR</span>
          </div>
          
          {/* Botón Iniciar Sesión derecha */}
          <button 
            onClick={() => navigate('/login')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <User size={16} />
            Iniciar Sesión
          </button>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          gap: '16px'
        }}>
          {/* Título h1 */}
          <h1 style={{
            fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)',
            fontWeight: 700,
            color: 'white',
            maxWidth: '800px',
            margin: 0,
            lineHeight: 1.2
          }}>
            Coordiná entrevistas sin <span style={{ position: 'relative', display: 'inline-block' }}>
              caos
              <span style={{
                position: 'absolute',
                bottom: '2px',
                left: 0,
                width: '100%',
                height: '8px',
                backgroundColor: '#7C3AED',
                zIndex: -1,
                borderRadius: '4px',
                opacity: 0.8,
                transform: 'rotate(-2deg)'
              }}></span>
            </span>
          </h1>
          
          {/* Subtítulo p */}
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '560px',
            margin: 0,
            lineHeight: 1.4
          }}>
            Gestioná postulantes, entrevistadores y horarios en un solo lugar. Sin superposiciones, sin confusión.
          </p>
          
          {/* Botón Comenzar ahora */}
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 28px',
              backgroundColor: '#7C3AED',
              color: 'white',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = '#6D28D9'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = '#7C3AED'; }}
          >
            <Rocket size={18} />
            Comenzar ahora
          </button>
        </div>

        {/* FILA DE 4 FEATURES */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          padding: '16px 48px 24px',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: <Calendar size={16} />, text: "Sin superposiciones" },
            { icon: <Users size={16} />, text: "Control por roles" },
            { icon: <Shield size={16} />, text: "Seguro y confiable" },
            { icon: <Zap size={16} />, text: "Fácil de usar" },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '99px',
              color: 'white',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>

      </div>

      {/* SECCIÓN CARDS — 40% de la pantalla */}
      <div style={{
        height: '40vh',
        background: '#F8F7FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 48px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '1100px',
          width: '100%',
          height: '100%',
          alignItems: 'center'
        }}>
          
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #f1f1f1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            maxHeight: '200px',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#EDE9FE', color: '#7C3AED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <CalendarCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Sin superposiciones de horario</h3>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
              Visualizá todas las entrevistas en un calendario compartido y evitá choques.
            </p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#7C3AED' }}></div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #f1f1f1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            maxHeight: '200px',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#E0F2FE', color: '#0284C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <UserCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Roles y permisos por usuario</h3>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
              Asigná permisos a tu equipo para mantener la información segura.
            </p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#0284C7' }}></div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #f1f1f1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            maxHeight: '200px',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <Clock size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Historial completo de cambios</h3>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
              Registrá cada acción realizada en el sistema con fecha y hora.
            </p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#059669' }}></div>
          </div>

        </div>
      </div>

    </div>
  );
}
