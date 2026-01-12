
import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, Tag, Percent, PlusCircle, MinusCircle, FileText } from 'lucide-react';
import { Product, SaleItem, Sale } from '../types';
import { generateReceiptPDF } from '../services/pdfService';

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

const POS: React.FC = () => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState('');
  const [adjustment, setAdjustment] = useState<{ type: 'discount' | 'increase' | 'none', method: 'percentage' | 'fixed', value: number }>({
    type: 'none',
    method: 'percentage',
    value: 0
  });

  const products = useMemo(() => 
    MOCK_PRODUCTS.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const addToCart = (product: Product, talle: string) => {
    const existing = cart.find(item => item.producto_id === product.id && item.talle === talle);
    if (existing) {
      setCart(cart.map(item => 
        item.producto_id === product.id && item.talle === talle 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_unitario }
          : item
      ));
    } else {
      setCart([...cart, {
        producto_id: product.id,
        nombre: product.nombre,
        talle,
        cantidad: 1,
        precio_unitario: product.precio,
        subtotal: product.precio
      }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty, subtotal: newQty * item.precio_unitario };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  
  const finalTotal = useMemo(() => {
    if (adjustment.type === 'none' || adjustment.value === 0) return subtotal;
    let delta = 0;
    if (adjustment.method === 'percentage') {
      delta = (subtotal * adjustment.value) / 100;
    } else {
      delta = adjustment.value;
    }
    return adjustment.type === 'discount' ? subtotal - delta : subtotal + delta;
  }, [subtotal, adjustment]);

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    
    const sale: Sale = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      items: cart,
      total_bruto: subtotal,
      ajuste_tipo: adjustment.type === 'discount' ? 'descuento' : adjustment.type === 'increase' ? 'aumento' : 'ninguno',
      ajuste_valor: adjustment.value,
      total_final: finalTotal
    };

    generateReceiptPDF(sale);
    alert("Venta completada y comprobante generado.");
    setCart([]);
    setAdjustment({ type: 'none', method: 'percentage', value: 0 });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[calc(100vh-120px)] overflow-hidden">
      {/* Products Side */}
      <div className="flex-1 space-y-4 flex flex-col">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-200 focus:outline-none font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-fit hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight leading-tight">{p.nombre}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase">{p.categoria?.nombre}</p>
                </div>
                <div className="text-lg font-black text-sky-600">${p.precio.toLocaleString('es-AR')}</div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Seleccionar Talle</p>
                <div className="flex flex-wrap gap-2">
                  {p.talles.map(t => (
                    <button
                      key={t.id}
                      disabled={t.cantidad <= 0}
                      onClick={() => addToCart(p, t.talle)}
                      className={`px-3 py-2 rounded-lg border text-sm font-bold transition-all ${
                        t.cantidad > 0 
                          ? 'border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-700' 
                          : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {t.talle} <span className="text-[10px] opacity-60 ml-1">({t.cantidad})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Side */}
      <div className="w-full lg:w-96 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-500" />
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Carrito</h3>
          </div>
          <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full">
            {cart.reduce((a, b) => a + b.cantidad, 0)} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item, idx) => (
            <div key={`${item.producto_id}-${item.talle}`} className="group p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-black text-slate-800 text-sm uppercase truncate leading-none">{item.nombre}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Talle: {item.talle}</div>
                </div>
                <button onClick={() => removeFromCart(idx)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(idx, -1)} className="text-slate-400 hover:text-sky-500">
                    <MinusCircle className="w-5 h-5" />
                  </button>
                  <span className="font-black text-slate-700 w-4 text-center">{item.cantidad}</span>
                  <button onClick={() => updateQuantity(idx, 1)} className="text-slate-400 hover:text-sky-500">
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="font-black text-slate-800">${item.subtotal.toLocaleString('es-AR')}</div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-50">
              <ShoppingCart className="w-12 h-12 mb-4" />
              <p className="font-bold text-sm">EL CARRITO ESTÁ VACÍO</p>
            </div>
          )}
        </div>

        {/* Adjustments & Total */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setAdjustment({ ...adjustment, type: adjustment.type === 'discount' ? 'none' : 'discount' })}
              className={`p-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${adjustment.type === 'discount' ? 'bg-red-100 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <Tag className="w-3 h-3" /> Descuento
            </button>
            <button 
              onClick={() => setAdjustment({ ...adjustment, type: adjustment.type === 'increase' ? 'none' : 'increase' })}
              className={`p-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${adjustment.type === 'increase' ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <Percent className="w-3 h-3" /> Recargo
            </button>
          </div>

          {adjustment.type !== 'none' && (
            <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
              <select 
                className="p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white outline-none"
                value={adjustment.method}
                onChange={e => setAdjustment({ ...adjustment, method: e.target.value as 'percentage' | 'fixed' })}
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
              <input 
                type="number" 
                placeholder="Valor"
                className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none font-black text-slate-800"
                value={adjustment.value}
                onChange={e => setAdjustment({ ...adjustment, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            {adjustment.type !== 'none' && adjustment.value > 0 && (
              <div className={`flex justify-between text-xs font-bold uppercase ${adjustment.type === 'discount' ? 'text-red-500' : 'text-green-600'}`}>
                <span>{adjustment.type === 'discount' ? 'Descuento' : 'Recargo'}</span>
                <span>{adjustment.type === 'discount' ? '-' : '+'}${((adjustment.method === 'percentage' ? (subtotal * adjustment.value / 100) : adjustment.value)).toLocaleString('es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between items-end pt-2">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Total Final</span>
              <span className="text-2xl font-black text-sky-600">${finalTotal.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <button 
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className="w-full py-4 bg-[#87CEEB] text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-sky-100 hover:bg-[#76bedb] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" /> HACER VENTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
