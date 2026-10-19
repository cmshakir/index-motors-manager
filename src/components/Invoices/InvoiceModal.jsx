import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Truck, 
  User, 
  DollarSign, 
  Percent, 
  CreditCard,
  Layers,
  Wrench
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function InvoiceModal({
  isOpen,
  onClose,
  onSave,
  invoiceToEdit,
  prefilledTask,
  trucks = [],
  customers = [],
  profile
}) {
  if (!isOpen) return null;

  const currency = profile?.currency || '$';
  const defaultTax = profile?.defaultTaxRate || 8.5;
  const defaultLaborRate = profile?.hourlyLaborRate || 110;

  const [formData, setFormData] = useState({
    id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'Workshop Service',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    paymentTerms: 'Net 15 Days',
    status: 'Pending',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    billingAddress: '',
    taxId: '',
    truckId: '',
    truckDetails: '',
    mileage: '',
    jobCardId: null,
    items: [
      { id: 'i-1', type: 'Labor', description: 'Workshop Diagnostics & Mechanical Labor', qty: 2, unitPrice: defaultLaborRate, taxPercent: defaultTax, total: 2 * defaultLaborRate }
    ],
    discountPercent: 0,
    discountAmount: 0,
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    balanceDue: 0,
    paymentMethod: 'Bank Transfer',
    notes: 'Payment due per contract terms. Thank you for choosing Index Motors commercial fleet services.',
    paymentHistory: []
  });

  // Calculate totals
  const recalculateTotals = (data) => {
    const subtotal = data.items.reduce((sum, item) => {
      const lineTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
      return sum + lineTotal;
    }, 0);

    const discPercent = Number(data.discountPercent) || 0;
    const discountAmount = (subtotal * discPercent) / 100;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Calculate tax
    let taxAmount = 0;
    data.items.forEach(item => {
      const lineTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
      const itemTaxPercent = item.taxPercent !== undefined ? Number(item.taxPercent) : defaultTax;
      // Proportional discount reduction for tax
      const itemRatio = subtotal > 0 ? lineTotal / subtotal : 0;
      const discountedItemTotal = lineTotal - (discountAmount * itemRatio);
      taxAmount += (discountedItemTotal * itemTaxPercent) / 100;
    });

    const totalAmount = discountedSubtotal + taxAmount;
    const paid = Number(data.paidAmount) || 0;
    const balanceDue = Math.max(0, totalAmount - paid);

    let status = data.status;
    if (paid >= totalAmount && totalAmount > 0) {
      status = 'Paid';
    } else if (paid > 0 && paid < totalAmount) {
      status = 'Partially Paid';
    }

    return {
      ...data,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      balanceDue,
      status
    };
  };

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData(recalculateTotals({ ...invoiceToEdit }));
    } else if (prefilledTask) {
      // Pre-fill from Workshop Job Card!
      const taskLaborHours = prefilledTask.actualHours > 0 ? prefilledTask.actualHours : prefilledTask.estimatedHours;
      const laborItem = {
        id: `i-labor-${Date.now()}`,
        type: 'Labor',
        description: `Workshop Labor: ${prefilledTask.title} (${taskLaborHours} hrs by ${prefilledTask.assignedTech})`,
        qty: taskLaborHours,
        unitPrice: defaultLaborRate,
        taxPercent: defaultTax,
        total: taskLaborHours * defaultLaborRate
      };

      const partsItems = (prefilledTask.parts || []).map((p, idx) => ({
        id: `i-part-${idx}-${Date.now()}`,
        type: 'Part',
        description: `${p.name} (#${p.partNo})`,
        qty: p.qty,
        unitPrice: p.unitPrice,
        taxPercent: defaultTax,
        total: p.qty * p.unitPrice
      }));

      const newItems = [laborItem, ...partsItems];

      const initial = {
        id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Workshop Service',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        paymentTerms: 'Net 15 Days',
        status: 'Pending',
        customerId: prefilledTask.customerId || '',
        customerName: prefilledTask.customerName || '',
        customerEmail: '',
        customerPhone: '',
        billingAddress: '',
        taxId: '',
        truckId: prefilledTask.truckId || '',
        truckDetails: `${prefilledTask.truckModel} (Plate: ${prefilledTask.plate || 'N/A'} / VIN: ${prefilledTask.vin || 'N/A'})`,
        mileage: prefilledTask.currentMileage || '',
        jobCardId: prefilledTask.id,
        items: newItems.length > 0 ? newItems : [{ id: 'i-1', type: 'Labor', description: 'Labor & Services', qty: 1, unitPrice: 100, taxPercent: defaultTax, total: 100 }],
        discountPercent: 0,
        discountAmount: 0,
        paidAmount: 0,
        paymentMethod: 'Bank Transfer',
        notes: `Work performed under Job Card ${prefilledTask.id}. Genuine parts & labor covered under 90-day warranty.`,
        paymentHistory: []
      };

      // Auto fill customer details if match found
      if (prefilledTask.customerId) {
        const found = customers.find(c => c.id === prefilledTask.customerId);
        if (found) {
          initial.customerEmail = found.email;
          initial.customerPhone = found.phone;
          initial.billingAddress = found.address;
          initial.taxId = found.taxId;
        }
      }

      setFormData(recalculateTotals(initial));
    } else {
      // Default empty invoice
      const initial = {
        id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Workshop Service',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        paymentTerms: 'Net 15 Days',
        status: 'Pending',
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        billingAddress: '',
        taxId: '',
        truckId: '',
        truckDetails: '',
        mileage: '',
        jobCardId: null,
        items: [
          { id: `i-${Date.now()}`, type: 'Labor', description: 'Workshop Diagnostics & Mechanical Labor', qty: 2, unitPrice: defaultLaborRate, taxPercent: defaultTax, total: 2 * defaultLaborRate }
        ],
        discountPercent: 0,
        discountAmount: 0,
        paidAmount: 0,
        paymentMethod: 'Bank Transfer',
        notes: 'Payment due per contract terms. Thank you for choosing Index Motors commercial fleet services.',
        paymentHistory: []
      };
      setFormData(recalculateTotals(initial));
    }
  }, [invoiceToEdit, prefilledTask, isOpen]);

  // Customer Select
  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    if (!custId) {
      setFormData(prev => ({ ...prev, customerId: '' }));
      return;
    }
    const cust = customers.find(c => c.id === custId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        customerEmail: cust.email || '',
        customerPhone: cust.phone || '',
        billingAddress: cust.address || '',
        taxId: cust.taxId || '',
      }));
    }
  };

  // Truck Select
  const handleTruckChange = (e) => {
    const trkId = e.target.value;
    if (!trkId) return;
    const trk = trucks.find(t => t.id === trkId);
    if (trk) {
      const details = `${trk.make} ${trk.model} (Plate: ${trk.plate || 'Unreg'} / VIN: ${trk.vin})`;
      let updatedItems = [...formData.items];

      // If Dealership Sale invoice and vehicle has salePrice, auto-suggest line item
      if (formData.type === 'Truck Sale (Dealership)' && trk.salePrice) {
        updatedItems = [
          {
            id: `v-${Date.now()}`,
            type: 'Vehicle',
            description: `Commercial Truck: ${trk.make} ${trk.model} (${trk.engine || 'Euro 6'}, VIN: ${trk.vin})`,
            qty: 1,
            unitPrice: trk.salePrice,
            taxPercent: 5.0,
            total: trk.salePrice
          },
          {
            id: `pdi-${Date.now()}`,
            type: 'Service',
            description: `Dealership PDI, Roadworthiness Certification & Transport Preparation`,
            qty: 1,
            unitPrice: 1500,
            taxPercent: 5.0,
            total: 1500
          }
        ];
      }

      setFormData(prev => recalculateTotals({
        ...prev,
        truckId: trk.id,
        truckDetails: details,
        mileage: trk.mileage || prev.mileage,
        items: updatedItems
      }));
    }
  };

  // Line Item Handlers
  const handleAddItem = (type = 'Part') => {
    const newItem = {
      id: `i-${Date.now()}-${Math.random()}`,
      type: type,
      description: type === 'Labor' ? 'Labor: Technician Hours' : type === 'Vehicle' ? 'Commercial Truck Chassis' : 'Spare Part / Material',
      qty: 1,
      unitPrice: type === 'Labor' ? defaultLaborRate : 100,
      taxPercent: defaultTax,
      total: type === 'Labor' ? defaultLaborRate : 100
    };
    setFormData(prev => recalculateTotals({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    const qty = Number(updated[index].qty) || 0;
    const unitPrice = Number(updated[index].unitPrice) || 0;
    updated[index].total = qty * unitPrice;
    setFormData(prev => recalculateTotals({ ...prev, items: updated }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => recalculateTotals({ ...prev, items: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert('Please specify a customer or fleet account.');
      return;
    }
    const finalData = recalculateTotals(formData);
    onSave(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {invoiceToEdit ? `Edit Invoice: ${formData.invoiceNumber}` : 'Create Commercial Invoice'}
              </h3>
              <p className="text-xs text-slate-400">
                Index Motors Dealership & Workshop Accounts Billing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Top Row: Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Invoice Number *</label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold text-blue-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Invoice Type</label>
              <select
                value={formData.type}
                onChange={e => {
                  const newType = e.target.value;
                  setFormData(prev => ({ ...prev, type: newType }));
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
              >
                <option value="Workshop Service">Workshop Service & Repairs</option>
                <option value="Truck Sale (Dealership)">Truck Sale (Dealership)</option>
                <option value="Parts Counter Sale">Parts Counter Sale</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Issue Date</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          {/* Customer & Fleet Details */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wide">
                <User className="h-4 w-4" />
                <span>Customer & Billing Information</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-xs text-slate-400">Select Customer:</label>
                <select
                  value={formData.customerId || ''}
                  onChange={handleCustomerChange}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="">-- Choose Existing Fleet --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-slate-400">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Continental Haulage"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="billing@company.com"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-xs text-slate-400">Billing Address</label>
                <input
                  type="text"
                  placeholder="Street Address, City, Postal Code"
                  value={formData.billingAddress}
                  onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Tax / VAT ID</label>
                <input
                  type="text"
                  placeholder="TAX-XXX-12345"
                  value={formData.taxId}
                  onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Truck Information */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-500 uppercase tracking-wide">
                <Truck className="h-4 w-4" />
                <span>Vehicle / Truck Linked</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-xs text-slate-400">Attach Vehicle:</label>
                <select
                  value={formData.truckId || ''}
                  onChange={handleTruckChange}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="">-- Select Truck from Inventory --</option>
                  {trucks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.make} {t.model} ({t.type === 'Dealership Stock' ? 'Showroom' : t.plate || t.vin})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-400">Truck Specs / VIN / Plate</label>
                <input
                  type="text"
                  placeholder="e.g. Volvo FH16 750 (Plate: APX-8821 / VIN: YV2RT40A5NA819201)"
                  value={formData.truckDetails}
                  onChange={e => setFormData({ ...formData, truckDetails: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Odometer Reading (KM)</label>
                <input
                  type="number"
                  placeholder="e.g. 215400"
                  value={formData.mileage}
                  onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="h-4 w-4 text-blue-400" />
                <span>Line Items ({formData.items.length})</span>
              </label>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleAddItem('Labor')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-red-400 border border-slate-700"
                >
                  + Labor
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('Part')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-slate-700"
                >
                  + Part
                </button>
                {formData.type === 'Truck Sale (Dealership)' && (
                  <button
                    type="button"
                    onClick={() => handleAddItem('Vehicle')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-400 border border-slate-700"
                  >
                    + Vehicle
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleAddItem('Service')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-400 border border-slate-700"
                >
                  + Fee / Service
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-3 w-28">Type</th>
                    <th className="py-2.5 px-3">Description / Part Details</th>
                    <th className="py-2.5 px-3 w-20 text-center">Qty / Hrs</th>
                    <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 w-20 text-center">Tax %</th>
                    <th className="py-2.5 px-3 w-28 text-right">Line Total</th>
                    <th className="py-2.5 px-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                  {formData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-2 px-3">
                        <select
                          value={item.type}
                          onChange={e => handleUpdateItem(idx, 'type', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-white"
                        >
                          <option value="Labor">Labor</option>
                          <option value="Part">Part</option>
                          <option value="Vehicle">Vehicle</option>
                          <option value="Service">Service</option>
                          <option value="Fee">Fee</option>
                        </select>
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => handleUpdateItem(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={item.qty}
                          onChange={e => handleUpdateItem(idx, 'qty', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white text-center font-mono"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={e => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white text-right font-mono"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.taxPercent}
                          onChange={e => handleUpdateItem(idx, 'taxPercent', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white text-center font-mono"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-white whitespace-nowrap">
                        {formatCurrency(item.total, currency)}
                      </td>

                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={formData.items.length <= 1}
                          className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Calculations & Remittance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Notes & Payment Terms */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15 Days">Net 15 Days (Standard Fleet Credit)</option>
                  <option value="Net 30 Days">Net 30 Days (Corporate Fleet)</option>
                  <option value="50% Advance, Balance on Delivery">50% Advance, Balance on Delivery</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Bank Transfer">Wire / Bank Transfer (ACH/SWIFT)</option>
                  <option value="Corporate Cheque">Corporate Cheque</option>
                  <option value="Fleet Credit">Fleet Credit Account</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash at Counter</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Invoice Remarks & Warranty</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600"
                />
              </div>
            </div>

            {/* Calculations Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-white">{formatCurrency(formData.subtotal, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <span>Fleet Discount:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.discountPercent}
                    onChange={e => {
                      const disc = Number(e.target.value);
                      setFormData(prev => recalculateTotals({ ...prev, discountPercent: disc }));
                    }}
                    className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs text-center text-white"
                  />
                  <span>%</span>
                </div>
                <span className="font-mono text-red-400">-{formatCurrency(formData.discountAmount, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Estimated Sales Tax / VAT:</span>
                <span className="font-mono text-white">{formatCurrency(formData.taxAmount, currency)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-black text-white">
                <span>Grand Total:</span>
                <span className="text-lg font-mono text-blue-400">{formatCurrency(formData.totalAmount, currency)}</span>
              </div>

              {/* Paid Amount */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span>Amount Paid / Deposit:</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400">{currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.paidAmount}
                    onChange={e => {
                      const paid = Number(e.target.value);
                      setFormData(prev => recalculateTotals({ ...prev, paidAmount: paid }));
                    }}
                    className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-right font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-black">
                <span className="text-amber-400">Balance Due:</span>
                <span className="text-lg font-mono text-amber-400 font-black">
                  {formatCurrency(formData.balanceDue, currency)}
                </span>
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition active:scale-95"
          >
            {invoiceToEdit ? 'Save Invoice Changes' : 'Generate & Issue Invoice'}
          </button>
        </div>

      </div>
    </div>
  );
}
