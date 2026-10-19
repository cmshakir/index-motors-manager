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
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
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

const INCOME_CATEGORIES = [
  'Workshop Service Revenue (Direct Cash)',
  'Scrap Parts & Metal Salvage',
  'Used Oil & Drum Buyback',
  'OEM Warranty Claim Credit (Swaraj Mazda)',
  'Insurance & Finance Brokerage Commission',
  'Vehicle Transport & Towing Charges',
  'Owner Capital / Partner Deposit',
  'Miscellaneous Income'
];

const PAYMENT_METHODS = [
  'Bank Transfer (NEFT/RTGS)',
  'UPI / GPay',
  'Cash',
  'Cheque',
  'Credit Card'
];

const EXPENSE_PRESETS = [
  { title: 'Swaraj Mazda Clutch Kit & Pressure Plate', category: 'Spare Parts & Stock', payee: 'SML Isuzu Regional Parts Depot', amount: 48500 },
  { title: '15W40 Commercial Engine Oil Drum (210L)', category: 'Consumables & Lubricants', payee: 'Indian Oil Corporation Gudalur', amount: 36000 },
  { title: 'Workshop 3-Phase Electricity Bill', category: 'Workshop Utilities & Power', payee: 'TNEB Gudalur Substation', amount: 14200 },
  { title: 'Weekly Mechanic Overtime Allowance', category: 'Technician Wages & Overtime', payee: 'Workshop Mechanics Pool', amount: 12500 },
  { title: 'Diesel for Truck Test Drives & Delivery', category: 'Showroom & Vehicle Delivery', payee: 'BPCL Highway Petrol Pump', amount: 6500 },
];

