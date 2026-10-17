import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  DollarSign, 
  Calculator, 
  User, 
  Calendar, 
  Building2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const SWARAJ_MAZDA_CATALOG = [
  { model: "Swaraj Mazda BH Series 32-Seater Passenger Bus", type: "Bus", basePrice: 2280000, rtoEstimate: 165000 },
  { model: "Swaraj Mazda Super GS Commercial Lorry", type: "Lorry", basePrice: 1650000, rtoEstimate: 145000 },
  { model: "Swaraj Mazda Mini Bus (20-Seater School Bus)", type: "Bus", basePrice: 1820000, rtoEstimate: 120000 },
  { model: "Swaraj Mazda Samrat HD 6-Wheeler Tipper Lorry", type: "Lorry", basePrice: 1780000, rtoEstimate: 155000 },
  { model: "Swaraj Mazda Sartaj 5252 XM Cargo Truck", type: "Lorry", basePrice: 1350000, rtoEstimate: 110000 },
  { model: "Swaraj Mazda Executive Luxury Tourist Coach", type: "Bus", basePrice: 2650000, rtoEstimate: 190000 },
];

export default function DealModal({
  isOpen,
  onClose,
  onSave,
  dealToEdit,
  customers = [],
  profile
}) {
  if (!isOpen) return null;

  const currency = profile?.currency || '₹';

  const [formData, setFormData] = useState({
    id: `DEAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    customerName: '',
    customerId: '',
    contactPerson: '',
    phone: '',
    email: '',
    vehicleModel: SWARAJ_MAZDA_CATALOG[0].model,
    vehicleType: SWARAJ_MAZDA_CATALOG[0].type,
    unitCount: 1,
    unitPrice: SWARAJ_MAZDA_CATALOG[0].basePrice,
    rtoAndInsurance: SWARAJ_MAZDA_CATALOG[0].rtoEstimate,
    totalDealValue: SWARAJ_MAZDA_CATALOG[0].basePrice + SWARAJ_MAZDA_CATALOG[0].rtoEstimate,
    stage: 'New Enquiry',
    financePartner: 'Sundaram Finance Commercial Vehicle Loan',
    downpaymentReceived: 0,
    expectedDelivery: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    salesExecutive: 'Arun Menon',
    probability: 50,
    notes: '',
    dateCreated: new Date().toISOString().slice(0, 10)
  });

  // EMI Calculator state
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(48);

  const calculateTotal = (units, price, rto) => {
    const u = Number(units) || 1;
    const p = Number(price) || 0;
    const r = Number(rto) || 0;
    return (u * p) + r;
  };

  useEffect(() => {
    if (dealToEdit) {
      setFormData({ ...dealToEdit });
    } else {
      const defaultVeh = SWARAJ_MAZDA_CATALOG[0];
      setFormData({
        id: `DEAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: `1x ${defaultVeh.model} Deal`,
        customerName: '',
        customerId: '',
        contactPerson: '',
        phone: '',
        email: '',
        vehicleModel: defaultVeh.model,
        vehicleType: defaultVeh.type,
        unitCount: 1,
        unitPrice: defaultVeh.basePrice,
        rtoAndInsurance: defaultVeh.rtoEstimate,
        totalDealValue: defaultVeh.basePrice + defaultVeh.rtoEstimate,
        stage: 'New Enquiry',
        financePartner: 'Sundaram Finance Commercial Vehicle Loan',
        downpaymentReceived: 0,
        expectedDelivery: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        salesExecutive: 'Arun Menon',
        probability: 50,
        notes: '',
        dateCreated: new Date().toISOString().slice(0, 10)
      });
    }
  }, [dealToEdit, isOpen]);

  const handleVehicleSelect = (e) => {
    const selectedModel = e.target.value;
    const catalogItem = SWARAJ_MAZDA_CATALOG.find(c => c.model === selectedModel);
    if (catalogItem) {
      const total = calculateTotal(formData.unitCount, catalogItem.basePrice, catalogItem.rtoEstimate);
      setFormData(prev => ({
        ...prev,
        vehicleModel: catalogItem.model,
        vehicleType: catalogItem.type,
        unitPrice: catalogItem.basePrice,
        rtoAndInsurance: catalogItem.rtoEstimate,
        totalDealValue: total,
        title: `${formData.unitCount}x ${catalogItem.model} for ${prev.customerName || 'Fleet'}`
      }));
    }
  };

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const cust = customers.find(c => c.id === custId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        contactPerson: cust.contactPerson || '',
        phone: cust.phone || '',
        email: cust.email || '',
        title: `${prev.unitCount}x ${prev.vehicleModel.split(' ')[2] || 'SML'} for ${cust.name}`
      }));
    }
  };

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const loanPrincipal = Math.max(0, formData.totalDealValue - (Number(formData.downpaymentReceived) || 0));
  const monthlyRate = (interestRate / 100) / 12;
  const emiAmount = loanPrincipal > 0 && monthlyRate > 0
    ? Math.round((loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1))
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.vehicleModel.trim()) {
      alert('Please provide customer name and vehicle model.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {dealToEdit ? `Edit Commercial Vehicle Deal: ${formData.id}` : 'Create Commercial Vehicle Sales Deal / Lead'}
              </h3>
              <p className="text-xs text-slate-400">
                Index Motors • Swaraj Mazda Sales & Finance Department
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Deal Title & Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-300">Sales Deal Title / Summary *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Pipeline Stage</label>
              <select
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-amber-400"
              >
                <option value="New Enquiry">New Enquiry / Lead</option>
                <option value="Quotation Sent">Quotation & Proposal Sent</option>
                <option value="Financing Approval">Financing / Loan Sanction</option>
                <option value="Booking Confirmed">Advance Booking Confirmed</option>
                <option value="Delivered / Handover">Delivered / Handover (Closed Won)</option>
              </select>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 uppercase tracking-wide flex items-center space-x-1.5">
                <User className="h-4 w-4" />
                <span>Buyer / Fleet Account</span>
              </span>
              <div className="flex items-center space-x-2">
                <label className="text-slate-400">Select Existing Fleet:</label>
                <select
                  value={formData.customerId || ''}
                  onChange={handleCustomerSelect}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="">-- Choose Account --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Company / Fleet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nilgiris Inter-Valley Bus Lines"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Contact Person / Decision Maker</label>
                <input
                  type="text"
                  placeholder="e.g. K. Mohanraj (Director)"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 94432 00000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Selection & Pricing */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-bold text-amber-400 uppercase tracking-wide flex items-center space-x-1.5">
              <Truck className="h-4 w-4" />
              <span>Swaraj Mazda Commercial Vehicle Selection</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400">Select Vehicle Model</label>
                <select
                  value={formData.vehicleModel}
                  onChange={handleVehicleSelect}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold"
                >
                  {SWARAJ_MAZDA_CATALOG.map(v => (
                    <option key={v.model} value={v.model}>
                      [{v.type}] {v.model} — {formatCurrency(v.basePrice, currency)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.unitCount}
                  onChange={e => {
                    const u = Number(e.target.value);
                    const total = calculateTotal(u, formData.unitPrice, formData.rtoAndInsurance);
                    setFormData({ ...formData, unitCount: u, totalDealValue: total });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Unit Price ({currency})</label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={e => {
                    const p = Number(e.target.value);
                    const total = calculateTotal(formData.unitCount, p, formData.rtoAndInsurance);
                    setFormData({ ...formData, unitPrice: p, totalDealValue: total });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
              <div className="space-y-1">
                <label className="text-slate-400">RTO, Road Tax & Insurance ({currency})</label>
                <input
                  type="number"
                  value={formData.rtoAndInsurance}
                  onChange={e => {
                    const r = Number(e.target.value);
                    const total = calculateTotal(formData.unitCount, formData.unitPrice, r);
                    setFormData({ ...formData, rtoAndInsurance: r, totalDealValue: total });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Advance Token / Downpayment ({currency})</label>
                <input
                  type="number"
                  value={formData.downpaymentReceived}
                  onChange={e => setFormData({ ...formData, downpaymentReceived: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Total On-Road Deal Value</label>
                <div className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-mono font-black text-sm">
                  {formatCurrency(formData.totalDealValue, currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Financing & EMI Calculator Module */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-1.5">
              <Calculator className="h-4 w-4" />
              <span>Commercial Vehicle Financing & EMI Estimator</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Financing Bank / NBFC</label>
                <select
                  value={formData.financePartner}
                  onChange={e => setFormData({ ...formData, financePartner: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="Sundaram Finance Commercial Vehicle Loan">Sundaram Finance</option>
                  <option value="State Bank of India (Commercial Fleet Scheme)">State Bank of India (SBI)</option>
                  <option value="Cholamandalam Investment & Finance">Cholamandalam Finance</option>
                  <option value="HDFC Bank Commercial Transport">HDFC Bank</option>
                  <option value="Canara Bank Transport Scheme">Canara Bank</option>
                  <option value="Self Funded / Direct Cash">Direct Company Purchase (No Loan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Tenure (Months)</label>
                <select
                  value={tenureMonths}
                  onChange={e => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                >
                  <option value="36">36 Months (3 Years)</option>
                  <option value="48">48 Months (4 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                </select>
              </div>
            </div>

            {/* Calculated EMI Strip */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Finance Loan Principal:</span>
                <span className="font-mono font-bold text-white text-xs">{formatCurrency(loanPrincipal, currency)}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-400 block font-bold">Estimated Monthly EMI:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formatCurrency(emiAmount, currency)} / month
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Sales Executive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Expected Delivery / Handover Date</label>
              <input
                type="date"
                value={formData.expectedDelivery}
                onChange={e => setFormData({ ...formData, expectedDelivery: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Assigned Sales Executive</label>
              <select
                value={formData.salesExecutive}
                onChange={e => setFormData({ ...formData, salesExecutive: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Arun Menon">Arun Menon (Sales Manager)</option>
                <option value="Rajesh K.">Rajesh K. (Director)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Sales Notes & Negotiation History</label>
            <textarea
              rows="2"
              placeholder="Financing status, customized body building requirements, route permits, accessories..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              {dealToEdit ? 'Save Deal Updates' : 'Create Sales Deal'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
