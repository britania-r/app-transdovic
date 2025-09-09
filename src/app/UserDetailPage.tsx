// src/app/UserDetailPage.tsx

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import Spinner from '../components/common/Spinner';
import { FiArrowLeft} from 'react-icons/fi';
import type { UserProfile } from './UsersPage';
import './UserDetailPage.css';

// --- Función de API (ahora local en este archivo y usando la RPC segura) ---
const fetchUserById = async (userId: string | undefined): Promise<UserProfile | null> => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .rpc('get_user_details_by_id', { p_user_id: userId })
    .single();

  if (error) {
    console.error(`Error al obtener el usuario con ID ${userId}:`, error);
    throw new Error(error.message);
  }

  return data;
};

// --- Funciones de Ayuda (COMPLETA) ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No especificado';
  const date = new Date(`${dateString}T00:00:00`); // Asegura la fecha correcta sin importar la zona horaria
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// --- Componente Principal (COMPLETO) ---
const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
  });

  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spinner />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="page-container">
        <div className="page-header">
           <Link to="/users" className="back-link"><FiArrowLeft /> Volver a Usuarios</Link>
        </div>
        <div className="user-detail-card" style={{ marginTop: '20px', padding: '32px' }}>
          <h1>Error al Cargar</h1>
          <p>No se pudo encontrar la información del usuario. Es posible que haya sido eliminado o la URL sea incorrecta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <div className="page-header">
        <Link to="/users" className="back-link" title="Volver a Usuarios">
          <FiArrowLeft />
        </Link>
        <h1 className="user-detail-title">Detalles de Usuario</h1>
      </div>

      <div className="user-detail-card">
        <div className="detail-section">
          <h3 className="section-title">Información Personal</h3>
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Nombres</span><span className="detail-value">{user.nombres || 'N/A'}</span></div>
            <div className="detail-item"><span className="detail-label">Apellidos</span><span className="detail-value">{`${user.apellido_paterno || ''} ${user.apellido_materno || ''}`}</span></div>
            <div className="detail-item"><span className="detail-label">DNI</span><span className="detail-value">{user.dni || 'N/A'}</span></div>
            <div className="detail-item"><span className="detail-label">Fecha de Nacimiento</span><span className="detail-value">{formatDate(user.fecha_de_nacimiento)}</span></div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Información Laboral y de Contacto</h3>
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Correo Electrónico</span><span className="detail-value">{user.email || 'No disponible'}</span></div>
            <div className="detail-item"><span className="detail-label">Cargo</span><span className="detail-value">{user.cargo?.replace(/_/g, ' ') || 'N/A'}</span></div>
            <div className="detail-item"><span className="detail-label">Brevete / Licencia</span><span className="detail-value">{user.brevete || 'N/A'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;