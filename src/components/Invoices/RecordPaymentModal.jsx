import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function RecordPaymentModal({
  isOpen,
  onClose,
  invoice,
  profile,
  onSavePayment
}) {
  if (!isOpen || !invoice) return null;

  const currency = profile?.currency || '$';
  const [paymentAmount, setPaymentAmount] = useState(invoice.balanceDue > 0 ? invoice.balanceDue : 0);
  const [paymentMethod, setPaymentMethod] = useState('Wire / Bank Transfer');
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    const newPaymentRecord = {
      id: `pay-${Date.now()}`,
      date: paymentDate,
      amount: amount,
      method: paymentMethod,
      reference: reference.trim(),
      notes: notes.trim()
    };

    onSavePayment(invoice.id, newPaymentRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Record Invoice Payment</h3>
              <p className="text-xs text-zinc-400">Invoice: {invoice.invoiceNumber} • {invoice.customerName}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Current balance reminder */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block">Total Due:</span>
              <span className="font-mono font-bold text-white text-sm">
                {formatCurrency(invoice.totalAmount, currency)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-amber-400 block">Remaining Balance:</span>
              <span className="font-mono font-black text-amber-400 text-base">
                {formatCurrency(invoice.balanceDue, currency)}
              </span>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Payment Amount Received *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Method and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
              >
                <option value="Wire / Bank Transfer">Wire / Bank Transfer</option>
                <option value="Corporate Cheque">Corporate Cheque</option>
                <option value="Fleet Credit">Fleet Credit Account</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Cash at Workshop">Cash at Workshop</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Payment Date</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
              />
            </div>
          </div>

          {/* Reference / Cheque number */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Reference / Cheque / Transaction #</label>
            <input
              type="text"
              placeholder="e.g. WIRE-884920 or CHQ-004910"
              value={reference}
              onChange={e => setReference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Remittance Notes</label>
            <input
              type="text"
              placeholder="e.g. Received 50% deposit for truck handover"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/25 transition active:scale-95"
            >
              Save Payment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
