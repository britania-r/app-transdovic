// src/features/users/components/UserForm.tsx

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import './UserForm.css';
import type { UserFormData } from '../../../app/UsersPage';

const userRoles = [ 'GERENTE', 'ADMINISTRADOR', 'CONDUCTOR_CARGA_PESADA', 'ASISTENTE_ADMINISTRATIVO', 'ASISTENTE_PROCESOS', 'CONDUCTOR_PATIO' ];

type UserFormProps = {
  onSubmit: (formData: UserFormData) => void;
  isLoading: boolean;
  initialData?: UserFormData;
  isEditMode: boolean;
};

const UserForm = ({ onSubmit, isLoading, initialData, isEditMode }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    dni: '',
    cargo: 'CONDUCTOR_PATIO',
    fecha_de_nacimiento: '',
    brevete: '', // <-- AÑADIDO: Campo para brevete en el estado inicial
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        email: initialData.email || '',
        nombres: initialData.nombres || '',
        apellido_paterno: initialData.apellido_paterno || '',
        apellido_materno: initialData.apellido_materno || '',
        dni: initialData.dni || '',
        cargo: initialData.cargo || 'CONDUCTOR_PATIO',
        fecha_de_nacimiento: initialData.fecha_de_nacimiento || '',
        brevete: initialData.brevete || '', // <-- AÑADIDO: Rellenar brevete en modo edición
        password: '',
      });
    } else {
      // Resetea el formulario para el modo 'añadir'
      setFormData({
        email: '', password: '', nombres: '', apellido_paterno: '', apellido_materno: '',
        dni: '', cargo: 'CONDUCTOR_PATIO', fecha_de_nacimiento: '', brevete: '',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-grid">
        <div className="form-group"><label>Nombres</label><input name="nombres" value={formData.nombres} onChange={handleChange} required /></div>
        <div className="form-group"><label>Apellido Paterno</label><input name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} required /></div>
        <div className="form-group"><label>Apellido Materno</label><input name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} /></div>
        <div className="form-group"><label>DNI</label><input name="dni" value={formData.dni} onChange={handleChange} required /></div>
        <div className="form-group full-width"><label>Correo Electrónico</label><input type="email" name="email" value={formData.email} onChange={handleChange} required={!isEditMode} disabled={isEditMode} /></div>
        <div className="form-group"><label>Contraseña</label><input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditMode} placeholder={isEditMode ? "Dejar en blanco para no cambiar" : ""} /></div>
        <div className="form-group"><label>Cargo</label><select name="cargo" value={formData.cargo} onChange={handleChange} required>{userRoles.map(role => (<option key={role} value={role}>{role.replace(/_/g, ' ')}</option>))}</select></div>
        <div className="form-group"><label>Fecha de Nacimiento</label><input type="date" name="fecha_de_nacimiento" value={formData.fecha_de_nacimiento} onChange={handleChange} /></div>
        {/* --- AÑADIDO: CAMPO DE FORMULARIO PARA EL BREVETE --- */}
        <div className="form-group"><label>Brevete / Licencia</label><input name="brevete" value={formData.brevete} onChange={handleChange} placeholder="Opcional" /></div>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;