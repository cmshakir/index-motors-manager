import React from 'react';
import { 
  DollarSign, 
  Wrench, 
  FileText, 
  Truck, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Calendar, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown,
  Layers,
  ChevronRight,
  Printer,
  Sparkles,
  MapPin,
  Receipt,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

export default function Dashboard({
  profile,
  tasks = [],
  invoices = [],
  expenses = [],
  trucks = [],
  customers = [],
  technicians = [],
  onSelectTask,
  onSelectInvoice,
  onNewTask,
  onNewInvoice,
  onNewIncome,
  onNewExpense,
  onNavigateTab,
  onGenerateInvoiceFromTask
}) {
  const currency = profile?.currency || '$';

  // Calculations: Separate Incomes vs Expenses
  const directIncomes = expenses.filter(e => e.type === 'income');
  const directExpenses = expenses.filter(e => !e.type || e.type === 'expense');
  const totalDirectIncome = directIncomes.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);
  const totalExpenses = directExpenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const invoiceCollections = invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0);
  const totalRevenueCollected = invoiceCollections + totalDirectIncome;
  const netOperatingProfit = totalRevenueCollected - totalExpenses;

  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Partially Paid' || inv.status === 'Overdue');
  const pendingInvoicesAmount = pendingInvoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);
  
  const activeTasks = tasks.filter(t => t.status !== 'Ready for Pickup' && t.status !== 'Completed');
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High');
  const completedTasks = tasks.filter(t => t.status === 'Ready for Pickup' || t.status === 'Completed');

  const dealershipStockTrucks = trucks.filter(t => t.type === 'Dealership Stock');
  const customerWorkshopTrucks = trucks.filter(t => t.type === 'Customer Truck');

  // Bay Occupancy Mapping
  const bays = profile?.workshopBays || [
    "Bay 1 - Heavy Lift",
    "Bay 2 - Engine Overhaul",
    "Bay 3 - Electrical & Diagnostics",
    "Bay 4 - Brake & Suspension",
    "Bay 5 - Quick Service & Lube",
    "Bay 6 - PDI & Dealership Prep"
  ];

  const getBayOccupant = (bayName) => {
    return tasks.find(t => t.bay === bayName && t.status !== 'Completed' && t.status !== 'Ready for Pickup');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome & Dealership Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-red-950/40 border border-zinc-800/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5 text-red-400" />
              <span>SWARAJ MAZDA SALES & TATA / SML SERVICES • BUSES & LORRIES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {profile.name || "INDEX MOTORS"} Operations Hub
            </h1>
            <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
              Official sales showroom for Swaraj Mazda commercial buses & lorries and heavy workshop service center for Tata & Swaraj Mazda fleets in Pallipadi, Gudallur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewTask}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-red-600/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <Wrench className="h-4 w-4 stroke-[2.5]" />
              <span>+ New Job Card</span>
            </button>
            <button
              onClick={onNewInvoice}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wide border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-red-400" />
              <span>+ Generate Invoice</span>
            </button>
            {onNewIncome && (
              <button
                onClick={onNewIncome}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-600/20 transition-all transform active:scale-95 cursor-pointer"
                title="Record direct income: scrap metal, warranty claims, buybacks"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>+ Add Income</span>
              </button>
            )}
            {onNewExpense && (
              <button
                onClick={onNewExpense}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-md shadow-rose-600/20 transition-all transform active:scale-95 cursor-pointer"
                title="Record expense: parts stock, lubricants, technician wages"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>+ Add Expense</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Truck className="h-64 w-64 text-red-600" />
        </div>
      </div>

      {/* Top 6 Key Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Metric 1: Total Revenue Collected */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Inflows</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatCurrency(totalRevenueCollected, currency)}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              <span className="text-emerald-400 font-semibold mr-1">
                {invoices.filter(i => i.status === 'Paid').length} Invoices
              </span>
              <span>• {directIncomes.length} Direct</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Expenditures (Outflow) */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('expenses')}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-rose-500/50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg cursor-pointer group"
          title="Click to manage expenditures"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-rose-400 transition">Outflows</span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Receipt className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
              {formatCurrency(totalExpenses, currency)}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              <span>{directExpenses.length} Expense Vouchers</span>
              <span className="text-red-400 ml-1 underline group-hover:inline hidden">View ➔</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Net Operating Profit */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Net Profit</span>
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
              netOperatingProfit >= 0 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {netOperatingProfit >= 0 ? <TrendingUp className="h-4 w-4 stroke-[2.5]" /> : <TrendingDown className="h-4 w-4 stroke-[2.5]" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${netOperatingProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netOperatingProfit, currency)}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              <span>Revenue minus costs</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Receivables */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Receivables</span>
            <div className="h-8 w-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Clock className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-red-400 tracking-tight">
              {formatCurrency(pendingInvoicesAmount, currency)}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              <span className="text-red-400 font-semibold mr-1">
                {pendingInvoices.length} Due
              </span>
              <span>({invoices.filter(i => i.status === 'Overdue').length} overdue)</span>
            </div>
          </div>
        </div>

        {/* Metric 5: Active Workshop Jobs */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Workshop Jobs</span>
            <div className="h-8 w-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-400">
              <Wrench className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeTasks.length} <span className="text-xs font-medium text-zinc-400">In Bays</span>
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              {urgentTasks.length > 0 ? (
                <span className="text-red-400 font-semibold flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1 inline" /> {urgentTasks.length} High Priority
                </span>
              ) : (
                <span className="text-emerald-400">Within schedule</span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 6: Commercial Fleet Status */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('trucks')}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 hover:border-red-600/50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg cursor-pointer group"
          title="Click to view fleet & catalog"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-red-400 transition">Fleet Facility</span>
            <div className="h-8 w-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Truck className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {trucks.length > 0 ? `${trucks.length} Units` : 'Fleet Ready'}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-zinc-400">
              <span>Showroom & Workshop</span>
            </div>
          </div>
        </div>

      </div>

      {/* Workshop Bays Live Status Monitor */}
      <div className="glass-panel rounded-3xl border border-zinc-800/80 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white tracking-wide">
                Workshop Bay Status & Occupancy
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Active heavy vehicle repair bays, lift allocations, and assigned lead mechanics
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
          >
            <span>Open Job Cards Board</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bays.map((bayName, idx) => {
            const occupant = getBayOccupant(bayName);
            return (
              <div 
                key={idx}
                onClick={() => occupant && onSelectTask(occupant)}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  occupant 
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-red-500/50 cursor-pointer shadow-md hover:-translate-y-0.5' 
                    : 'bg-zinc-950/30 border-dashed border-zinc-800/80 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-zinc-300 flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${occupant ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                    <span>{bayName}</span>
                  </span>
                  {occupant ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusBadgeClass(occupant.status)}`}>
                      {occupant.status}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                      Empty / Available
                    </span>
                  )}
                </div>

                {occupant ? (
                  <div className="space-y-1.5 mt-2">
                    <p className="text-sm font-bold text-white truncate">
                      {occupant.truckModel}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-mono text-red-400 font-bold">{occupant.plate || occupant.vin?.slice(0, 10)}</span>
                      <span className="truncate max-w-[120px]">{occupant.customerName}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Tech: {occupant.assignedTech}</span>
                      <span className="text-red-400 font-semibold">{occupant.category}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-zinc-500">Ready for next commercial vehicle</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Urgent Job Cards & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Urgent & Active Workshop Tasks */}
        <div className="glass-panel rounded-3xl border border-zinc-800/80 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
                  <Wrench className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-white">Active Priority Job Cards</h3>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-bold text-zinc-400 hover:text-white flex items-center transition"
              >
                <span>View All ({tasks.length})</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="py-10 text-center rounded-2xl bg-zinc-950/40 border border-dashed border-zinc-800/80">
                  <Wrench className="h-8 w-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-zinc-400 font-medium">No active workshop job cards yet.</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Click below to open a new repair order.</p>
                </div>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="group p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-red-600/40 cursor-pointer transition flex items-start justify-between gap-3 hover:-translate-y-0.5"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-red-400">{task.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusBadgeClass(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white group-hover:text-red-400 transition truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {task.truckModel} • {task.plate} • <span className="text-zinc-300">{task.customerName}</span>
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-1">
                      <span className="text-xs text-zinc-400 block font-mono">
                        {task.actualHours || 0}/{task.estimatedHours} hrs
                      </span>
                      {!task.invoiceId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateInvoiceFromTask(task);
                          }}
                          className="text-[11px] font-bold px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 transition"
                          title="Generate Invoice for this Job"
                        >
                          + Bill
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center">
            <button
              onClick={onNewTask}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center space-x-1.5 w-full py-1.5 rounded-lg hover:bg-red-500/10 transition"
            >
              <span>+ Add New Workshop Job Card</span>
            </button>
          </div>
        </div>

        {/* Recent Invoices & Billing */}
        <div className="glass-panel rounded-3xl border border-zinc-800/80 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-400">
                  <FileText className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-white">Recent Invoices</h3>
              </div>
              <button
                onClick={() => onNavigateTab('invoices')}
                className="text-xs font-bold text-zinc-400 hover:text-white flex items-center transition"
              >
                <span>View All ({invoices.length})</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="py-10 text-center rounded-2xl bg-zinc-950/40 border border-dashed border-zinc-800/80">
                  <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-zinc-400 font-medium">No commercial invoices created yet.</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Click below to create your first invoice.</p>
                </div>
              ) : (
                invoices.slice(0, 4).map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onSelectInvoice(inv)}
                    className="group p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-red-500/40 cursor-pointer transition flex items-center justify-between gap-3 hover:-translate-y-0.5"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-red-400">{inv.invoiceNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {inv.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusBadgeClass(inv.status)}`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white group-hover:text-red-400 transition truncate">
                        {inv.customerName}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        Issued: {formatDate(inv.issueDate)} • Due: {formatDate(inv.dueDate)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-white">
                        {formatCurrency(inv.totalAmount, currency)}
                      </div>
                      {inv.balanceDue > 0 ? (
                        <span className="text-[11px] font-semibold text-amber-400 block">
                          Due: {formatCurrency(inv.balanceDue, currency)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          Settled in Full
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center">
            <button
              onClick={onNewInvoice}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center space-x-1.5 w-full py-1.5 rounded-lg hover:bg-red-500/10 transition"
            >
              <span>+ Create New Commercial Invoice</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
