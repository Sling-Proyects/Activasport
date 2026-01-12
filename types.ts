
export interface Category {
  id: string;
  nombre: string;
}

export interface StockPorTalle {
  id: string;
  talle: string;
  cantidad: number;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  categoria_id: string;
  stock_critico: number;
  talles: StockPorTalle[];
  categoria?: Category;
}

export interface SaleItem {
  producto_id: string;
  nombre: string;
  talle: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  fecha: string;
  items: SaleItem[];
  total_bruto: number;
  ajuste_tipo: 'descuento' | 'aumento' | 'ninguno';
  ajuste_valor: number;
  total_final: number;
}
