import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import EntrevistasList from './pages/EntrevistasList';
import EntrevistaDetail from './pages/EntrevistaDetail';
import EntrevistaFormPage from './pages/EntrevistaFormPage';
import ReprogramarPage from './pages/ReprogramarPage';
import ResumenAdmin from './pages/ResumenAdmin';
import PostulantesList from './pages/PostulantesList';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            
            <Route path="entrevistas">
              <Route index element={<EntrevistasList />} />
              <Route 
                path="nueva" 
                element={
                  <ProtectedRoute roles={['admin', 'rrhh']}>
                    <EntrevistaFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route path=":id" element={<EntrevistaDetail />} />
              <Route 
                path=":id/editar" 
                element={
                  <ProtectedRoute roles={['admin', 'rrhh']}>
                    <EntrevistaFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path=":id/reprogramar" 
                element={
                  <ProtectedRoute roles={['admin', 'rrhh']}>
                    <ReprogramarPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            <Route 
              path="resumen" 
              element={
                <ProtectedRoute roles={['admin', 'rrhh']}>
                  <ResumenAdmin />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="postulantes" 
              element={
                <ProtectedRoute roles={['admin', 'rrhh']}>
                  <PostulantesList />
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
