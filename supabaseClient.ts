
import { createClient } from '@supabase/supabase-js';

// En Vercel, deberías configurar estas variables en Settings > Environment Variables
// Por ahora dejamos las actuales pero preparadas para el entorno
const supabaseUrl = 'https://gkxswffcrxlzjtnaumgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdreHN3ZmZjcnhsemp0bmF1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDU1MDQsImV4cCI6MjA4MzgyMTUwNH0.eUgPV6ktG3eflByDWG02-B0jQg6GkkJY2llIp6QqF7k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'ActivaSports'
  }
});

export const TABLES = {
  INVENTARIO: 'Activa-Inventario',
  CATEGORIAS: 'Activa-Categorias',
  VENTAS: 'Activa-Ventas',
  TALLES: 'Activa-Talles'
};
