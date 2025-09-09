// src/app/DriverPanel.tsx

import React from 'react';
// ¡CORRECCIÓN! La importación ahora apunta al archivo del hook.
import { useAuth } from '../contexts/useAuth';

const DriverPanel: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div>
      <h1>Panel del Conductor</h1>
      <p>Bienvenido, {profile?.nombres || user?.email}</p>
      <p>Cargo: {profile?.cargo}</p>
      <button onClick={signOut}>Cerrar Sesión</button>

      {/* Aquí irá la funcionalidad específica para conductores */}
    </div>
  );
};

export default DriverPanel;