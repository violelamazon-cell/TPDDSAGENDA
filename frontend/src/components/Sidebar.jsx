import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, LayoutDashboard, User, LogOut, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const { usuario, rol, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { to: '/resumen', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/entrevistas', icon: <Calendar size={18} />, label: 'Entrevistas' },
    { to: '/postulantes', icon: <Users size={18} />, label: 'Candidatos' }
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px',
          backgroundColor: '#7C3AED',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Users color="white" size={18} />
        </div>
        <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>AgendaHR</span>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
        {menuItems.map(item => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: '0.95rem',
                textDecoration: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                margin: '2px 12px',
                backgroundColor: isActive ? '#7C3AED' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Perfil */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: '12px',
        margin: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4C35C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{usuario?.nombre || 'Usuario'}</span>
            <span style={{ color: '#7C3AED', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(124, 58, 237, 0.2)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content', marginTop: '2px' }}>
              {rol?.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div 
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <LogOut size={14} /> Cerrar sesión
          </div>
        </div>
      </div>
    </aside>
  );
}
