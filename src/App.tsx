// src/App.tsx

// --- ¡CAMBIO CLAVE! ---
// Importamos HashRouter en lugar de BrowserRouter
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext'; 
import { useAuth } from './contexts/useAuth';

// --- Componentes y Páginas (Sin cambios) ---
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import AdminDashboard from './app/AdminPanel';
import ProvidersPage from './app/ProvidersPage';
import UsersPage from './app/UsersPage';
import SettingsPage from './app/SettingsPage';
import DriverTasksPage from './app/DriverPanel';
import Spinner from './components/common/Spinner';
import UserDetailPage from './app/UserDetailPage';

import './App.css';

// Componente de enrutamiento interno (Sin cambios, tu lógica es correcta)
const AppRoutes = () => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  const isAdmin = profile?.cargo === 'GERENTE' || profile?.cargo === 'ADMINISTRADOR';

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          
          {isAdmin && <Route path="settings" element={<SettingsPage />} />}
          
          <Route path="driver/tasks" element={<DriverTasksPage />} />
          
          {/* El 'index' ahora redirige a '/' que en HashRouter es la base */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      )}
    </Routes>
  );
};

// Componente App principal (Aquí aplicamos el cambio)
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
      {/* --- ¡CAMBIO CLAVE! --- */}
      {/* Usamos HashRouter como el contenedor principal de las rutas */}
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </>
  );
}

export default App;