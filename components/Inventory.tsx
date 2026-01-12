
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Trash2, Edit, ChevronUp, ChevronDown, CheckSquare, Square, Settings2 } from 'lucide-react';
import { Product, Category, StockPorTalle } from '../types';
import ProductModal from './ProductModal';
import CategoryModal from './CategoryModal';

// Mock data for initial UI dev (replace with Supabase calls)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nombre: 'Remera Pro Run',
    descripcion: 'Remera deportiva respirable',
    precio: 25000,
    costo: 12000,
    categoria_id: 'cat1',
    stock_critico: 5,
    talles: [{ id: 't1', talle: 'S', cantidad: 10 }, { id: 't2', talle: 'L', cantidad: 3 }],
    categoria: { id: 'cat1', nombre: 'Ropa' }
  },
  {
    id: '2',
    nombre: 'Zapatillas Ultra Boost',
    descripcion: 'Calzado running alta gama',
    precio: 85000,
    costo: 45000,
    categoria_id: 'cat2',
    stock_critico: 2,
    talles: [{ id: 't3', talle: '42', cantidad: 5 }, { id: 't4', talle: '43', cantidad: 1 }],
    categoria: { id: 'cat2', nombre: 'Calzado' }
  }
];

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Filters & Sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.nombre.toLowerCase().includes(search.toLowerCase()) || 
      p.categoria?.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, search, sortConfig]);

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProducts.map(p => p.id)));
  };

  const handleGlobalPriceUpdate = () => {
    const percentage = prompt("Ingrese porcentaje de aumento (ej: 10 para 10%) o descuento (ej: -10):");
    if (!percentage) return;
    const factor = 1 + (parseFloat(percentage) / 100);
    
    setProducts(prev => prev.map(p => {
      if (selectedIds.has(p.id)) {
        return { ...p, precio: Math.round(p.precio * factor) };
      }
      return p;
    }));
    alert("Precios actualizados globalmente");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Inventario</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
          >
            Categorías
          </button>
          <button 
            onClick={() => { setEditingProduct(undefined); setIsProductModalOpen(true); }}
            className="px-4 py-2 bg-[#87CEEB] text-black rounded-lg hover:bg-[#76bedb] transition-colors flex items-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" /> Añadir Producto
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={handleGlobalPriceUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 font-bold"
            >
              <Settings2 className="w-4 h-4" /> Modificar Precios ({selectedIds.size})
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 
                      ? <CheckSquare className="w-5 h-5 text-sky-600" /> 
                      : <Square className="w-5 h-5 text-slate-400" />
                    }
                  </button>
                </th>
                <th onClick={() => handleSort('nombre')} className="p-4 font-bold text-slate-600 cursor-pointer hover:bg-slate-100 select-none">
                  Nombre {sortConfig?.key === 'nombre' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th onClick={() => handleSort('categoria_id')} className="p-4 font-bold text-slate-600 cursor-pointer hover:bg-slate-100 select-none">
                  Categoría
                </th>
                <th className="p-4 font-bold text-slate-600">Stock por Talle</th>
                <th onClick={() => handleSort('precio')} className="p-4 font-bold text-slate-600 cursor-pointer hover:bg-slate-100 select-none">
                  Precio
                </th>
                <th className="p-4 font-bold text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const isSelected = selectedIds.has(product.id);
                const totalStock = product.talles.reduce((acc, t) => acc + t.cantidad, 0);
                const isCritical = totalStock <= product.stock_critico;

                return (
                  <tr key={product.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-sky-50/50' : ''}`}>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelect(product.id)}>
                        {isSelected ? <CheckSquare className="w-5 h-5 text-sky-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{product.nombre}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{product.descripcion}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                        {product.categoria?.nombre || 'S/C'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {product.talles.map(t => (
                          <span key={t.id} className={`text-xs px-2 py-1 rounded border ${t.cantidad <= product.stock_critico ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-600'} font-medium`}>
                            {t.talle} <span className="mx-1">→</span> <strong>{t.cantidad}</strong>
                          </span>
                        ))}
                      </div>
                      {isCritical && <span className="text-[10px] font-bold text-red-500 uppercase mt-1 block">STOCK CRÍTICO</span>}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">
                      ${product.precio.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm('¿Eliminar producto?')) setProducts(p => p.filter(x => x.id !== product.id)) }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            No se encontraron productos.
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={editingProduct}
      />
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
    </div>
  );
};

export default Inventory;
