
import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, History } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import SalesHistory from './components/SalesHistory';

type View = 'dashboard' | 'inventory' | 'pos' | 'history';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('pos');

  const navItems = [
    { id: 'pos', label: 'Caja', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-[#87CEEB]' },
    { id: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" />, color: 'bg-[#87CEEB]' },
    { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard className="w-5 h-5" />, color: 'bg-[#87CEEB]' },
    { id: 'history', label: 'Historial', icon: <History className="w-5 h-5" />, color: 'bg-white border border-slate-200' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar / Navigation */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col p-4 space-y-2 sticky top-0 h-auto md:h-screen z-10">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
            ACTIVA<span className="text-sky-500">SPORTS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">SISTEMA DE GESTIÓN</p>
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-semibold ${
              activeView === item.id 
                ? `${item.id === 'history' ? 'bg-slate-100' : 'bg-[#87CEEB]'} text-black shadow-sm` 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'inventory' && <Inventory />}
        {activeView === 'pos' && <POS />}
        {activeView === 'history' && <SalesHistory />}
      </main>
    </div>
  );
};

export default App;
