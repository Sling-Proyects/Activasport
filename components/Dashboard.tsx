
import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product } from '../types';

const MOCK_SALES_DATA = [
  { name: 'Lun', total: 45000 },
  { name: 'Mar', total: 52000 },
  { name: 'Mie', total: 38000 },
  { name: 'Jue', total: 65000 },
  { name: 'Vie', total: 82000 },
  { name: 'Sab', total: 95000 },
  { name: 'Dom', total: 20000 },
];

const MOCK_CRITICAL_STOCK: Product[] = [
  {
    id: '2',
    nombre: 'Zapatillas Ultra Boost',
    descripcion: 'Calzado running alta gama',
    precio: 85000,
    costo: 45000,
    categoria_id: 'cat2',
    stock_critico: 2,
    talles: [{ id: 't4', talle: '43', cantidad: 1 }],
    categoria: { id: 'cat2', nombre: 'Calzado' }
  }
];

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const stats = [
    { label: 'Ganancia Diaria', value: '$24.500', trend: '+12%', color: 'border-l-4 border-sky-400' },
    { label: 'Ganancia Semanal', value: '$145.200', trend: '+5%', color: 'border-l-4 border-green-400' },
    { label: 'Ganancia Mensual', value: '$650.000', trend: '+18%', color: 'border-l-4 border-purple-400' },
    { label: 'Ganancia Anual', value: '$7.2M', trend: '+22%', color: 'border-l-4 border-amber-400' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Panel de Control</h2>
          <p className="text-slate-400 font-medium text-sm">Resumen financiero y estado de stock</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <input type="date" className="p-2 text-xs font-bold outline-none rounded-lg" />
          <span className="flex items-center text-slate-300">|</span>
          <input type="date" className="p-2 text-xs font-bold outline-none rounded-lg" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${stat.color} hover:shadow-md transition-shadow`}>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <span className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              Tendencia de Ventas (Semana)
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {MOCK_SALES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#38bdf8' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Stock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Stock Crítico
            </h3>
            <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase">
              {MOCK_CRITICAL_STOCK.length} PRODUCTOS
            </span>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto">
            {MOCK_CRITICAL_STOCK.map(product => (
              <div key={product.id} className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                <div className="font-black text-slate-800 text-sm uppercase mb-1">{product.nombre}</div>
                <div className="flex flex-wrap gap-1">
                  {product.talles.map(t => (
                    <span key={t.id} className="text-[10px] font-black px-2 py-1 bg-white border border-red-200 text-red-600 rounded">
                      {t.talle} → {t.cantidad}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {MOCK_CRITICAL_STOCK.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <AlertCircle className="w-10 h-10 mb-2" />
                <p className="text-sm font-bold">Sin alertas de stock</p>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest">
            VER TODO EL INVENTARIO
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
