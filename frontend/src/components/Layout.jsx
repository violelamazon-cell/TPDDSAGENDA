import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#F8F9FA', 
      overflow: 'hidden', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <Sidebar />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        <Navbar />
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '32px 40px' 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
