import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  TrendingUp, 
  Truck, 
  Users, 
  UserCheck, 
  Settings, 
  LogOut,
  Menu, 
  X,
  RefreshCw,
  ShieldCheck,
  Receipt
} from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  salesCount = 0,
  tasksCount = 0,
  invoicesCount = 0,
  expensesCount = 0,
  trucksCount = 0,
  customersCount = 0,
  onOpenSettings,
  onOpenCloudModal,
  onLogout,
  currentUser,
  isCloudConnected = false,
  isSyncing = false,
  onRefreshCloud
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Jobs', icon: Wrench, badge: tasksCount },
    { id: 'sales', label: 'Sales', icon: TrendingUp, badge: salesCount },
    { id: 'invoices', label: 'Billing', icon: FileText, badge: invoicesCount },
  ];

  const moreTabs = [
    { id: 'expenses', label: 'Income & Expenses', icon: Receipt, badge: expensesCount, desc: 'Add income, direct expenses & live P&L' },
    { id: 'trucks', label: 'Trucks & Catalog', icon: Truck, badge: trucksCount, desc: 'Swaraj Mazda commercial models & fleet' },
    { id: 'customers', label: 'Fleet Customers', icon: Users, badge: customersCount, desc: 'Transport operators & accounts' },
    { id: 'technicians', label: 'Technicians & Bays', icon: UserCheck, desc: 'Service team & workshop capacity' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens < md) */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-2 py-1 safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-1 items-center">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                  isActive 
                    ? 'text-amber-400 font-bold bg-amber-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-500 text-slate-950 shadow">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Menu Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
              isDrawerOpen || moreTabs.some(t => t.id === activeTab)
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Menu className="h-5 w-5" />
              {(trucksCount > 0 || customersCount > 0) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer / Slide-up Sheet */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Header of Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-black text-white text-base tracking-wide">More Sections</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Index Motors
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cloud Status Banner in Mobile Drawer */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onOpenCloudModal) onOpenCloudModal();
                }}
                className="flex items-center space-x-2.5 text-left flex-1 hover:opacity-90 transition mr-2"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>{isCloudConnected ? 'Cloud DB Active (Supabase)' : 'Local Storage Mode'}</span>
                    <span className="text-[10px] text-amber-400 font-medium underline">(Configure)</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isCloudConnected ? 'Changes sync live across all devices' : 'Tap to connect & sync with computer'}
                  </p>
                </div>
              </button>
              {isCloudConnected && (
                <button
                  onClick={onRefreshCloud}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center space-x-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              )}
            </div>

            {/* Additional Tab Links */}
            <div className="space-y-2">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isActive 
                        ? 'bg-amber-500/15 border-amber-500/50 text-white' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 border border-slate-700 text-amber-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Settings & Account Actions */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenSettings();
                }}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                <Settings className="h-4 w-4 text-amber-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onLogout();
                }}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold border border-red-500/30 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Switch / Logout</span>
              </button>
            </div>

            {/* Current User Pill */}
            {currentUser && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                    {currentUser.avatar || currentUser.name?.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400">{currentUser.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400">Active</span>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
