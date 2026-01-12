
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', nombre: 'Ropa' },
    { id: 'cat2', nombre: 'Calzado' },
    { id: 'cat3', nombre: 'Accesorios' }
  ]);
  const [newCat, setNewCat] = useState('');

  if (!isOpen) return null;

  const addCategory = () => {
    if (!newCat.trim()) return;
    setCategories([...categories, { id: Date.now().toString(), nombre: newCat }]);
    setNewCat('');
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black text-slate-800">GESTIÓN CATEGORÍAS</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nueva categoría..." 
              className="flex-1 p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-200 outline-none"
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
            <button 
              onClick={addCategory}
              className="p-3 bg-[#87CEEB] text-black rounded-xl hover:bg-[#76bedb] font-bold"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <span className="font-bold text-slate-700">{cat.nombre}</span>
                <button 
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
