import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Navbar() {
  const { usuario, rol } = useAuth();

  const getRolDisplay = () => {
    switch(rol) {
      case 'admin': return 'Administrador';
      case 'rrhh': return 'Recursos Humanos';
      case 'entrevistador': return 'Entrevistador';
      default: return rol || 'Usuario';
    }
  };

  return (
    <header style={{
      height: '72px',
      backgroundColor: 'white',
      borderBottom: '1px solid #F0F0F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flexShrink: 0
    }}>
      
      {/* Izquierda */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>
          Hola, {usuario?.nombre || 'Usuario'} 👋
        </h2>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>
          Aquí tienes el resumen de la agenda.
        </p>
      </div>
      
      {/* Derecha */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F3F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', lineHeight: 1 }}>{usuario?.nombre || 'Usuario'}</span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>{getRolDisplay()}</span>
          </div>
        </div>
      </div>

    </header>
  );
}
