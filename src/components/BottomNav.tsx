// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiTruck } from 'react-icons/fi';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="bottom-nav-item">
        <FiGrid />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/users" className="bottom-nav-item">
        <FiUsers />
        <span>Usuarios</span>
      </NavLink>
      <NavLink to="/providers" className="bottom-nav-item">
        <FiTruck />
        <span>Proveedores</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;