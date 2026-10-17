import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  FileText, 
  Edit3, 
  Trash2, 
  Tag, 
  CheckCircle2, 
  Gauge, 
  Building
} from 'lucide-react';
import { formatCurrency, getStatusBadgeClass } from '../../utils/formatters';

export default function TruckManager({
  profile,
  trucks = [],
  onNewTruck,
  onEditTruck,
  onDeleteTruck,
  onCreateJobForTruck,
  onCreateInvoiceForTruck
}) {
  const currency = profile?.currency || '$';
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTrucks = trucks.filter(truck => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      truck.make.toLowerCase().includes(q) ||
      truck.model.toLowerCase().includes(q) ||
      (truck.plate && truck.plate.toLowerCase().includes(q)) ||
      (truck.vin && truck.vin.toLowerCase().includes(q)) ||
      (truck.customerName && truck.customerName.toLowerCase().includes(q));

    const matchesType = typeFilter === 'All' || truck.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || truck.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const dealershipCount = trucks.filter(t => t.type === 'Dealership Stock').length;
  const workshopCount = trucks.filter(t => t.type === 'Customer Truck').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Commercial Trucks & Fleet Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {trucks.length} Units
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dealership sales inventory (new & certified pre-owned) and registered customer fleet vehicles.
          </p>
        </div>

        <button
          onClick={onNewTruck}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 w-fit"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Add Commercial Truck</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search trucks by Make, Model, Plate, VIN, or Fleet Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Classifications ({trucks.length})</option>
              <option value="Dealership Stock">Dealership Stock ({dealershipCount})</option>
              <option value="Customer Truck">Customer Fleet ({workshopCount})</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="For Sale">For Sale (Showroom)</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="In Workshop">In Workshop</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
            </select>

            {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrucks.map((truck) => (
          <div 
            key={truck.id}
            className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 space-y-4 shadow-xl transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header: Type Badge & Status */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  truck.type === 'Dealership Stock' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                }`}>
                  {truck.type}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusBadgeClass(truck.status)}`}>
                  {truck.status}
                </span>
              </div>

              {/* Title & Brand */}
              <div>
                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
                  {truck.year} {truck.make} {truck.model}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {truck.customerName || "Index Motors Showroom"}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Plate / Reg:</span>
                    <span className="font-mono font-bold text-amber-400 text-[11px]">
                      {truck.plate || "Unregistered"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Odometer:</span>
                    <span className="font-mono text-slate-200">
                      {truck.mileage ? `${Number(truck.mileage).toLocaleString()} KM` : '—'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                  <div className="truncate">
                    <strong className="text-slate-300">Engine:</strong> {truck.engine || 'Euro 6 Diesel'}
                  </div>
                  <div className="truncate">
                    <strong className="text-slate-300">Axle Config:</strong> {truck.axle || '6x4 Heavy Tractor'}
                  </div>
                  <div className="truncate font-mono">
                    <strong className="text-slate-300 font-sans">VIN:</strong> {truck.vin}
                  </div>
                </div>
              </div>

              {/* Dealership Sale Price (if for sale) */}
              {truck.salePrice && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    Dealership Price:
                  </span>
                  <span className="text-base font-black text-emerald-300 font-mono">
                    {formatCurrency(truck.salePrice, currency)}
                  </span>
                </div>
              )}

              {/* Notes */}
              {truck.notes && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2">
                  "{truck.notes}"
                </p>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onCreateJobForTruck(truck)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition flex items-center space-x-1"
                  title="Create Workshop Job Card"
                >
                  <Wrench className="h-3 w-3" />
                  <span>+ Job</span>
                </button>

                <button
                  onClick={() => onCreateInvoiceForTruck(truck)}
                  className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs transition flex items-center space-x-1"
                  title="Create Invoice for this Truck"
                >
                  <FileText className="h-3 w-3" />
                  <span>+ Bill</span>
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditTruck(truck)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Edit Truck"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTruck(truck.id)}
                  className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                  title="Delete Truck"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
