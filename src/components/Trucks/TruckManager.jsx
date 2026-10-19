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
  const currency = profile?.currency || '₹';
  const [searchQuery, setSearchQuery] = useState('');
  const [makeFilter, setMakeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTrucks = trucks.filter(truck => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (truck.make && truck.make.toLowerCase().includes(q)) ||
      (truck.model && truck.model.toLowerCase().includes(q)) ||
      (truck.plate && truck.plate.toLowerCase().includes(q)) ||
      (truck.vin && truck.vin.toLowerCase().includes(q)) ||
      (truck.customerName && truck.customerName.toLowerCase().includes(q));

    const matchesMake = makeFilter === 'All' || truck.make === makeFilter;
    const matchesType = typeFilter === 'All' || truck.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || truck.status === statusFilter;

    return matchesSearch && matchesMake && matchesType && matchesStatus;
  });

  const smlCount = trucks.filter(t => t.make === 'Swaraj Mazda').length;
  const tataCount = trucks.filter(t => t.make === 'Tata Motors').length;
  const dealershipCount = trucks.filter(t => t.type === 'Dealership Stock').length;
  const workshopCount = trucks.filter(t => t.type === 'Customer Truck').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Commercial Trucks & Fleet Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/15 text-red-400 border border-red-600/30">
              Commercial Fleet & Showroom
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Swaraj Mazda sales inventory (brand new & certified) and registered Tata & Swaraj Mazda customer service fleet.
          </p>
        </div>

        <button
          onClick={onNewTruck}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition active:scale-95 w-fit cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Add Commercial Truck</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Make (Swaraj Mazda / Tata), Model, VIN, or Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Make Filter */}
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-bold focus:outline-none focus:border-red-500"
            >
              <option value="All">All Makes</option>
              <option value="Swaraj Mazda">Swaraj Mazda</option>
              <option value="Tata Motors">Tata Motors</option>
            </select>

            {/* Classification Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="All">All Classifications</option>
              <option value="Dealership Stock">Dealership Sales Stock</option>
              <option value="Customer Truck">Customer Workshop Fleet</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="All">All Statuses</option>
              <option value="For Sale">For Sale (Showroom)</option>
              <option value="Reserved">Reserved</option>
              <option value="In Workshop">In Workshop (Active Service)</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
            </select>

            {(searchQuery || makeFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMakeFilter('All');
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 font-semibold"
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
            className="group bg-zinc-900 border border-zinc-800 hover:border-red-600/50 p-5 space-y-4 rounded-2xl shadow-xl transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header: Make Badge & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider ${
                    truck.make === 'Swaraj Mazda'
                      ? 'bg-red-600 text-white shadow-sm'
                      : (truck.make === 'Tata Motors' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300')
                  }`}>
                    {truck.make}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {truck.type === 'Dealership Stock' ? 'Showroom' : 'Customer Fleet'}
                  </span>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusBadgeClass(truck.status)}`}>
                  {truck.status}
                </span>
              </div>

              {/* Title & Brand */}
              <div>
                <h3 className="text-base font-black text-white group-hover:text-red-400 transition leading-snug">
                  {truck.model}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium flex items-center space-x-1">
                  <Building className="h-3 w-3 text-zinc-500" />
                  <span>{truck.customerName || "Index Motors Showroom Inventory"}</span>
                </p>
              </div>

              {/* Specs Grid */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Registration / Category:</span>
                    <span className="font-mono font-bold text-red-400 text-xs">
                      {truck.type === 'Dealership Stock' ? 'Brand New Showroom' : (truck.plate ? truck.plate : 'Customer Vehicle')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Year / Condition:</span>
                    <span className="font-mono text-zinc-200">
                      {truck.year} • {truck.type === 'Dealership Stock' ? 'Brand New' : (truck.mileage ? `${Number(truck.mileage).toLocaleString()} KM` : 'Active Fleet')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
                  <div className="truncate">
                    <strong className="text-zinc-300">Engine:</strong> {truck.engine || 'Turbo Diesel BS6'}
                  </div>
                  <div className="truncate">
                    <strong className="text-zinc-300">Body / Axle:</strong> {truck.axle || truck.bodyType || 'Commercial Cargo'}
                  </div>
                  <div className="truncate font-mono">
                    <strong className="text-zinc-300 font-sans">VIN:</strong> {truck.vin}
                  </div>
                </div>
              </div>

              {/* Dealership Sale Price (if for sale) */}
              {truck.salePrice && truck.type === 'Dealership Stock' && (
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-red-600/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Ex-Showroom Price:
                  </span>
                  <span className="text-base font-black text-red-500 font-mono">
                    {formatCurrency(truck.salePrice, currency)}
                  </span>
                </div>
              )}

              {/* Notes */}
              {truck.notes && (
                <p className="text-[11px] text-zinc-400 italic line-clamp-2">
                  "{truck.notes}"
                </p>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onCreateJobForTruck(truck)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-bold text-xs transition flex items-center space-x-1"
                  title="Create Workshop Job Card"
                >
                  <Wrench className="h-3 w-3" />
                  <span>+ Job</span>
                </button>

                <button
                  onClick={() => onCreateInvoiceForTruck(truck)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs transition flex items-center space-x-1"
                  title="Create Invoice for this Truck"
                >
                  <FileText className="h-3 w-3" />
                  <span>+ Bill</span>
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditTruck(truck)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  title="Edit Truck"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTruck(truck.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition"
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
