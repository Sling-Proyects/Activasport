
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product, Category, StockPorTalle } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    costo: 0,
    categoria_id: '',
    stock_critico: 3,
    talles: []
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', nombre: 'Ropa' },
    { id: 'cat2', nombre: 'Calzado' },
    { id: 'cat3', nombre: 'Accesorios' }
  ]);

  useEffect(() => {
    if (product) setFormData(product);
    else setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      costo: 0,
      categoria_id: '',
      stock_critico: 3,
      talles: []
    });
  }, [product, isOpen]);

  if (!isOpen) return null;

  const addTalle = () => {
    const newTalle: StockPorTalle = { id: Date.now().toString(), talle: '', cantidad: 0 };
    setFormData(prev => ({ ...prev, talles: [...(prev.talles || []), newTalle] }));
  };

  const updateTalle = (id: string, field: 'talle' | 'cantidad', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      talles: prev.talles?.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const removeTalle = (id: string) => {
    setFormData(prev => ({ ...prev, talles: prev.talles?.filter(t => t.id !== id) }));
  };

  const handleSave = () => {
    console.log("Guardando en Activa-Inventario:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Nombre del Producto</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Camiseta Oficial"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Categoría</label>
              <select 
                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-slate-900 font-medium"
                value={formData.categoria_id}
                onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Precio Venta ($)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-slate-900 font-bold"
                value={formData.precio}
                onChange={e => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Costo ($)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-slate-900 font-bold"
                value={formData.costo}
                onChange={e => setFormData({ ...formData, costo: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Stock Crítico (Aviso de stock bajo)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-slate-900 font-bold"
                value={formData.stock_critico}
                onChange={e => setFormData({ ...formData, stock_critico: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Talles y Stock</h4>
              <button 
                onClick={addTalle}
                className="flex items-center gap-2 px-4 py-2 bg-[#87CEEB] text-black rounded-lg hover:bg-[#76bedb] transition-all font-bold text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" /> Añadir Talle
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {formData.talles?.map((t) => (
                <div key={t.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 group transition-all hover:border-sky-200">
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 w-12 uppercase">Talle</span>
                    <input 
                      type="text" 
                      placeholder="S, M, 42..."
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none font-bold"
                      value={t.talle}
                      onChange={e => updateTalle(t.id, 'talle', e.target.value)}
                    />
                  </div>
                  <div className="w-32 flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Stock</span>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none text-center font-black"
                      value={t.cantidad}
                      onChange={e => updateTalle(t.id, 'cantidad', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <button 
                    onClick={() => removeTalle(t.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {(!formData.talles || formData.talles.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-400 font-medium text-sm">No hay talles definidos para este producto.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all"
          >
            Cerrar
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2 bg-[#87CEEB] text-black rounded-xl hover:bg-[#76bedb] shadow-lg shadow-sky-100 font-black uppercase tracking-widest text-sm transition-all"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
