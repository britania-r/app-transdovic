// src/mocks/react-native.js (VERSIÓN FINAL Y COMPLETA)

// El polyfill necesita esta propiedad.
export const NativeModules = {};

// El polyfill TAMBIÉN necesita esta. Le damos una versión simple para la web.
export const Platform = {
  OS: 'web',
  select: (spec) => spec.web || spec.default,
};

// Mantenemos la exportación por defecto por si acaso.
export default {};