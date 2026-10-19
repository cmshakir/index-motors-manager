import React from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  Truck, 
  Users, 
  UserCheck, 
  Settings, 
  HelpCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  salesCount = 0,
  tasksCount = 0, 
  invoicesCount = 0, 
  expensesCount = 0,
  trucksCount = 0,
  customersCount = 0,
  currency = '₹',
  totalRevenue = 0
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'sales', label: 'Sales & Vehicle CRM', icon: TrendingUp, badge: null },
    { id: 'tasks', label: 'Workshop Job Cards', icon: Wrench, badge: tasksCount },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText, badge: invoicesCount },
    { id: 'expenses', label: 'Income & Expenses', icon: Receipt, badge: expensesCount },
    { id: 'trucks', label: 'Trucks & Inventory', icon: Truck, badge: null },
    { id: 'customers', label: 'Fleet Customers', icon: Users, badge: customersCount },
    { id: 'technicians', label: 'Technicians & Bays', icon: UserCheck, badge: null },
  ];

  return (
    <aside className="no-print w-64 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border-r border-zinc-800/80 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6">
        
        {/* Navigation items */}
        <div>
          <p className="px-3.5 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2.5">
            Operations & Services
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg shadow-red-950/50 border-l-[3px] border-red-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white stroke-[2.5]' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                    <span className="text-[13px]">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/60 text-white border border-red-400/40'
                          : 'bg-zinc-900 text-red-400 border border-zinc-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Workshop Summary Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/90 shadow-lg space-y-3 relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Collected</span>
            <div className="h-6 w-6 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
              <DollarSign className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="truncate">SML & Tata Fleet Hub</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-black border border-red-500/40 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-600/20">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-100 truncate tracking-tight">Index Motors v3.0</p>
            <p className="text-[10px] text-red-400 font-semibold truncate uppercase tracking-wider">Swaraj Mazda & Tata Hub</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
