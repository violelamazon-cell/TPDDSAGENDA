import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { token, rol } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(rol)) {
    return <Navigate to="/entrevistas" replace />;
  }

  return children;
}
