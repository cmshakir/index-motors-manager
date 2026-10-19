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
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseManager({
  expenses = [],
  invoices = [],
  currency = '₹',
  onNewExpense,
  onNewIncome,
  onEditExpense,
  onDeleteExpense
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // all, this_month, last_30_days

  // Separate incomes & expenses
  const directIncomes = useMemo(() => {
    return expenses.filter(e => e.type === 'income');
  }, [expenses]);

  const directExpenses = useMemo(() => {
    return expenses.filter(e => !e.type || e.type === 'expense');
  }, [expenses]);

  // Invoice collections
  const invoiceCollections = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  }, [invoices]);

  const totalDirectIncome = useMemo(() => {
    return directIncomes.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);
  }, [directIncomes]);

  const totalAllIncome = invoiceCollections + totalDirectIncome;

  const totalDirectExpenses = useMemo(() => {
    return directExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [directExpenses]);

  const netCashProfit = totalAllIncome - totalDirectExpenses;
  const marginPercent = totalAllIncome > 0 
    ? Math.round((netCashProfit / totalAllIncome) * 100) 
    : 0;

  // Filtered List
  const filteredRecords = useMemo(() => {
    return expenses.filter(record => {
      const isIncome = record.type === 'income';

      // Type filter
      if (typeFilter === 'income' && !isIncome) return false;
      if (typeFilter === 'expense' && isIncome) return false;

      // Search filter
      const matchesSearch = 
        record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.linkedTaskOrTruck?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || record.category === selectedCategory;
      const matchesPayment = selectedPaymentMethod === 'All' || record.paymentMethod === selectedPaymentMethod;

      if (!matchesSearch || !matchesCategory || !matchesPayment) return false;

      if (dateFilter === 'this_month') {
        const expMonth = new Date(record.date).getMonth();
        const curMonth = new Date().getMonth();
        return expMonth === curMonth;
      } else if (dateFilter === 'last_30_days') {
        const expTime = new Date(record.date).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 86400000;
        return expTime >= thirtyDaysAgo;
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, typeFilter, searchTerm, selectedCategory, selectedPaymentMethod, dateFilter]);

  // Categories present in dataset
  const availableCategories = useMemo(() => {
    const cats = new Set();
    expenses.forEach(e => {
      if (e.category) cats.add(e.category);
    });
    return ['All', ...Array.from(cats)];
  }, [expenses]);

  const exportCSV = () => {
    const headers = ["ID,Type,Date,Category,Title,Payee/Source,Amount,Payment Method,Reference No,Tax Included,Recorded By\n"];
    const rows = filteredRecords.map(e => 
      `"${e.id}","${e.type || 'expense'}","${e.date}","${e.category}","${e.title.replace(/"/g, '""')}","${(e.payee || '').replace(/"/g, '""')}",${e.amount},"${e.paymentMethod}","${e.referenceNo || ''}",${e.taxIncluded ? 'Yes' : 'No'},"${e.recordedBy || ''}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `index-motors-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Fast Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600/20 to-zinc-900 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Wallet className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Income & Expenditure Manager (Cash Book)
              </h1>
              <p className="text-xs text-zinc-400">
                Record miscellaneous income inflows, parts stock purchases, technician wages, and monitor net profit
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition"
            title="Download CSV financial ledger"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Income Button */}
          <button
            onClick={onNewIncome}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add Income</span>
          </button>

          {/* Add Expense Button */}
          <button
            onClick={onNewExpense}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/25 transition transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* P&L Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Total Inflows (Income) */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Inflows (Revenue & Income)
            </span>
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(totalAllIncome, currency)}
            </div>
            <div className="mt-1 flex items-center text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold mr-1.5">
                +{formatCurrency(totalDirectIncome, currency)} Direct Incomes
              </span>
              <span>• {formatCurrency(invoiceCollections, currency)} Invoices</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{directIncomes.length} Direct Inflows Recorded</span>
            <span className="text-emerald-400 font-bold">Money In</span>
          </div>
        </div>

        {/* Card 2: Total Outflows (Expenses) */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 hover:border-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Outflows (Expenditures)
            </span>
            <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400">
              <ArrowDownRight className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
              {formatCurrency(totalDirectExpenses, currency)}
            </div>
            <div className="mt-1 flex items-center text-xs text-zinc-400">
              <span>Parts stock, mechanic wages & facility bills</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{directExpenses.length} Expense Vouchers</span>
            <span className="text-rose-400 font-bold">Money Out</span>
          </div>
        </div>

        {/* Card 3: Net Cash Balance / Operating Profit */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Net Operating Profit / Cash Balance
            </span>
            <div className={`p-1.5 rounded-xl ${netCashProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {netCashProfit >= 0 ? <TrendingUp className="h-5 w-5 stroke-[2.5]" /> : <TrendingDown className="h-5 w-5 stroke-[2.5]" />}
            </div>
          </div>
          <div className="my-3">
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${netCashProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netCashProfit, currency)}
            </div>
            <div className="mt-1 flex items-center space-x-2 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md ${netCashProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {marginPercent}% Margin
              </span>
              <span className="text-zinc-400">All Inflows minus Outflows</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Index Motors Cash Position</span>
            <span className={netCashProfit >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {netCashProfit >= 0 ? 'Profitable' : 'Deficit'}
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        
        {/* Row 1: Search + Payment Mode + Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title, source, payee, ref no, or job card..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Payment Method Filter */}
            <select
              value={selectedPaymentMethod}
              onChange={e => setSelectedPaymentMethod(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-red-500 transition"
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
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-red-500 transition"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Month</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>
          </div>

        </div>

        {/* Row 2: Type Filter Tabs (All / Income / Expense) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
          
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                typeFilter === 'all' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Transactions ({expenses.length})
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1 transition ${
                typeFilter === 'income' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Incomes ({directIncomes.length})</span>
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1 transition ${
                typeFilter === 'expense' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-rose-400'
              }`}
            >
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Expenses ({directExpenses.length})</span>
            </button>
          </div>

          {/* Category Dropdown if many categories */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-zinc-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:outline-none"
            >
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 space-y-3">
            <Receipt className="h-12 w-12 mx-auto text-zinc-700 stroke-[1.5]" />
            <p className="text-sm font-semibold">No transactions match your criteria</p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={onNewIncome}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Income</span>
              </button>
              <button
                onClick={onNewExpense}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Expense</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description & Source / Payee</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Ref / Receipt</th>
                  <th className="py-3 px-4 text-right">Amount ({currency})</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredRecords.map((item) => {
                  const isIncome = item.type === 'income';
                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors group">
                      
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300 whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 border ${
                          isIncome 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        }`}>
                          {isIncome ? <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> : <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />}
                          <span>{isIncome ? 'Income' : 'Expense'}</span>
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-300 font-medium">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px]">
                          {item.category}
                        </span>
                      </td>

                      {/* Description & Payee */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className={`font-bold text-xs transition-colors ${
                          isIncome ? 'text-white group-hover:text-emerald-400' : 'text-white group-hover:text-rose-400'
                        }`}>
                          {item.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          {item.payee && (
                            <span>{isIncome ? 'From:' : 'To:'} <strong>{item.payee}</strong></span>
                          )}
                          {item.linkedTaskOrTruck && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-red-400 font-mono text-[10px]">
                              {item.linkedTaskOrTruck}
                            </span>
                          )}
                          {item.recordedBy && <span>• By {item.recordedBy.split(' ')[0]}</span>}
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-zinc-300 text-[11px]">
                          {item.paymentMethod}
                        </span>
                      </td>

                      {/* Reference No */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap text-[11px]">
                        {item.referenceNo || '—'}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className={`text-sm font-black ${
                          isIncome ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isIncome ? '+' : '-'} {formatCurrency(item.amount, currency)}
                        </div>
                        {item.taxIncluded && item.taxAmount > 0 && (
                          <div className="text-[10px] text-zinc-400">
                            18% GST: {formatCurrency(item.taxAmount, currency)}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onEditExpense(item)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                            title="Edit transaction"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(item.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 transition"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary Bar */}
        <div className="px-4 py-3 bg-zinc-950/80 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <span>
            Showing <strong>{filteredRecords.length}</strong> transactions
          </span>
          <div className="flex items-center space-x-4">
            <span>
              Net Filtered Flow: <strong className={`text-sm font-black ${
                filteredRecords.reduce((s, r) => s + (r.type === 'income' ? Number(r.amount) : -Number(r.amount)), 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}>
                {formatCurrency(filteredRecords.reduce((s, r) => s + (r.type === 'income' ? Number(r.amount) : -Number(r.amount)), 0), currency)}
              </strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
