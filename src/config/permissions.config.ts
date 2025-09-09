// src/config/permissions.config.ts

// Define todos los roles de la aplicación (excepto los de admin que tienen acceso total)
// Esto se usará en el selector de la página de configuración.
export const APP_ROLES = [
  'CONDUCTOR_CARGA_PESADA',
  'ASISTENTE_ADMINISTRATIVO',
  'ASISTENTE_PROCESOS',
  'CONDUCTOR_PATIO',
];

// Define todos los módulos que se pueden configurar
export const APP_MODULES = [
  { key: 'USUARIOS', name: 'Gestión de Usuarios' },
  { key: 'PROVEEDORES', name: 'Gestión de Proveedores' },
  // Futuro módulo: { key: 'VEHICULOS', name: 'Gestión de Vehículos' },
];

// Define los tipos de permisos disponibles
export const PERMISSION_TYPES = [
  { key: 'can_view', name: 'Ver' },
  { key: 'can_create', name: 'Crear' },
  { key: 'can_edit', name: 'Editar' },
  { key: 'can_delete', name: 'Eliminar' },
];