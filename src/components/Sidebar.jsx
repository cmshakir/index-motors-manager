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
    <aside className="no-print w-64 bg-zinc-950 border-r border-zinc-800/80 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6">
        
        {/* Navigation items */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white stroke-[2.5]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-black text-white border border-red-500/40'
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
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Total Collected</span>
            <DollarSign className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-lg font-black text-white">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Heavy Truck Repairs & Sales</span>
            <span className="text-red-400 font-semibold">Active Hub</span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-black border border-red-500/30 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-600/20">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-100 truncate">Index Motors v3.0</p>
            <p className="text-[11px] text-red-400 font-medium truncate">Swaraj Mazda & Tata Hub</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
