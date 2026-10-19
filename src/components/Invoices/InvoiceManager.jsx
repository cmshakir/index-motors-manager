import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronRight, 
  Truck,
  ArrowDownCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function InvoiceManager({
  profile,
  invoices = [],
  onNewInvoice,
  onEditInvoice,
  onViewInvoice,
  onDeleteInvoice,
  onRecordPayment
}) {
  const currency = profile?.currency || '$';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (Number(inv.balanceDue) || 0), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  // Filtered
  const filteredInvoices = invoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      (inv.truckDetails && inv.truckDetails.toLowerCase().includes(q)) ||
      (inv.taxId && inv.taxId.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesType = typeFilter === 'All' || inv.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Invoices & Fleet Billing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
              {filteredInvoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Commercial truck sales contracts, workshop repair billing, parts counter sales, and payment settlements.
          </p>
        </div>

        <button
          onClick={onNewInvoice}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/25 transition active:scale-95 w-fit"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Create Invoice</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Total Invoiced</span>
          <div className="text-xl font-black text-white mt-1">
            {formatCurrency(totalInvoiced, currency)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">{invoices.length} invoices generated</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Collected Payments</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalCollected, currency)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Deposited to bank</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Outstanding Balance</span>
          <div className="text-xl font-black text-amber-400 mt-1">
            {formatCurrency(totalOutstanding, currency)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Receivable across fleets</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Overdue Invoices</span>
          <div className={`text-xl font-black mt-1 ${overdueCount > 0 ? 'text-red-400' : 'text-zinc-300'}`}>
            {overdueCount} Accounts
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Requiring immediate follow-up</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Invoice #, Fleet Customer, Truck VIN, or Tax ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="All">All Invoice Types</option>
              <option value="Workshop Service">Workshop Service</option>
              <option value="Truck Sale (Dealership)">Truck Sale (Dealership)</option>
              <option value="Parts Counter Sale">Parts Counter Sale</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid in Full</option>
              <option value="Pending">Pending / Sent</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </select>

            {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer & Fleet</th>
                <th className="py-3.5 px-4">Type & Vehicle</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-zinc-500">
                    No commercial invoices match your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-zinc-850/60 transition cursor-pointer"
                    onClick={() => onViewInvoice(inv)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 text-xs whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{inv.customerName}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                        {inv.customerPhone || inv.customerEmail || "Corporate Fleet"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-zinc-200">{inv.type}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs font-mono">
                        {inv.truckDetails || "—"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-zinc-300 whitespace-nowrap">
                      <div>Issued: <span className="text-zinc-400">{formatDate(inv.issueDate)}</span></div>
                      <div>Due: <span className="font-semibold text-zinc-200">{formatDate(inv.dueDate)}</span></div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-xs whitespace-nowrap">
                      {formatCurrency(inv.totalAmount, currency)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                      {inv.balanceDue > 0 ? (
                        <span className="font-bold text-amber-400">
                          {formatCurrency(inv.balanceDue, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">
                          $0.00 (Settled)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold ${getStatusBadgeClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => onRecordPayment(inv)}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-bold transition flex items-center space-x-1"
                            title="Record Payment"
                          >
                            <DollarSign className="h-3 w-3" />
                            <span>Pay</span>
                          </button>
                        )}
                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                          title="Print / View Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditInvoice(inv)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                          title="Edit Invoice"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
