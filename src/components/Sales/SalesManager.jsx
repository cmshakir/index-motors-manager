import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  Trash2, 
  Building2, 
  Kanban, 
  Table as TableIcon,
  ArrowRight,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DealModal from './DealModal';

const PIPELINE_STAGES = [
  { id: 'New Enquiry', label: 'New Enquiry / Leads', color: 'border-slate-500' },
  { id: 'Quotation Sent', label: 'Quotation & Proposal', color: 'border-blue-500' },
  { id: 'Financing Approval', label: 'Financing / Loan Sanction', color: 'border-purple-500' },
  { id: 'Booking Confirmed', label: 'Booking Confirmed (Advance Paid)', color: 'border-amber-500' },
  { id: 'Delivered / Handover', label: 'Delivered / Handover (Closed Won)', color: 'border-emerald-500' },
];

export default function SalesManager({
  profile,
  sales = [],
  customers = [],
  onSaveDeal,
  onDeleteDeal,
  onUpdateDealStage,
  onConvertDealToInvoice
}) {
  const currency = profile?.currency || '₹';
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);

  // Summary Metrics
  const totalPipelineValue = sales.reduce((sum, d) => sum + (Number(d.totalDealValue) || 0), 0);
  const totalBookingsValue = sales
    .filter(d => d.stage === 'Booking Confirmed' || d.stage === 'Delivered / Handover')
    .reduce((sum, d) => sum + (Number(d.totalDealValue) || 0), 0);
  const totalAdvanceReceived = sales
    .reduce((sum, d) => sum + (Number(d.downpaymentReceived) || 0), 0);
  const activeEnquiriesCount = sales
    .filter(d => d.stage !== 'Delivered / Handover').length;

  // Filtered Deals
  const filteredDeals = sales.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      d.title.toLowerCase().includes(q) ||
      d.customerName.toLowerCase().includes(q) ||
      d.vehicleModel.toLowerCase().includes(q) ||
      (d.contactPerson && d.contactPerson.toLowerCase().includes(q));

    const matchesStage = stageFilter === 'All' || d.stage === stageFilter;
    const matchesType = vehicleTypeFilter === 'All' || d.vehicleType === vehicleTypeFilter;

    return matchesSearch && matchesStage && matchesType;
  });

  const handleOpenAdd = () => {
    setDealToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Commercial Vehicle Sales & CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Swaraj Mazda Dealership
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage passenger bus and heavy cargo lorry sales pipelines, financing sanctions, advance bookings, and customer handovers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'kanban' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ New Sales Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales Pipeline</span>
          <div className="text-xl font-black text-white mt-1">
            {formatCurrency(totalPipelineValue, currency)}
          </div>
          <span className="text-[11px] text-amber-400/90 mt-1 block font-semibold">{sales.length} active vehicle opportunities</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Bookings</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalBookingsValue, currency)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Contracted vehicle orders</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Advance Tokens Received</span>
          <div className="text-xl font-black text-blue-400 mt-1">
            {formatCurrency(totalAdvanceReceived, currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Deposited in dealership account</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Enquiries</span>
          <div className="text-xl font-black text-purple-400 mt-1">
            {activeEnquiriesCount} Deals
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">In proposal & loan sanction</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search sales deals by customer, bus/lorry model, or director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Vehicle Types</option>
              <option value="Bus">Passenger Buses</option>
              <option value="Lorry">Commercial Lorries</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Pipeline Stages</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            {(searchQuery || vehicleTypeFilter !== 'All' || stageFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVehicleTypeFilter('All');
                  setStageFilter('All');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Content: Pipeline Kanban or Table */}
      {viewMode === 'kanban' ? (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {PIPELINE_STAGES.map((col) => {
            const colDeals = filteredDeals.filter(d => d.stage === col.id);
            const colValue = colDeals.reduce((sum, d) => sum + (Number(d.totalDealValue) || 0), 0);

            return (
              <div 
                key={col.id} 
                className="bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Column Header */}
                <div className={`p-3 border-b border-slate-800 flex flex-col border-t-4 ${col.color} rounded-t-2xl space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white truncate max-w-[130px] uppercase">
                      {col.label.split(' ')[0]} {col.label.split(' ')[1] || ''}
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {colDeals.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/90 font-bold truncate">
                    {formatCurrency(colValue, currency)}
                  </span>
                </div>

                {/* Column Body / Cards List */}
                <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-[350px]">
                  {colDeals.length === 0 ? (
                    <div className="py-12 text-center text-[11px] text-slate-500">
                      No deals in this stage
                    </div>
                  ) : (
                    colDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="group bg-slate-950/90 rounded-xl border border-slate-800 hover:border-amber-500/50 p-3 space-y-2.5 cursor-pointer shadow-md transition"
                        onClick={() => handleOpenEdit(deal)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-amber-400">
                            {deal.id}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                            {deal.unitCount} Unit{deal.unitCount > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
                            {deal.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {deal.customerName}
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-slate-400">Total:</span>
                            <span className="font-bold text-white">{formatCurrency(deal.totalDealValue, currency)}</span>
                          </div>
                          {deal.downpaymentReceived > 0 && (
                            <div className="flex items-center justify-between font-mono text-[10px]">
                              <span className="text-slate-500">Advance:</span>
                              <span className="text-emerald-400 font-semibold">{formatCurrency(deal.downpaymentReceived, currency)}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400 truncate">
                          🏛️ {deal.financePartner?.split(' ')[0] || "Financed"}
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center space-x-1">
                            {deal.stage !== 'New Enquiry' && (
                              <button
                                onClick={() => {
                                  const idx = PIPELINE_STAGES.findIndex(s => s.id === deal.stage);
                                  if (idx > 0) onUpdateDealStage(deal.id, PIPELINE_STAGES[idx - 1].id);
                                }}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Move Backward"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                            )}

                            {deal.stage !== 'Delivered / Handover' && (
                              <button
                                onClick={() => {
                                  const idx = PIPELINE_STAGES.findIndex(s => s.id === deal.stage);
                                  if (idx < PIPELINE_STAGES.length - 1) onUpdateDealStage(deal.id, PIPELINE_STAGES[idx + 1].id);
                                }}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Advance Stage"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onConvertDealToInvoice(deal)}
                              className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[10px] font-bold transition flex items-center space-x-1"
                              title="Create Invoice from Deal"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Bill</span>
                            </button>
                            <button
                              onClick={() => onDeleteDeal(deal.id)}
                              className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                              title="Delete Deal"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Deal ID</th>
                  <th className="py-3 px-4">Buyer / Fleet</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4 text-center">Units</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Financing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDeals.map((deal) => (
                  <tr 
                    key={deal.id}
                    className="hover:bg-slate-850/60 transition cursor-pointer"
                    onClick={() => handleOpenEdit(deal)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {deal.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{deal.customerName}</div>
                      <div className="text-[11px] text-slate-400">{deal.contactPerson || deal.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {deal.vehicleModel}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {deal.unitCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {formatCurrency(deal.totalDealValue, currency)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-[11px] truncate max-w-xs">
                      {deal.financePartner}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onConvertDealToInvoice(deal)}
                          className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs"
                          title="Generate Sale Invoice"
                        >
                          + Invoice
                        </button>
                        <button
                          onClick={() => handleOpenEdit(deal)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDeal(deal.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveDeal}
        dealToEdit={dealToEdit}
        customers={customers}
        profile={profile}
      />

    </div>
  );
}
