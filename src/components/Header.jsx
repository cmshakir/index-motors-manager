import React from 'react';
import { 
  Truck, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Header({ 
  profile, 
  currentUser,
  onLogout,
  onNewTask, 
  onNewInvoice, 
  onNewSale,
  onOpenSettings,
  onRefreshCloud,
  onOpenCloudModal,
  isSyncing = false,
  activeTab,
  stats
}) {
  return (
    <header className="no-print bg-zinc-950 border-b border-zinc-800/90 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Dealership Branding */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-black flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-500/40 flex-shrink-0">
              <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-2xl font-black tracking-wider text-white truncate max-w-[130px] xs:max-w-none">
                  {profile.name || "INDEX MOTORS"}
                </span>
                
                {/* Status indicator on all screen sizes */}
                {stats?.isCloudConnected ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={onOpenCloudModal}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 transition"
                      title="Cloud Connected - Click to view status or settings"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Cloud</span>
                    </button>
                    <button
                      onClick={onRefreshCloud}
                      className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition"
                      title="Sync now"
                    >
                      <RefreshCw className={`h-2.5 w-2.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onOpenCloudModal}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[10px] font-bold transition animate-pulse"
                    title="Running in local mode - Click to connect cloud database"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Local (Sync)</span>
                  </button>
                )}

                <span className="hidden md:inline px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/30 rounded">
                  Swaraj Mazda & Tata Hub
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-medium hidden sm:block">
                Buses & Lorries • Pallipadi, Gudallur • 📞 +91 8848555675
              </p>
            </div>
          </div>

          {/* Center Quick Stats Badge */}
          <div className="hidden lg:flex items-center space-x-4 bg-zinc-900/90 px-4 py-2 rounded-xl border border-zinc-800">
            <button
              onClick={onOpenCloudModal}
              className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer"
              title="Click to manage cloud database connection"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${stats?.isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-[11px] font-semibold text-zinc-300">
                {stats?.isCloudConnected ? 'Cloud DB Connected (Supabase)' : 'Local Storage Mode (Click to Connect)'}
              </span>
            </button>
            {stats?.isCloudConnected && (
              <button
                onClick={onRefreshCloud}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition"
                title="Sync with cloud database"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            )}
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">Workshop:</span>
              <span className="text-xs font-semibold text-emerald-400">{stats?.activeTasksCount || 0} Jobs</span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">Receivables:</span>
              <span className="text-xs font-semibold text-red-400">{formatCurrency(stats?.pendingInvoicesAmount || 0, profile.currency)}</span>
            </div>
          </div>

          {/* Action Buttons & User Profile */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Quick Sale Creation */}
            <button
              onClick={onNewSale}
              className="hidden xs:flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all transform active:scale-95"
              title="Create new vehicle sales deal"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">+ Sale Deal</span>
              <span className="sm:hidden">+ Sale</span>
            </button>

            {/* Quick Task Creation */}
            <button
              onClick={onNewTask}
              className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-red-500/40 shadow-md transition-all transform active:scale-95"
              title="Create new workshop repair or service job card"
            >
              <Wrench className="h-4 w-4 stroke-[2.5] text-red-500" />
              <span className="hidden sm:inline">New Job Card</span>
              <span className="sm:hidden">+ Job</span>
            </button>

            {/* Quick Invoice Creation (Desktop/Tablet) */}
            <button
              onClick={onNewInvoice}
              className="hidden sm:flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm border border-zinc-700 shadow transition-all transform active:scale-95"
              title="Create new workshop or truck sale invoice"
            >
              <FileText className="h-4 w-4 stroke-[2.5]" />
              <span>New Invoice</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="hidden sm:block p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition"
              title="Dealership profile, labor rates, and database backup"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile Pill & Logout Button */}
            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-red-400 font-semibold">
                    {currentUser.role?.split(' ')[0] || "Staff"}
                  </span>
                </div>

                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-black border border-red-500/40 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-600/20">
                  {currentUser.avatar || currentUser.name?.slice(0, 2).toUpperCase()}
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 transition"
                  title="Logout / Switch Account"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
