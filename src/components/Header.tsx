// src/components/Header.tsx
import './Header.css';
import { useAuth } from '../contexts/useAuth';

const Header = () => {
  const { profile } = useAuth();
  // En el futuro, el ícono de menú podría abrir un drawer
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-logo">Transdovic</h1>
      </div>
      <div className="header-right">
        <span className="header-username">{profile?.nombres}</span>
        {/* Aquí podrías poner un avatar/foto de perfil */}
      </div>
    </header>
  );
};

export default Header;