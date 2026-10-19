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
  Calculator,
  Printer,
  Sparkles,
  Phone,
  Mail,
  User,
  AlertCircle,
  FileCheck,
  Layers,
  Wrench,
  Percent,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SWARAJ_MAZDA_CATALOG } from '../../data/initialData';
import DealModal from './DealModal';

const PIPELINE_STAGES = [
  { id: 'New Enquiry', label: 'New Enquiry / Leads', color: 'border-zinc-500', badgeColor: 'bg-zinc-800 text-zinc-300' },
  { id: 'Quotation Sent', label: 'Quotation & Proposal', color: 'border-blue-500', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/30' },
  { id: 'Financing Approval', label: 'Financing / Loan Sanction', color: 'border-purple-500', badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/30' },
  { id: 'Booking Confirmed', label: 'Booking Confirmed (Advance Paid)', color: 'border-red-500', badgeColor: 'bg-red-500/15 text-red-400 border border-red-500/30' },
  { id: 'Delivered / Handover', label: 'Delivered / Handover (Closed Won)', color: 'border-emerald-500', badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
];

export default function SalesManager({
  profile,
  sales = [],
  customers = [],
  trucks = [],
  onSaveDeal,
  onDeleteDeal,
  onUpdateDealStage,
  onConvertDealToInvoice,
  onNewTask
}) {
  const currency = profile?.currency || '₹';
  const [activeCrmTab, setActiveCrmTab] = useState('pipeline'); // 'pipeline' | 'quotation' | 'catalog' | 'service_crm'
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);

  // Selected Deal for Quotation Generator Preview
  const [selectedQuotationDeal, setSelectedQuotationDeal] = useState(sales[0] || null);

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
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.customerName && d.customerName.toLowerCase().includes(q)) ||
      (d.vehicleModel && d.vehicleModel.toLowerCase().includes(q)) ||
      (d.contactPerson && d.contactPerson.toLowerCase().includes(q));

    const matchesStage = stageFilter === 'All' || d.stage === stageFilter;
    const matchesType = vehicleTypeFilter === 'All' || d.vehicleType === vehicleTypeFilter;

    return matchesSearch && matchesStage && matchesType;
  });

  const handleOpenAdd = (prefillVehicle = null) => {
    if (prefillVehicle) {
      setDealToEdit({
        vehicleModel: prefillVehicle.model,
        vehicleType: prefillVehicle.type,
        unitPrice: prefillVehicle.basePrice,
        rtoAndInsurance: prefillVehicle.rtoEstimate,
        totalDealValue: prefillVehicle.basePrice + prefillVehicle.rtoEstimate,
        unitCount: 1,
        title: `${prefillVehicle.model} Deal`
      });
    } else {
      setDealToEdit(null);
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  // Mock fleet service reminders
  const serviceReminders = [
    {
      id: "REM-01",
      customer: "Nilgiris Highland Agro & Produce",
      vehicle: "Tata 407 Gold SFC (KL-72-B-4412)",
      make: "Tata Motors",
      type: "Periodic Lube Service",
      dueKm: "50,000 km (Current: 48,500 km)",
      dueDate: "Within 10 Days",
      urgency: "High",
      phone: "+91 94432 18920"
    },
    {
      id: "REM-02",
      customer: "St. Mary's Higher Secondary School",
      vehicle: "SML Isuzu S7 School Bus (TN-43-J-3304)",
      make: "Swaraj Mazda",
      type: "Nilgiris RTO Fitness Certificate (FC) Renewal",
      dueKm: "Pre-Monsoon Inspection",
      dueDate: "Expiring in 14 Days",
      urgency: "Critical",
      phone: "+91 94420 77312"
    },
    {
      id: "REM-03",
      customer: "Gudalur Express Freight Lines",
      vehicle: "Tata 709g LPT BS6 (TN-43-E-8834)",
      make: "Tata Motors",
      type: "Differential & Gearbox Oil Flushing",
      dueKm: "85,000 km (Current: 82,400 km)",
      dueDate: "Within 3 Weeks",
      urgency: "Medium",
      phone: "+91 98471 62901"
    },
    {
      id: "REM-04",
      customer: "Nilgiris Blue Mountain Travels",
      vehicle: "SML Isuzu Hiroi Luxury Coach (KL-07-BW-9922)",
      make: "Swaraj Mazda",
      type: "Air Suspension Bellow Calibration & AC Gas Refill",
      dueKm: "Seasonal Hill Station Prep",
      dueDate: "Within 5 Days",
      urgency: "High",
      phone: "+91 98485 55675"
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Commercial Vehicle Sales & CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/15 text-red-400 border border-red-600/30">
              Swaraj Mazda Dealership Hub
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Standard Commercial Vehicle CRM: Pipeline management, Dealership Quotations, Swaraj Mazda Catalog, and Fleet Service Reminders.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ New Sales Deal</span>
          </button>
        </div>
      </div>

      {/* CRM Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-800 space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCrmTab('pipeline')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeCrmTab === 'pipeline'
              ? 'border-red-600 text-white bg-zinc-900/90'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <Kanban className="h-4 w-4 text-red-500" />
          <span>Deals Pipeline ({sales.length})</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('quotation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeCrmTab === 'quotation'
              ? 'border-red-600 text-white bg-zinc-900/90'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <FileCheck className="h-4 w-4 text-red-500" />
          <span>Dealership Quotation / Proforma</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('catalog')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeCrmTab === 'catalog'
              ? 'border-red-600 text-white bg-zinc-900/90'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <Truck className="h-4 w-4 text-red-500" />
          <span>Swaraj Mazda Commercial Catalog ({SWARAJ_MAZDA_CATALOG.length} Models)</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('service_crm')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeCrmTab === 'service_crm'
              ? 'border-red-600 text-white bg-zinc-900/90'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <Wrench className="h-4 w-4 text-red-500" />
          <span>Fleet Service CRM & Reminders</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
            {serviceReminders.length}
          </span>
        </button>
      </div>

      {/* KPI Cards (Always visible across CRM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Total Sales Pipeline</span>
          <div className="text-xl font-black text-white mt-1">
            {formatCurrency(totalPipelineValue, currency)}
          </div>
          <span className="text-[11px] text-red-400 mt-1 block font-semibold">{sales.length} active opportunities</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Confirmed Bookings</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalBookingsValue, currency)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Contracted vehicle orders</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Advance Tokens Received</span>
          <div className="text-xl font-black text-red-500 mt-1">
            {formatCurrency(totalAdvanceReceived, currency)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Deposited in dealership account</span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-md">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Active Enquiries</span>
          <div className="text-xl font-black text-purple-400 mt-1">
            {activeEnquiriesCount} Deals
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">In proposal & loan sanction</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEALS PIPELINE (KANBAN & TABLE) */}
      {/* ========================================================================= */}
      {activeCrmTab === 'pipeline' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search sales deals by customer, bus/lorry model, or director..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      viewMode === 'kanban' ? 'bg-red-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Kanban className="h-3.5 w-3.5" />
                    <span>Pipeline</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      viewMode === 'table' ? 'bg-red-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                <select
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
                >
                  <option value="All">All Vehicle Types</option>
                  <option value="Lorry">Commercial Lorries</option>
                  <option value="Bus">Passenger Buses</option>
                  <option value="Tipper">Heavy Tippers</option>
                </select>

                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
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
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* KANBAN VIEW */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
              {PIPELINE_STAGES.map((col) => {
                const colDeals = filteredDeals.filter(d => d.stage === col.id);
                const colValue = colDeals.reduce((sum, d) => sum + (Number(d.totalDealValue) || 0), 0);

                return (
                  <div 
                    key={col.id} 
                    className="bg-zinc-900/80 rounded-2xl border border-zinc-800 flex flex-col max-h-[calc(100vh-250px)] shadow-lg"
                  >
                    {/* Column Header */}
                    <div className={`p-3 border-b border-zinc-800 flex flex-col border-t-4 ${col.color} rounded-t-2xl space-y-1`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white truncate max-w-[130px] uppercase">
                          {col.label.split(' ')[0]} {col.label.split(' ')[1] || ''}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {colDeals.length}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-zinc-400">
                        {formatCurrency(colValue, currency)}
                      </div>
                    </div>

                    {/* Column Cards */}
                    <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1 min-h-[140px]">
                      {colDeals.length === 0 ? (
                        <div className="text-center py-8 text-zinc-600 text-xs italic">
                          No deals in this stage
                        </div>
                      ) : (
                        colDeals.map((deal) => (
                          <div
                            key={deal.id}
                            className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 hover:border-red-600/50 shadow-md transition space-y-2.5 group relative"
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] font-mono font-bold text-red-400">
                                {deal.id}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                                {deal.vehicleType || 'Commercial'}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-white text-xs leading-snug line-clamp-1 group-hover:text-red-400 transition">
                                {deal.title || deal.vehicleModel}
                              </h4>
                              <p className="text-[11px] font-semibold text-zinc-300 mt-0.5 flex items-center space-x-1">
                                <Building2 className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                                <span className="truncate">{deal.customerName}</span>
                              </p>
                            </div>

                            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Total Deal</span>
                                <span className="font-mono font-black text-white text-xs">
                                  {formatCurrency(deal.totalDealValue, currency)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-zinc-500 block">Advance</span>
                                <span className="font-mono font-bold text-emerald-400 text-xs">
                                  {formatCurrency(deal.downpaymentReceived || 0, currency)}
                                </span>
                              </div>
                            </div>

                            {/* Card Actions */}
                            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleOpenEdit(deal)}
                                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                                  title="Edit Deal"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedQuotationDeal(deal);
                                    setActiveCrmTab('quotation');
                                  }}
                                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition"
                                  title="View Quotation"
                                >
                                  <FileText className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => onDeleteDeal && onDeleteDeal(deal.id)}
                                  className="p-1 rounded bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition"
                                  title="Delete Deal"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Stage Advancement Quick Buttons */}
                              <div className="flex items-center space-x-1">
                                {col.id !== 'New Enquiry' && (
                                  <button
                                    onClick={() => {
                                      const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === col.id);
                                      if (currentIndex > 0 && onUpdateDealStage) {
                                        onUpdateDealStage(deal.id, PIPELINE_STAGES[currentIndex - 1].id);
                                      }
                                    }}
                                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                    title="Move Backward"
                                  >
                                    <ChevronLeft className="h-3 w-3" />
                                  </button>
                                )}
                                {col.id !== 'Delivered / Handover' && (
                                  <button
                                    onClick={() => {
                                      const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === col.id);
                                      if (currentIndex < PIPELINE_STAGES.length - 1 && onUpdateDealStage) {
                                        onUpdateDealStage(deal.id, PIPELINE_STAGES[currentIndex + 1].id);
                                      }
                                    }}
                                    className="p-1 rounded bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition"
                                    title="Advance to Next Stage"
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                  </button>
                                )}
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
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Deal ID & Title</th>
                      <th className="py-3 px-4">Customer & Contact</th>
                      <th className="py-3 px-4">Swaraj Mazda Model</th>
                      <th className="py-3 px-4">Units</th>
                      <th className="py-3 px-4">Total Value</th>
                      <th className="py-3 px-4">Advance</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredDeals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono text-red-400 font-bold block">{deal.id}</span>
                          <span className="font-bold text-white text-xs">{deal.title}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{deal.customerName}</span>
                          <span className="text-[11px] text-zinc-400">{deal.contactPerson || deal.phone}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-200 font-medium">
                          {deal.vehicleModel}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {deal.unitCount || 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {formatCurrency(deal.totalDealValue, currency)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {formatCurrency(deal.downpaymentReceived || 0, currency)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {deal.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(deal)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuotationDeal(deal);
                              setActiveCrmTab('quotation');
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-red-400"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEALERSHIP QUOTATION & PROFORMA INVOICE GENERATOR */}
      {/* ========================================================================= */}
      {activeCrmTab === 'quotation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCheck className="h-5 w-5 text-red-500" />
                <span>Official Commercial Vehicle Dealership Quotation</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Generate and print institutional proforma invoice with RTO, insurance, taxes, and bank details.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs text-zinc-400 font-medium">Select Deal / Customer:</label>
              <select
                value={selectedQuotationDeal?.id || ''}
                onChange={(e) => {
                  const found = sales.find(d => d.id === e.target.value);
                  if (found) setSelectedQuotationDeal(found);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-bold focus:border-red-500"
              >
                {sales.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.id} - {d.customerName} ({d.vehicleModel.split(' ')[2] || 'SML'})
                  </option>
                ))}
              </select>

              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition"
              >
                <Printer className="h-4 w-4 text-red-400" />
                <span>Print Quotation</span>
              </button>
            </div>
          </div>

          {selectedQuotationDeal ? (
            /* Printable Quotation Document */
            <div className="bg-white text-zinc-900 rounded-3xl p-8 border border-zinc-300 shadow-2xl printable-area max-w-4xl mx-auto space-y-6">
              
              {/* Quotation Header */}
              <div className="flex justify-between items-start border-b-2 border-red-600 pb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded bg-red-100 text-red-800 font-bold text-xs uppercase mb-2">
                    Authorized Swaraj Mazda Dealership
                  </div>
                  <h1 className="text-3xl font-black tracking-wider text-black">
                    {profile.name || "INDEX MOTORS"}
                  </h1>
                  <p className="text-xs font-semibold text-zinc-600 mt-1">
                    Swaraj Mazda Commercial Buses & Lorries • Sales & Service Workshop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Pallipadi, Gudallur • Nilgiris, Tamil Nadu - 643211 • 📞 +91 8848555675
                  </p>
                  <p className="text-xs text-zinc-500">
                    GSTIN: 33AAECI9812M1Z8 • sales@indexmotors.online
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block bg-black text-white px-3 py-1 rounded-lg text-sm font-black uppercase tracking-wider">
                    Commercial Vehicle Quotation
                  </div>
                  <p className="text-xs font-mono font-bold text-zinc-700 mt-2">
                    Ref: QTN-{selectedQuotationDeal.id}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Date: {formatDate(new Date())}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Validity: 15 Days from date of issue
                  </p>
                </div>
              </div>

              {/* Customer & Financing Details */}
              <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Quotation Prepared For (Buyer):
                  </span>
                  <p className="font-black text-sm text-black">{selectedQuotationDeal.customerName}</p>
                  <p className="text-zinc-700 font-medium">Attn: {selectedQuotationDeal.contactPerson || "Fleet Manager"}</p>
                  <p className="text-zinc-600">📞 {selectedQuotationDeal.phone || "On File"}</p>
                  <p className="text-zinc-600">✉️ {selectedQuotationDeal.email || "sales@client.com"}</p>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Vehicle Proposal & Financing:
                  </span>
                  <p className="text-zinc-800">
                    <strong>Model:</strong> {selectedQuotationDeal.vehicleModel}
                  </p>
                  <p className="text-zinc-800">
                    <strong>Quantity:</strong> {selectedQuotationDeal.unitCount || 1} Commercial Unit(s)
                  </p>
                  <p className="text-zinc-800">
                    <strong>Finance Partner:</strong> {selectedQuotationDeal.financePartner || "Sundaram Finance"}
                  </p>
                  <p className="text-zinc-800">
                    <strong>Estimated Delivery:</strong> {formatDate(selectedQuotationDeal.expectedDelivery)}
                  </p>
                </div>
              </div>

              {/* Pricing Breakdown Table */}
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-white font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Item & Specification</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Unit Ex-Showroom</th>
                      <th className="py-2.5 px-4 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-800">
                    <tr>
                      <td className="py-3 px-4">
                        <strong className="text-black block text-sm">{selectedQuotationDeal.vehicleModel}</strong>
                        <span className="text-zinc-500 text-[11px]">
                          Factory built chassis with BS6 SLT4 / Isuzu Common Rail Powertrain, Power Steering, High Cargo Deck
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{selectedQuotationDeal.unitCount || 1}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {formatCurrency(selectedQuotationDeal.unitPrice, currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatCurrency((selectedQuotationDeal.unitCount || 1) * selectedQuotationDeal.unitPrice, currency)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-zinc-600">
                        Commercial RTO Road Tax & Nilgiris Green Permit Registration
                      </td>
                      <td className="py-2 px-4 text-center">-</td>
                      <td className="py-2 px-4 text-right font-mono">
                        {formatCurrency(Math.round(selectedQuotationDeal.rtoAndInsurance * 0.55), currency)}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">
                        {formatCurrency(Math.round(selectedQuotationDeal.rtoAndInsurance * 0.55), currency)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-zinc-600">
                        1-Year Bumper to Bumper Comprehensive Commercial Insurance + Third Party
                      </td>
                      <td className="py-2 px-4 text-center">-</td>
                      <td className="py-2 px-4 text-right font-mono">
                        {formatCurrency(Math.round(selectedQuotationDeal.rtoAndInsurance * 0.45), currency)}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">
                        {formatCurrency(Math.round(selectedQuotationDeal.rtoAndInsurance * 0.45), currency)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-zinc-600">
                        Commercial FASTag, Number Plates & Pre-Delivery Inspection (PDI)
                      </td>
                      <td className="py-2 px-4 text-center">-</td>
                      <td className="py-2 px-4 text-right font-mono">Included</td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">₹0.00</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-zinc-100 font-bold border-t-2 border-zinc-300">
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right text-sm uppercase text-black font-black">
                        Total On-Road Delivery Price:
                      </td>
                      <td className="py-3 px-4 text-right text-base text-red-700 font-black font-mono">
                        {formatCurrency(selectedQuotationDeal.totalDealValue, currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Dealership Bank Details & Terms */}
              <div className="grid grid-cols-2 gap-4 text-[11px] pt-4 border-t border-zinc-200">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="font-bold uppercase text-zinc-700 block">Bank Account for RTGS / NEFT / Advance:</span>
                  <p><strong>Beneficiary:</strong> {profile.accountName || "INDEX MOTORS SML SALES & SERVICE"}</p>
                  <p><strong>Bank:</strong> {profile.bankName || "State Bank of India"} • {profile.branch || "Gudallur Branch"}</p>
                  <p><strong>A/C Number:</strong> {profile.accountNumber || "389201948102"}</p>
                  <p><strong>IFSC Code:</strong> {profile.ifscCode || "SBIN0001048"}</p>
                </div>

                <div className="space-y-1 text-zinc-600">
                  <span className="font-bold uppercase text-zinc-700 block">Commercial Terms & Conditions:</span>
                  <p>1. Prices are prevailing ex-showroom at time of delivery.</p>
                  <p>2. Vehicle booking confirmed upon receipt of advance token.</p>
                  <p>3. Manufacturer warranty: 3 Years / 300,000 km by Swaraj Mazda (SML Isuzu).</p>
                  <p>4. Delivery subject to full payment / bank delivery order (DO).</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs">
                <div>
                  <div className="w-40 border-b border-zinc-400 mb-1"></div>
                  <p className="font-bold text-zinc-700">Customer Acceptance Signature</p>
                </div>
                <div className="text-right">
                  <div className="w-48 border-b border-zinc-400 mb-1"></div>
                  <p className="font-bold text-zinc-900">For INDEX MOTORS</p>
                  <p className="text-[10px] text-zinc-500">Authorized Dealership Signatory</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              No sales deals found. Create a deal first to generate an official quotation.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPLETE SWARAJ MAZDA COMMERCIAL VEHICLES CATALOG */}
      {/* ========================================================================= */}
      {activeCrmTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Truck className="h-5 w-5 text-red-500" />
                <span>Swaraj Mazda (SML Isuzu) Complete Commercial Lineup</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Official dealership catalog with specifications, GVW, engine options, payload, and direct deal creation.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-600/30">
              Commercial Lineup Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SWARAJ_MAZDA_CATALOG.map((v) => (
              <div
                key={v.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-red-600/60 transition shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white tracking-wider">
                      {v.type}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-bold">
                      {v.gvw}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mt-2 group-hover:text-red-400 transition leading-snug">
                    {v.model}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">
                    {v.category}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Payload Capacity:</span>
                      <span className="text-white font-bold">{v.payload}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Engine Spec:</span>
                      <span className="text-zinc-200 font-medium truncate max-w-[200px]" title={v.engine}>{v.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Body / Deck:</span>
                      <span className="text-zinc-200">{v.deckLength}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic pt-1">
                      💡 {v.highlights}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-zinc-400">Ex-Showroom Base:</span>
                    <span className="text-lg font-black text-red-500 font-mono">
                      {formatCurrency(v.basePrice, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAdd(v)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs border border-zinc-800 hover:border-red-600 transition flex items-center justify-center space-x-2 group-hover:bg-red-600 cursor-pointer"
                  >
                    <span>Create Sales Deal / Quotation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FLEET SERVICE CRM & MAINTENANCE REMINDERS */}
      {/* ========================================================================= */}
      {activeCrmTab === 'service_crm' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-red-500" />
                <span>Commercial Fleet Service CRM & Maintenance Tracking</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Proactive maintenance schedules for registered Tata and Swaraj Mazda commercial vehicles.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Fleet CRM Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceReminders.map((rem) => (
              <div
                key={rem.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-red-600/50 transition shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      rem.make === 'Tata Motors' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {rem.make}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{rem.vehicle.split('(')[1]?.replace(')', '') || rem.vehicle}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rem.urgency === 'Critical' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {rem.urgency} Action
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{rem.type}</h3>
                  <p className="text-xs font-semibold text-zinc-300 mt-0.5">{rem.vehicle}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center space-x-1">
                    <Building2 className="h-3 w-3 text-zinc-500" />
                    <span>{rem.customer}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Milestone / Interval:</span>
                    <span className="font-mono font-bold text-zinc-300">{rem.dueKm}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">Target Schedule:</span>
                    <span className="font-bold text-red-400">{rem.dueDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <a
                    href={`tel:${rem.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-zinc-800 transition"
                  >
                    <Phone className="h-3 w-3 text-emerald-400" />
                    <span>Call Fleet Owner</span>
                  </a>

                  <button
                    onClick={() => {
                      if (onNewTask) onNewTask();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Open Workshop Job Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Deal Creation / Edit Modal */}
      {isModalOpen && (
        <DealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSaveDeal}
          dealToEdit={dealToEdit}
          customers={customers}
          profile={profile}
        />
      )}

    </div>
  );
}
