// src/contexts/AuthContext.tsx

import { createContext, useState, useEffect } from 'react';
// Importamos tipos de forma segura para TypeScript
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabaseClient';
// Importamos solo lo que se usa en este archivo para evitar errores
import { APP_MODULES } from '../config/permissions.config';

// --- Tipos de Datos ---

type Profile = {
  id: string;
  cargo: string;
  nombres: string;
};

// ¡NUEVO! Tipos para el sistema de permisos
type PermissionDetails = {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

type PermissionsMap = {
  [moduleKey: string]: PermissionDetails;
};

// Tipo de dato para el valor del contexto, ahora incluye 'permissions'
type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  permissions: PermissionsMap; // <-- AÑADIDO
  loading: boolean;
  signOut: () => Promise<void>;
};

// Se exporta para que el hook 'useAuth' pueda consumirlo.
// Usamos un valor por defecto para evitar el 'undefined' y hacer el hook más seguro.
export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  permissions: {}, // <-- AÑADIDO
  loading: true,
  signOut: async () => {},
});


// --- Componente Proveedor ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<PermissionsMap>({}); // <-- AÑADIDO
  const [loading, setLoading] = useState(true);

  // ¡NUEVO! Función de ayuda para obtener permisos. Es la única lógica nueva.
  const fetchPermissions = async (userProfile: Profile | null): Promise<PermissionsMap> => {
    if (!userProfile) return {};
    const isAdmin = userProfile.cargo === 'GERENTE' || userProfile.cargo === 'ADMINISTRADOR';
    if (isAdmin) {
      const allPermissions: PermissionsMap = {};
      APP_MODULES.forEach(module => {
        allPermissions[module.key] = { can_view: true, can_create: true, can_edit: true, can_delete: true };
      });
      return allPermissions;
    } else {
      const { data: rolePerms, error } = await supabase
        .from('role_permissions')
        .select('module, can_view, can_create, can_edit, can_delete')
        .eq('role', userProfile.cargo);
      if (error) {
        console.error("Error fetching role permissions:", error);
        return {};
      }
      const permissionsMap = rolePerms.reduce((acc: PermissionsMap, perm) => {
        acc[perm.module] = { can_view: perm.can_view, can_create: perm.can_create, can_edit: perm.can_edit, can_delete: perm.delete };
        return acc;
      }, {});
      return permissionsMap;
    }
  };

  useEffect(() => {
    // 1. OBTENER LA SESIÓN INICIAL (Estructura original conservada).
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('id, cargo, nombres')
          .eq('id', session.user.id)
          .single()
          .then(({ data: userProfile, error: profileError }) => {
            if (profileError) throw profileError;
            setProfile(userProfile);
            // ENCADENAMOS LA NUEVA LÓGICA DE PERMISOS AQUÍ
            return fetchPermissions(userProfile);
          })
          .then(userPermissions => {
            setPermissions(userPermissions);
            setLoading(false); // La carga termina después de obtener TODO
          })
          .catch(error => {
            // ¡CLAVE! Manejo de errores para evitar el spinner infinito
            console.error("Error al inicializar sesión:", error);
            setLoading(false);
          });
      } else {
        // La carga termina si no hay sesión (lógica original).
        setLoading(false);
      }
    });

    // 2. ESCUCHAR CAMBIOS FUTUROS (Estructura original conservada).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          supabase
            .from('profiles')
            .select('id, cargo, nombres')
            .eq('id', session.user.id)
            .single()
            .then(({ data: userProfile }) => {
              setProfile(userProfile);
              // AÑADIMOS la carga de permisos aquí también
              fetchPermissions(userProfile).then(setPermissions);
            });
        } else {
          setProfile(null);
          setPermissions({}); // Limpiamos permisos al cerrar sesión
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Añadimos 'permissions' al valor del contexto.
  const value = { session, user, profile, permissions, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};