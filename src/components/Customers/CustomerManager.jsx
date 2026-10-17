import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  DollarSign, 
  CreditCard, 
  Edit3, 
  Trash2, 
  X,
  Building2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerManager({
  profile,
  customers = [],
  trucks = [],
  invoices = [],
  onSaveCustomer,
  onDeleteCustomer,
  onCreateJobForCustomer,
  onCreateInvoiceForCustomer
}) {
  const currency = profile?.currency || '$';
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const [formData, setFormData] = useState({
    id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    creditLimit: 50000,
    fleetCount: 5,
    totalSpent: 0
  });

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.taxId && c.taxId.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setFormData({
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      creditLimit: 50000,
      fleetCount: 5,
      totalSpent: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setCustomerToEdit(cust);
    setFormData({ ...cust });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSaveCustomer(formData);
    setIsModalOpen(false);
  };

  const getCustomerOutstanding = (customerId) => {
    return invoices
      .filter(i => i.customerId === customerId)
      .reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);
  };

  const getCustomerTrucksCount = (customerId) => {
    return trucks.filter(t => t.customerId === customerId).length;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Fleet Customers & Transport Accounts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Commercial logistics companies, freight carriers, bulk haulers, and registered fleet maintenance accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 w-fit"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Add Fleet Account</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search fleet accounts by company, contact director, tax ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          const outstanding = getCustomerOutstanding(cust.id);
          const registeredTrucks = getCustomerTrucksCount(cust.id);

          return (
            <div 
              key={cust.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">{cust.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{cust.contactPerson || 'Fleet Director'}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {cust.id}
                  </span>
                </div>

                {/* Contact info */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  {cust.email && (
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {cust.phone && (
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                  {cust.address && (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{cust.address}</span>
                    </div>
                  )}
                  {cust.taxId && (
                    <div className="text-[11px] text-slate-500 pt-1 font-mono">
                      Tax/TIN: {cust.taxId}
                    </div>
                  )}
                </div>

                {/* Financial & Fleet stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Registered Trucks:</span>
                    <span className="font-bold text-white text-sm flex items-center space-x-1 mt-0.5">
                      <Truck className="h-3.5 w-3.5 text-amber-400" />
                      <span>{registeredTrucks || cust.fleetCount || 0} Units</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Credit Limit:</span>
                    <span className="font-bold text-slate-300 text-sm font-mono mt-0.5 block">
                      {formatCurrency(cust.creditLimit, currency)}
                    </span>
                  </div>
                </div>

                {/* Balance status */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Receivable Balance:</span>
                  <span className={`font-mono font-bold ${outstanding > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatCurrency(outstanding, currency)}
                  </span>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onCreateJobForCustomer(cust)}
                    className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition"
                  >
                    + Job Card
                  </button>
                  <button
                    onClick={() => onCreateInvoiceForCustomer(cust)}
                    className="px-2.5 py-1 rounded bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition"
                  >
                    + Invoice
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(cust)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(cust.id)}
                    className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {customerToEdit ? 'Edit Fleet Account' : 'Register Fleet Account'}
                  </h3>
                  <p className="text-xs text-slate-400">Index Motors Commercial Customer</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Company / Fleet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Continental Haulage"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Fleet Director / Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Robert Sterling (Fleet Director)"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="fleet@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Corporate Billing Address</label>
                <input
                  type="text"
                  placeholder="Terminal, Street, City"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Tax / TIN ID</label>
                  <input
                    type="text"
                    placeholder="TAX-XXX-0000"
                    value={formData.taxId}
                    onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
