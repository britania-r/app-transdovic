// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext'; 
import { useAuth } from './contexts/useAuth';

// --- Componentes y Páginas ---
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout'; // Asumo que el MainLayout está en esta ruta
import AdminDashboard from './app/AdminPanel';
import ProvidersPage from './app/ProvidersPage';
import UsersPage from './app/UsersPage';
import SettingsPage from './app/SettingsPage';
import DriverTasksPage from './app/DriverPanel';
import Spinner from './components/common/Spinner';
import UserDetailPage from './app/UserDetailPage';

import './App.css';

// Componente de enrutamiento interno
const AppRoutes = () => {
  // 1. OBTENEMOS EL 'profile' DEL CONTEXTO DE AUTENTICACIÓN
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  // 2. CREAMOS UNA BANDERA PARA VERIFICAR SI EL USUARIO ES ADMIN
  // El '?' (optional chaining) previene errores si el perfil aún no ha cargado.
  const isAdmin = profile?.cargo === 'GERENTE' || profile?.cargo === 'ADMINISTRADOR';

  return (
    <Routes>
      {!user ? (
        // --- RUTAS PÚBLICAS: Si NO hay usuario ---
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        // --- RUTAS PRIVADAS: Si SÍ hay usuario ---
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          
          {/* 3. RENDERIZADO CONDICIONAL DE LA RUTA DE CONFIGURACIÓN */}
          {/* Esta línea solo se incluirá en el DOM si el usuario es un administrador */}
          {isAdmin && <Route path="settings" element={<SettingsPage />} />}
          
          <Route path="driver/tasks" element={<DriverTasksPage />} />
          
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* Si un no-admin intenta ir a /settings, no encontrará la ruta y será redirigido al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      )}
    </Routes>
  );
};

// Componente App principal (Sin cambios)
function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: '#fff', color: '#333' },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;