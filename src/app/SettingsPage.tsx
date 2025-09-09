// src/app/SettingsPage.tsx

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
// ¡CORREGIDO! Importamos 'Select' y el tipo 'StylesConfig' de forma segura.
import Select from 'react-select';
import type { StylesConfig } from 'react-select';

import { supabase } from '../lib/supabaseClient';
import { APP_ROLES, APP_MODULES, PERMISSION_TYPES } from '../config/permissions.config';
import Spinner from '../components/common/Spinner';
import './SettingsPage.css';

// --- Tipos de Datos ---

type ModulePermissions = { [permissionKey: string]: boolean; };
type PermissionsState = { [moduleKey: string]: ModulePermissions; };
type PermissionKey = 'can_view' | 'can_create' | 'can_edit' | 'can_delete';
type RolePermission = { id: number; role: string; module: string; can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean; };

// Tipo para las opciones del selector
interface RoleOption {
  value: string;
  label: string;
}

const roleOptions: RoleOption[] = APP_ROLES.map(role => ({
  value: role,
  label: role.replace(/_/g, ' '),
}));

// ¡CORREGIDO! Simplificamos la definición de tipos para los estilos, eliminando 'GroupBase'.
const customSelectStyles: StylesConfig<RoleOption, false> = {
  control: (provided, state) => ({
    ...provided,
    minWidth: 280,
    fontFamily: 'var(--font-primary)',
    fontSize: '16px',
    border: state.isFocused ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    boxShadow: state.isFocused ? `0 0 0 1px var(--color-primary)` : 'none',
    '&:hover': {
      borderColor: 'var(--color-primary)',
      borderRadius: '12px',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: 'var(--font-primary)',
    backgroundColor: state.isSelected ? 'var(--color-primary)' : state.isFocused ? 'var(--color-primary-light)' : 'var(--color-surface)',
    color: state.isSelected ? 'white' : 'var(--color-text-primary)',
    '&:active': {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      borderRadius: '12px',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--color-text-primary)',
    
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-md)',
  }),
};


const SettingsPage = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<PermissionsState>({});
  const queryClient = useQueryClient();

  const { data: currentPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['role_permissions', selectedRole],
    queryFn: async (): Promise<RolePermission[]> => {
      if (!selectedRole) return [];
      const { data, error } = await supabase.from('role_permissions').select('*').eq('role', selectedRole);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!selectedRole,
  });

  useEffect(() => {
    const initialState: PermissionsState = {};
    APP_MODULES.forEach(module => {
      initialState[module.key] = {};
      PERMISSION_TYPES.forEach(perm => { initialState[module.key][perm.key] = false; });
    });
    if (currentPermissions) {
      currentPermissions.forEach(savedPerm => {
        if (initialState[savedPerm.module]) {
          PERMISSION_TYPES.forEach(permType => {
            const key = permType.key as PermissionKey;
            initialState[savedPerm.module][key] = savedPerm[key];
          });
        }
      });
    }
    setPermissions(initialState);
  }, [currentPermissions]);

  const { mutate: savePermissions, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('manage-role-permissions', { method: 'POST', body: { role: selectedRole, permissions } });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Permisos para ${selectedRole.replace(/_/g, ' ')} guardados.`);
      queryClient.invalidateQueries({ queryKey: ['role_permissions', selectedRole] });
    },
    onError: (error: Error) => { toast.error(`Error al guardar: ${error.message}`); }
  });

  const handlePermissionChange = (moduleKey: string, permissionKey: string, value: boolean) => {
    setPermissions(prev => ({ ...prev, [moduleKey]: { ...prev[moduleKey], [permissionKey]: value, }, }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Configuración de Permisos por Rol</h1>
      </div>
      
      <div className="settings-card">
        <div className="role-selector-container">
          <label htmlFor="role-select">Seleccionar Rol para Configurar:</label>
          
          <Select
            inputId="role-select"
            options={roleOptions}
            styles={customSelectStyles}
            placeholder="-- Elija un rol --"
            value={roleOptions.find(option => option.value === selectedRole) || null}
            onChange={(selectedOption) => setSelectedRole(selectedOption ? selectedOption.value : '')}
            isClearable={false}
          />
        </div>

        {selectedRole && (
          isLoadingPermissions ? <Spinner /> : (
            <div className="permissions-table-container">
              <table className="permissions-table">
                <thead>
                  <tr>
                    <th>Módulo</th>
                    {PERMISSION_TYPES.map(perm => <th key={perm.key}>{perm.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {APP_MODULES.map(module => (
                    <tr key={module.key}>
                      <td>{module.name}</td>
                      {PERMISSION_TYPES.map(perm => (
                        <td key={perm.key} data-label={perm.name}>
                          <input 
                            type="checkbox"
                            checked={permissions[module.key]?.[perm.key] || false}
                            onChange={(e) => handlePermissionChange(module.key, perm.key, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="save-button-container">
                <button onClick={() => savePermissions()} disabled={!selectedRole || isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SettingsPage;