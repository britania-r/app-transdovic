// src/app/AdminPanel.tsx
import { useAuth } from '../contexts/useAuth';
import './AdminPanel.css'; // Importamos su propio CSS

const AdminPanel = () => {
  const { profile } = useAuth();
  
  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="welcome-card">
        <h2>Bienvenido de nuevo, {profile?.nombres}!</h2>
        <p>Aquí tienes un resumen de la actividad reciente.</p>
      </div>
      
      {/* Aquí irán las tarjetas y gráficos como en tus imágenes de referencia */}
    </div>
  );
};

export default AdminPanel;