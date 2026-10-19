import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Wrench, 
  Truck, 
  Building2, 
  Calendar, 
  CreditCard, 
  Trash2, 
  Edit3, 
  Tag, 
  FileText,
  PieChart,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CATEGORIES = [
  'All',
  'Spare Parts & Stock',
  'Consumables & Lubricants',
  'Technician Wages & Overtime',
  'Workshop Utilities & Power',
  'Showroom & Vehicle Delivery',
  'Equipment & Bay Maintenance',
  'RTO & Transport Compliance',
  'Other Dealership Overhead'
];

export default function ExpenseManager({
  expenses = [],
  invoices = [],
  currency = '₹',
  onNewExpense,
  onEditExpense,
  onDeleteExpense
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // all, this_month, last_30_days

  // Calculate Financial P&L
  const totalRevenueCollected = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  }, [invoices]);

  const totalExpensesAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [expenses]);

  const netOperatingProfit = totalRevenueCollected - totalExpensesAmount;
  const profitMarginPercent = totalRevenueCollected > 0 
    ? Math.round((netOperatingProfit / totalRevenueCollected) * 100) 
    : 0;

  // Category Breakdown Totals
  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other Dealership Overhead';
      totals[cat] = (totals[cat] || 0) + (Number(exp.amount) || 0);
    });
    return totals;
  }, [expenses]);

  // Filtered list
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = 
        exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.linkedTaskOrTruck?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
      const matchesPayment = selectedPaymentMethod === 'All' || exp.paymentMethod === selectedPaymentMethod;

      if (!matchesSearch || !matchesCategory || !matchesPayment) return false;

      if (dateFilter === 'this_month') {
        const expMonth = new Date(exp.date).getMonth();
        const curMonth = new Date().getMonth();
        return expMonth === curMonth;
      } else if (dateFilter === 'last_30_days') {
        const expTime = new Date(exp.date).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 86400000;
        return expTime >= thirtyDaysAgo;
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, searchTerm, selectedCategory, selectedPaymentMethod, dateFilter]);

  const exportCSV = () => {
    const headers = ["ID,Date,Category,Title,Payee,Amount,Payment Method,Reference No,Tax Included,Recorded By\n"];
    const rows = filteredExpenses.map(e => 
      `"${e.id}","${e.date}","${e.category}","${e.title.replace(/"/g, '""')}","${(e.payee || '').replace(/"/g, '""')}",${e.amount},"${e.paymentMethod}","${e.referenceNo || ''}",${e.taxIncluded ? 'Yes' : 'No'},"${e.recordedBy || ''}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `index-motors-expenses-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Spare Parts & Stock':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Consumables & Lubricants':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Technician Wages & Overtime':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Workshop Utilities & Power':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Showroom & Vehicle Delivery':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Equipment & Bay Maintenance':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'RTO & Transport Compliance':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Expenditure & Workshop Cost Manager
              </h1>
              <p className="text-xs text-slate-400">
                Track parts stock purchases, technician wages, utility bills, and calculate net dealership profit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
            title="Export filtered expenditures to CSV spreadsheet"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewExpense}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/25 transition transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Record Expense</span>
          </button>
        </div>
      </div>

      {/* Financial P&L (Profit & Loss) Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Dealership Net Profit Indicator */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dealership Net Operating Profit
            </span>
            <div className={`p-1.5 rounded-lg ${netOperatingProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {netOperatingProfit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </div>

          <div className="my-3">
            <div className={`text-2xl sm:text-3xl font-black ${netOperatingProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netOperatingProfit, currency)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${netOperatingProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {profitMarginPercent}% Operating Margin
              </span>
              <span className="text-[11px] text-slate-400">Revenue minus all expenses</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Collections</span>
              <span className="font-bold text-white">{formatCurrency(totalRevenueCollected, currency)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Total Expenditures</span>
              <span className="font-bold text-rose-400">{formatCurrency(totalExpensesAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Major Cost Drivers */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Top Expenditure Categories
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {expenses.length} Total Vouchers Recorded
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">Spare Parts Stock</span>
              <span className="text-base font-black text-white">
                {formatCurrency(categoryTotals['Spare Parts & Stock'] || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">OEM SML Isuzu components</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Oils & Fluids</span>
              <span className="text-base font-black text-white">
                {formatCurrency(categoryTotals['Consumables & Lubricants'] || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Engine oil & grease drums</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-purple-400 block">Mechanic Wages</span>
              <span className="text-base font-black text-white">
                {formatCurrency(categoryTotals['Technician Wages & Overtime'] || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Overtime & labor payouts</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Utilities & Power</span>
              <span className="text-base font-black text-white">
                {formatCurrency(categoryTotals['Workshop Utilities & Power'] || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">TNEB power & compressor</span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search expenses by title, payee, voucher no, or job ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedPaymentMethod}
              onChange={e => setSelectedPaymentMethod(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 transition"
            >
              <option value="All">All Payment Modes</option>
              <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer</option>
              <option value="UPI / GPay">UPI / GPay</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Credit Card">Credit Card</option>
            </select>

            {/* Date filter */}
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 transition"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Month</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>
          </div>

        </div>

        {/* Category Filter Pills (Horizontal Scrollable) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {filteredExpenses.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Receipt className="h-12 w-12 mx-auto text-slate-700 stroke-[1.5]" />
            <p className="text-sm font-semibold">No expenditure records found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or record a new expense for parts stock, wages, or utilities.
            </p>
            <button
              onClick={onNewExpense}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition mt-2 inline-flex items-center space-x-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Record First Expense</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Item & Payee</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4 text-right">Amount ({currency})</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {exp.date}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getCategoryColor(exp.category)}`}>
                        {exp.category}
                      </span>
                    </td>

                    {/* Title & Payee */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                        {exp.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {exp.payee && <span>To: <strong>{exp.payee}</strong></span>}
                        {exp.linkedTaskOrTruck && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono text-[10px]">
                            {exp.linkedTaskOrTruck}
                          </span>
                        )}
                        {exp.recordedBy && <span>• By {exp.recordedBy.split(' ')[0]}</span>}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium text-[11px]">
                        {exp.paymentMethod}
                      </span>
                    </td>

                    {/* Reference / Voucher */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {exp.referenceNo || '—'}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="text-sm font-black text-rose-400">
                        {formatCurrency(exp.amount, currency)}
                      </div>
                      {exp.taxIncluded && exp.taxAmount > 0 && (
                        <div className="text-[10px] text-emerald-400 font-medium">
                          GST incl: {formatCurrency(exp.taxAmount, currency)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                          title="Edit expense"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 transition"
                          title="Delete expense"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Showing <strong>{filteredExpenses.length}</strong> of <strong>{expenses.length}</strong> expenses
          </span>
          <div className="flex items-center space-x-4">
            <span>
              Filtered Total Outflow: <strong className="text-rose-400 text-sm font-black">
                {formatCurrency(filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0), currency)}
              </strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