const INCOME_PRESETS = [
  { title: 'Worn Brake Drums & Scrap Metal Salvage', category: 'Scrap Parts & Metal Salvage', payee: 'Nilgiri Scrap Traders & Recyclers', amount: 14500 },
  { title: 'SML Isuzu Warranty Reimbursement for Turbocharger', category: 'OEM Warranty Claim Credit (Swaraj Mazda)', payee: 'SML Isuzu Regional Depot', amount: 28600 },
  { title: 'Drained Engine Oil (2 Drums) & Empty Barrels', category: 'Used Oil & Drum Buyback', payee: 'Gudalur Lubricant Recyclers', amount: 8200 },
  { title: 'Commercial Vehicle Loan Brokerage Commission', category: 'Insurance & Finance Brokerage Commission', payee: 'Cholamandalam Finance', amount: 22000 },
  { title: 'Emergency Roadside Assistance & Air Brake Check', category: 'Workshop Service Revenue (Direct Cash)', payee: 'Private Transport Bus Driver', amount: 1500 },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  defaultType = 'expense', // 'income' or 'expense'
  currency = '₹',
  currentUser,
  tasks = []
}) {
  if (!isOpen) return null;

  const [type, setType] = useState(() => {
    if (expenseToEdit) return expenseToEdit.type || 'expense';
    return defaultType;
  });

  const [formData, setFormData] = useState({
    id: `${defaultType === 'income' ? 'INC' : 'EXP'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type: defaultType,
    title: '',
    category: defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    amount: '',
    payee: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    referenceNo: '',
    taxIncluded: defaultType === 'expense',
    taxAmount: 0,
    status: defaultType === 'income' ? 'Received' : 'Paid',
    recordedBy: currentUser?.name || 'Staff Member',
    notes: '',
    linkedTaskOrTruck: ''
  });

  useEffect(() => {
    if (expenseToEdit) {
      const editType = expenseToEdit.type || 'expense';
      setType(editType);
      setFormData({
        ...expenseToEdit,
        type: editType
      });
    } else {
      setType(defaultType);
      setFormData({
        id: `${defaultType === 'income' ? 'INC' : 'EXP'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        type: defaultType,
        title: '',
        category: defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        amount: '',
        payee: '',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: '',
        taxIncluded: defaultType === 'expense',
        taxAmount: 0,
        status: defaultType === 'income' ? 'Received' : 'Paid',
        recordedBy: currentUser?.name || 'Staff Member',
        notes: '',
        linkedTaskOrTruck: ''
      });
    }
  }, [expenseToEdit, defaultType, currentUser]);

  const handleTypeSwitch = (newType) => {
    setType(newType);
    setFormData(prev => ({
      ...prev,
      type: newType,
      id: `${newType === 'income' ? 'INC' : 'EXP'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      status: newType === 'income' ? 'Received' : 'Paid'
    }));
  };

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      payee: preset.payee,
      amount: preset.amount,
      taxAmount: prev.taxIncluded ? Math.round(preset.amount * 0.18 / 1.18) : 0
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
      alert('Please provide a valid transaction title and amount.');
      return;
    }

    onSave({
      ...formData,
      type,
      amount: Number(formData.amount),
      taxAmount: Number(formData.taxAmount) || 0
    });
    onClose();
  };

  const isIncome = type === 'income';
  const activeCategories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const activePresets = isIncome ? INCOME_PRESETS : EXPENSE_PRESETS;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              isIncome 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isIncome ? <ArrowUpRight className="h-5 w-5 stroke-[2.5]" /> : <ArrowDownRight className="h-5 w-5 stroke-[2.5]" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {expenseToEdit 
                  ? `Edit ${isIncome ? 'Income' : 'Expenditure'} Voucher` 
                  : `Record Dealership ${isIncome ? 'Income (Inflow)' : 'Expenditure (Outflow)'}`}
              </h3>
              <p className="text-xs text-zinc-400">
                {isIncome 
                  ? 'Track scrap sales, OEM warranty refunds, loan commissions & direct service cash'
                  : 'Track parts stock purchases, mechanic wages, facility bills & delivery fuel'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Income vs Expense Segment Selector */}
          <div className="p-1 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-1 text-center font-bold">
            <button
              type="button"
              onClick={() => handleTypeSwitch('income')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition ${
                isIncome 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>+ Record Income (Money In)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSwitch('expense')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition ${
                !isIncome 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>- Record Expense (Money Out)</span>
            </button>
          </div>

          {/* Quick 1-Click Presets */}
          {!expenseToEdit && (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-zinc-300 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[11px] uppercase tracking-wider">
                  Fast {isIncome ? 'Income' : 'Expense'} Presets
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] transition text-left ${
                      isIncome 
                        ? 'bg-zinc-900 border-zinc-800 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40' 
                        : 'bg-zinc-900 border-zinc-800 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40'
                    }`}
                  >
                    + {p.title.slice(0, 28)}... ({currency}{p.amount.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-zinc-300 flex items-center space-x-1">
                <span>{isIncome ? 'Income Title / Source' : 'Expense Title / Description'}</span>
                <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder={isIncome ? 'e.g. Worn Brake Drums Scrap Sale' : 'e.g. Swaraj Mazda Clutch Kit & Plates'}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none transition text-xs ${
                  isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 flex items-center space-x-1">
                <span>Category</span>
                <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>*</span>
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none transition text-xs ${
                  isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500'
                }`}
              >
                {activeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount, Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 flex items-center space-x-1">
                <span>Amount ({currency})</span>
                <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>*</span>
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold ${
                  isIncome ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isIncome ? '+' : '-'} {currency}
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => handleAmountChange(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-sm focus:outline-none transition ${
                    isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Transaction Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 transition text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Payment Mode</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 transition text-xs"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payee / Received From & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">
                {isIncome ? 'Received From (Customer / Vendor / Source)' : 'Paid To (Supplier / Payee / Vendor)'}
              </label>
              <input
                type="text"
                placeholder={isIncome ? 'e.g. Nilgiri Scrap Recyclers or Chola Finance' : 'e.g. SML Isuzu Regional Parts Depot'}
                value={formData.payee}
                onChange={e => setFormData({ ...formData, payee: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Voucher / Receipt / Ref No.</label>
              <input
                type="text"
                placeholder="e.g. REC-8921 or UTR-902189"
                value={formData.referenceNo}
                onChange={e => setFormData({ ...formData, referenceNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition text-xs"
              />
            </div>
          </div>

          {/* Tax Breakdown & Link to Job Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
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
                  className="rounded bg-zinc-950 border-zinc-700 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="taxIncluded" className="text-zinc-300 font-semibold cursor-pointer">
                  {isIncome ? 'Subject to 18% GST Output' : 'Includes 18% GST Input Credit'}
                </label>
              </div>
              {formData.taxIncluded && (
                <p className="text-[11px] text-zinc-400 pl-5">
                  18% GST Portion: <strong className="text-white">{currency}{formData.taxAmount.toLocaleString('en-IN')}</strong>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Link to Workshop Job / Vehicle (Optional)</label>
              <select
                value={formData.linkedTaskOrTruck}
                onChange={e => setFormData({ ...formData, linkedTaskOrTruck: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 transition text-xs"
              >
                <option value="">-- General Dealership Balance --</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.truckDetails} ({t.title.slice(0, 25)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes & Recorded By */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Notes / Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Approved and recorded in cash book by dealership accounts."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition text-xs"
            />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
            <span>Recorded By: <strong className="text-zinc-200">{formData.recordedBy}</strong></span>
            <span>Ref: <code className="font-mono text-zinc-400">{formData.id}</code></span>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-white font-bold transition shadow-lg flex items-center space-x-1.5 ${
                isIncome 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25' 
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {expenseToEdit 
                  ? `Update ${isIncome ? 'Income' : 'Expense'}` 
                  : `Save ${isIncome ? 'Income Inflow' : 'Expense Outflow'}`}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
