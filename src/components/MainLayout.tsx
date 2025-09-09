// src/components/MainLayout.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import './MainLayout.css';

const MainLayout = () => {
  // --- LÓGICA RESTAURADA ---
  // El estado para colapsar el menú ahora vive aquí de nuevo.
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // El hook nos dice si estamos en una pantalla ancha.
  const isDesktop = useMediaQuery('(min-width: 992px)');

  const toggleSidebar = () => {
    // Esta función solo tendrá efecto en desktop.
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="app-layout">
      {isDesktop ? (
        // En desktop, mostramos el Sidebar y le pasamos el estado y la función para colapsarlo.
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} /> 
      ) : (
        // En móvil/tablet, mostramos el Header y el BottomNav.
        <>
          <Header />
          <BottomNav />
        </>
      )}
      
      <main className={`main-content ${isDesktop ? (isSidebarCollapsed ? 'desktop-collapsed' : 'desktop-full') : 'mobile'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;