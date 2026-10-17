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
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  salesCount = 0,
  tasksCount = 0, 
  invoicesCount = 0, 
  trucksCount = 0,
  customersCount = 0,
  currency = '₹',
  totalRevenue = 0
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'sales', label: 'Sales & Vehicle CRM', icon: TrendingUp, badge: salesCount },
    { id: 'tasks', label: 'Workshop Job Cards', icon: Wrench, badge: tasksCount },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText, badge: invoicesCount },
    { id: 'trucks', label: 'Trucks & Inventory', icon: Truck, badge: trucksCount },
    { id: 'customers', label: 'Fleet Customers', icon: Users, badge: customersCount },
    { id: 'technicians', label: 'Technicians & Bays', icon: UserCheck, badge: null },
  ];

  return (
    <aside className="no-print w-64 bg-slate-900/90 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6">
        
        {/* Navigation items */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
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
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Total Collected</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-white">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Heavy Truck Repairs & Sales</span>
            <span className="text-emerald-400 font-semibold">Active Hub</span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">Index Motors v2.4</p>
            <p className="text-[11px] text-slate-400 truncate">Commercial Fleet System</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
