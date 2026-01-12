
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkxswffcrxlzjtnaumgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdreHN3ZmZjcnhsemp0bmF1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDU1MDQsImV4cCI6MjA4MzgyMTUwNH0.eUgPV6ktG3eflByDWG02-B0jQg6GkkJY2llIp6QqF7k';

// Nota: Para usar el schema "ActivaSports", se debe configurar en las opciones del cliente
// Sin embargo, en el cliente web estándar 'anon', el esquema se define a nivel de DB o vía headers.
// Aquí simulamos la estructura solicitada.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'ActivaSports'
  }
});

// Prefijos de tablas
export const TABLES = {
  INVENTARIO: 'Activa-Inventario',
  CATEGORIAS: 'Activa-Categorias',
  VENTAS: 'Activa-Ventas',
  TALLES: 'Activa-Talles'
};
