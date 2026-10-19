import React, { useState, useEffect } from 'react';
import { 
  X, 
  Receipt, 
  DollarSign, 
  Calendar, 
  Tag, 
  Building2, 
  CreditCard, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  Truck,
  Sparkles
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Spare Parts & Stock',
  'Consumables & Lubricants',
  'Technician Wages & Overtime',
  'Workshop Utilities & Power',
  'Showroom & Vehicle Delivery',
  'Equipment & Bay Maintenance',
  'RTO & Transport Compliance',
  'Other Dealership Overhead'
];

const PAYMENT_METHODS = [
  'Bank Transfer (NEFT/RTGS)',
  'UPI / GPay',
  'Cash',
  'Cheque',
  'Credit Card'
];

const PRESETS = [
  { title: 'Swaraj Mazda Clutch Kit & Pressure Plate', category: 'Spare Parts & Stock', payee: 'SML Isuzu Regional Parts Depot', amount: 48500 },
  { title: '15W40 Commercial Engine Oil Drum (210L)', category: 'Consumables & Lubricants', payee: 'Indian Oil Corporation Gudalur', amount: 36000 },
  { title: 'Workshop 3-Phase Electricity Bill', category: 'Workshop Utilities & Power', payee: 'TNEB Gudalur Substation', amount: 14200 },
  { title: 'Weekly Mechanic Overtime Allowance', category: 'Technician Wages & Overtime', payee: 'Workshop Mechanics Pool', amount: 12500 },
  { title: 'Diesel for Truck Test Drives & Delivery', category: 'Showroom & Vehicle Delivery', payee: 'BPCL Highway Petrol Pump', amount: 6500 },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  currency = '₹',
  currentUser,
  tasks = []
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    category: 'Spare Parts & Stock',
    amount: '',
    payee: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    referenceNo: '',
    taxIncluded: true,
    taxAmount: 0,
    status: 'Paid',
    recordedBy: currentUser?.name || 'Staff Member',
    notes: '',
    linkedTaskOrTruck: ''
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({ ...expenseToEdit });
    } else {
      setFormData({
        id: `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        category: 'Spare Parts & Stock',
        amount: '',
        payee: '',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: '',
        taxIncluded: true,
        taxAmount: 0,
        status: 'Paid',
        recordedBy: currentUser?.name || 'Staff Member',
        notes: '',
        linkedTaskOrTruck: ''
      });
    }
  }, [expenseToEdit, currentUser]);

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      payee: preset.payee,
      amount: preset.amount,
      taxAmount: Math.round(preset.amount * 0.18 / 1.18)
    }));
  };

  const handleAmountChange = (val) => {
    const num = Number(val) || 0;
    setFormData(prev => ({
      ...prev,
      amount: val,
      taxAmount: prev.taxIncluded ? Math.round(num * 0.18 / 1.18) : 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || Number(formData.amount) <= 0) {
      alert('Please provide a valid expense title and amount.');
      return;
    }

    onSave({
      ...formData,
      amount: Number(formData.amount),
      taxAmount: Number(formData.taxAmount) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {expenseToEdit ? 'Edit Expenditure Record' : 'Record Dealership / Workshop Expenditure'}
              </h3>
              <p className="text-xs text-slate-400">
                Track parts purchasing, mechanic wages, facility bills, and showroom costs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Quick 1-Click Presets */}
          {!expenseToEdit && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider">Fast Presets (Dealership Common Costs)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-700/60 text-slate-300 text-[11px] transition text-left"
                  >
                    + {p.title.split(' ')[0]} {p.title.split(' ')[1]} ({currency}{p.amount.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-300 flex items-center space-x-1">
                <span>Expense Title / Item Description</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Swaraj Mazda Clutch Kit & Pressure Plates"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center space-x-1">
                <span>Category</span>
                <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition text-xs"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount, Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center space-x-1">
                <span>Amount ({currency})</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 font-bold">{currency}</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => handleAmountChange(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Payment Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition text-xs"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payee / Vendor & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Payee / Supplier / Vendor</label>
              <input
                type="text"
                placeholder="e.g. SML Isuzu Parts Warehouse, Coimbatore"
                value={formData.payee}
                onChange={e => setFormData({ ...formData, payee: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Reference / Bill / Voucher No.</label>
              <input
                type="text"
                placeholder="e.g. INV-SML-78921 or UTR-908129"
                value={formData.referenceNo}
                onChange={e => setFormData({ ...formData, referenceNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition text-xs"
              />
            </div>
          </div>

          {/* Tax Breakdown & Link to Job Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxIncluded"
                  checked={formData.taxIncluded}
                  onChange={e => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      taxIncluded: checked,
                      taxAmount: checked ? Math.round((Number(prev.amount) || 0) * 0.18 / 1.18) : 0
                    }));
                  }}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="taxIncluded" className="text-slate-300 font-semibold cursor-pointer">
                  Includes 18% GST (Tax Deductible Input Credit)
                </label>
              </div>
              {formData.taxIncluded && (
                <p className="text-[11px] text-slate-400 pl-5">
                  Input GST Credit: <span className="font-bold text-emerald-400">{currency}{formData.taxAmount.toLocaleString('en-IN')}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Link to Workshop Job Card (Optional)</label>
              <select
                value={formData.linkedTaskOrTruck}
                onChange={e => setFormData({ ...formData, linkedTaskOrTruck: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition text-xs"
              >
                <option value="">-- General Dealership Overhead --</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.truckDetails} ({t.title.slice(0, 30)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes & Recorded By */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Notes & Internal Memo</label>
            <textarea
              rows={2}
              placeholder="e.g. Approved by Rajesh K. for emergency school bus engine rebuild."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition text-xs"
            />
          </div>

          {/* Recorded By Badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Recorded By: <strong className="text-slate-200">{formData.recordedBy}</strong></span>
            <span>ID: <code className="font-mono text-slate-400">{formData.id}</code></span>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-lg shadow-rose-600/20 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{expenseToEdit ? 'Update Expense' : 'Save Expenditure'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
