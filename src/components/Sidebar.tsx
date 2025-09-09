// src/components/layout/Sidebar.tsx

import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth'; // La ruta puede variar, ajústala si es necesario
import { 
  FiGrid, 
  FiUsers, 
  FiTruck, 
  FiSettings, 
  FiLogOut, 
  FiChevronLeft 
} from 'react-icons/fi';

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  // 1. OBTENEMOS LOS PERMISOS Y EL PERFIL DEL CONTEXTO
  const { signOut, permissions, profile } = useAuth();

  // 2. CREAMOS UNA BANDERA PARA SABER SI ES ADMIN
  //    Esto nos sirve para el enlace de 'Configuración'
  const isAdmin = profile?.cargo === 'GERENTE' || profile?.cargo === 'ADMINISTRADOR';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div> {/* Contenedor para la parte superior (logo y navegación) */}
        <div className="sidebar-header">
          {!isCollapsed && <h2 className="sidebar-logo">Transdovic</h2>}
          <button onClick={toggleSidebar} className="sidebar-toggle" title="Colapsar menú">
            <FiChevronLeft className="toggle-icon" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard siempre es visible para todos los usuarios logueados */}
          <NavLink to="/dashboard" className="nav-item" title="Dashboard">
            <FiGrid className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>

          {/* --- RENDERIZADO CONDICIONAL BASADO EN PERMISOS --- */}
          {/* El enlace a Usuarios solo se muestra si el rol tiene permiso de vista */}
          {permissions['USUARIOS']?.can_view && (
            <NavLink to="/users" className="nav-item" title="Usuarios">
              <FiUsers className="nav-icon" />
              <span className="nav-text">Usuarios</span>
            </NavLink>
          )}

          {/* El enlace a Proveedores solo se muestra si el rol tiene permiso de vista */}
          {permissions['PROVEEDORES']?.can_view && (
            <NavLink to="/providers" className="nav-item" title="Proveedores">
              <FiTruck className="nav-icon" />
              <span className="nav-text">Proveedores</span>
            </NavLink>
          )}

        </nav>
      </div>

      <div className="sidebar-bottom"> {/* Contenedor para la parte inferior */}
        
        {/* El enlace a Configuración solo se muestra si el usuario es Admin */}
        {isAdmin && (
          <NavLink to="/settings" className="nav-item" title="Configuración">
            <FiSettings className="nav-icon" />
            <span className="nav-text">Configuración</span>
          </NavLink>
        )}
        
        <button onClick={signOut} className="nav-item logout-btn" title="Cerrar Sesión">
          <FiLogOut className="nav-icon" />
          <span className="nav-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
    
export default Sidebar;