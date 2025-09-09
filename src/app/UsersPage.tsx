// src/app/UsersPage.tsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import UserForm from '../features/users/components/UserForm';
import { supabase } from '../lib/supabaseClient';
import './UsersPage.css';

// --- Tipos de Datos ---
export type UserProfile = {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  cargo: string;
  email: string;
  fecha_de_nacimiento: string;
  brevete: string;
};

export type UserFormData = Partial<Omit<UserProfile, 'id'>> & {
  password?: string;
};

// --- Funciones de API (Usando Edge Functions) ---

const fetchProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase.rpc('get_all_users_with_email');
  if (error) {
    console.error("Error fetching profiles:", error);
    throw new Error(error.message);
  }
  return data || [];
};

const createUser = async (formData: UserFormData) => {
  const { data, error } = await supabase.functions.invoke('manage-user', {
    method: 'POST',
    body: formData,
  });
  if (error) throw error;
  return data;
};

const updateUser = async ({ userId, formData }: { userId: string, formData: UserFormData }) => {
  const payload = { ...formData };
  if (!payload.password) {
    delete payload.password;
  }
  
  const { data, error } = await supabase.functions.invoke('manage-user', {
    method: 'PUT',
    body: { id: userId, ...payload },
  });
  if (error) throw error;
  return data;
};

const deleteUser = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('manage-user', {
    method: 'DELETE',
    body: { id: userId },
  });
  if (error) throw error;
  return data;
};

// --- Funciones de Ayuda ---
const formatDate = (date: string | null) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

// --- Componente Principal ---
const UsersPage = () => {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserProfile | null>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<UserProfile[]>({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  });

  // --- MUTACIONES CON EL MANEJO DE ERRORES DEFINITIVO ---

  const { mutate: createUserMutation, isPending: isCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('¡Usuario creado!');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setModalMode(null);
    },
    onError: (error: any) => {
      // Convertimos el objeto de error COMPLETO a un string para buscar de forma segura.
      // Este método es el más robusto.
      const errorString = JSON.stringify(error).toLowerCase();

      if (errorString.includes('duplicate key') && errorString.includes('dni')) {
        toast.error('Error: El DNI ingresado ya existe.');
      } else if (errorString.includes('email address has already been registered')) {
        toast.error('Error: El correo electrónico ya está en uso.');
      } else {
        // Mensaje genérico para cualquier otro caso
        toast.error('Error al crear el usuario. Inténtelo de nuevo.');
        console.error("Error no manejado en createUser:", error);
      }
    },
  });

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('¡Usuario actualizado!');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setModalMode(null);
    },
    onError: (e: Error) => toast.error(`Error al actualizar: ${e.message}`),
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('¡Usuario eliminado!');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setConfirmDelete(null);
    },
    onError: (e: Error) => toast.error(`Error al eliminar: ${e.message}`),
  });

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setModalMode('add');
  };
  
  const handleOpenEditModal = (user: UserProfile) => {
    setSelectedUser(user);
    setModalMode('edit');
  };

  const handleSubmit = (formData: UserFormData) => {
    if (modalMode === 'add') {
      createUserMutation(formData);
    } else if (selectedUser) {
      updateUserMutation({ userId: selectedUser.id, formData });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <button className="add-btn" onClick={handleOpenAddModal}>
          <FiPlus /> Añadir Usuario
        </button>
      </div>

      <div className="table-card">
        {isLoading ? (
          <div className="loading-container"><Spinner /></div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>DNI</th>
                  <th>Cargo</th>
                  <th>Fecha Nac.</th>
                  <th className="actions-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td data-label="Nombre Completo">{`${user.nombres || ''} ${user.apellido_paterno || ''}`}</td>
                    <td data-label="DNI">{user.dni}</td>
                    <td data-label="Cargo">
                      <span className={`cargo-tag ${user.cargo?.toLowerCase()}`}>{user.cargo?.replace(/_/g, ' ') || 'N/A'}</span>
                    </td>
                    <td data-label="Fecha Nac.">{formatDate(user.fecha_de_nacimiento)}</td>
                    <td data-label="Acciones" className="actions-cell">
                      <div className="actions-group">
                        <Link to={`/users/${user.id}`} className="action-btn view-btn" title="Ver Detalles"><FiEye /></Link>
                        <button onClick={() => handleOpenEditModal(user)} className="action-btn edit-btn" title="Editar"><FiEdit /></button>
                        <button onClick={() => setConfirmDelete(user)} className="action-btn delete-btn" title="Eliminar"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'add' ? "Añadir Usuario" : "Editar Usuario"}>
        <UserForm 
          onSubmit={handleSubmit} 
          isLoading={isCreating || isUpdating} 
          initialData={selectedUser || undefined}
          isEditMode={modalMode === 'edit'}
        />
      </Modal>

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar Eliminación">
        <div>
          <p>¿Estás seguro de que deseas eliminar a <strong>{`${confirmDelete?.nombres} ${confirmDelete?.apellido_paterno}`}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="confirm-actions">
          <button className="cancel-btn" onClick={() => setConfirmDelete(null)}>Cancelar</button>
          <button className="delete-confirm-btn" onClick={() => deleteUserMutation(confirmDelete!.id)} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;