
import React, { useState } from 'react';
import { Search, Calendar, FileDown, Eye } from 'lucide-react';
import { Sale } from '../types';
import { generateReceiptPDF } from '../services/pdfService';

const MOCK_SALES: Sale[] = [
  {
    id: 'V001',
    fecha: '2023-11-15T10:30:00Z',
    items: [
      { producto_id: '1', nombre: 'Remera Pro Run', talle: 'M', cantidad: 2, precio_unitario: 25000, subtotal: 50000 }
    ],
    total_bruto: 50000,
    ajuste_tipo: 'descuento',
    ajuste_valor: 5000,
    total_final: 45000
  },
  {
    id: 'V002',
    fecha: '2023-11-15T14:15:00Z',
    items: [
      { producto_id: '2', nombre: 'Zapatillas Ultra Boost', talle: '42', cantidad: 1, precio_unitario: 85000, subtotal: 85000 }
    ],
    total_bruto: 85000,
    ajuste_tipo: 'ninguno',
    ajuste_valor: 0,
    total_final: 85000
  }
];

const SalesHistory: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) || 
    s.items.some(i => i.nombre.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Historial de Ventas</h2>
      
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por ID o producto..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-200 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          <input type="date" className="bg-transparent text-sm font-bold outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">ID Venta</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Fecha / Hora</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Items</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Total Final</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Comprobante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <span className="font-mono font-bold text-slate-800">#{sale.id}</span>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-700">{new Date(sale.fecha).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-400 font-medium">{new Date(sale.fecha).toLocaleTimeString()}</div>
                </td>
                <td className="p-4">
                  <div className="max-w-xs truncate text-xs font-bold text-slate-600">
                    {sale.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-black text-sky-600">${sale.total_final.toLocaleString('es-AR')}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => generateReceiptPDF(sale)}
                      className="p-2 bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            No se encontraron registros de ventas
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;
