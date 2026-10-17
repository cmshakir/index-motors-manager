import React from 'react';
import { 
  X, 
  Wrench, 
  Printer, 
  Edit3, 
  FileText, 
  Truck, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  Layers
} from 'lucide-react';
import { formatCurrency, formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  profile,
  onEdit,
  onToggleChecklistItem,
  onGenerateInvoice
}) {
  if (!isOpen || !task) return null;

  const currency = profile?.currency || '$';
  const hourlyRate = profile?.hourlyLaborRate || 110;
  
  const partsCost = task.parts ? task.parts.reduce((sum, p) => sum + (p.qty * p.unitPrice), 0) : 0;
  const laborHours = task.actualHours > 0 ? task.actualHours : task.estimatedHours;
  const laborCost = laborHours * hourlyRate;
  const estimatedTotal = partsCost + laborCost;

  const completedChecks = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
  const totalChecks = task.checklist ? task.checklist.length : 0;
  const checkProgress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  const handlePrintJobCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="no-print px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              {task.id}
            </span>
            <div>
              <h3 className="text-base font-black text-white">Workshop Job Card & Work Order</h3>
              <p className="text-xs text-slate-400">{profile.name} Technical Service Department</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintJobCard}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Print Work Order"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Edit Job Card"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable & Visible Job Card Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 printable-area text-slate-200">
          
          {/* Job Card Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white">{task.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Category: {task.category}</span>
                <span>•</span>
                <span>Bay: <strong className="text-amber-400">{task.bay}</strong></span>
                <span>•</span>
                <span>Lead Tech: <strong className="text-slate-200">{task.assignedTech}</strong></span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2.5 py-1 rounded font-bold ${getPriorityBadgeClass(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className={`text-xs px-2.5 py-1 rounded font-bold ${getStatusBadgeClass(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>

          {/* Truck & Customer Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <Truck className="h-4 w-4" />
                <span>Vehicle Specifications</span>
              </div>
              <div className="text-sm font-bold text-white">{task.truckModel}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[11px]">Plate / Registration:</span>
                  <span className="font-mono text-amber-300 font-semibold">{task.plate || "Unregistered"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Odometer:</span>
                  <span>{task.currentMileage ? `${Number(task.currentMileage).toLocaleString()} KM` : '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">VIN / Chassis #:</span>
                  <span className="font-mono text-xs text-slate-300">{task.vin || '—'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wide">
                <User className="h-4 w-4" />
                <span>Customer / Fleet Account</span>
              </div>
              <div className="text-sm font-bold text-white">{task.customerName || "Counter Client"}</div>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="text-slate-500">Date Logged:</span> {formatDate(task.dateReceived)}</p>
                <p><span className="text-slate-500">Target Delivery:</span> {formatDate(task.targetDate)}</p>
                <p>
                  <span className="text-slate-500">Invoice Status:</span>{' '}
                  {task.invoiceId ? (
                    <span className="font-bold text-emerald-400">Linked to {task.invoiceId}</span>
                  ) : (
                    <span className="font-medium text-amber-400">Pending Billing</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic & Service Description */}
          {task.description && (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Findings & Service Scope
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>
          )}

          {/* Checklist Progress */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Safety Inspection & Step Checklist ({completedChecks}/{totalChecks})</span>
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {checkProgress}% Complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${checkProgress}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {task.checklist.map((item, idx) => (
                  <label 
                    key={item.id || idx}
                    className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => onToggleChecklistItem(task.id, idx)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 bg-slate-900 cursor-pointer"
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                      {item.task}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Parts Used Table */}
          {task.parts && task.parts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-amber-400" />
                <span>Commercial Spare Parts & Replaced Components</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Part #</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                    {task.parts.map((p, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-mono text-amber-400">{p.partNo}</td>
                        <td className="py-2.5 px-3 font-medium text-white">{p.name}</td>
                        <td className="py-2.5 px-3 text-center">{p.qty}</td>
                        <td className="py-2.5 px-3 text-right">{formatCurrency(p.unitPrice, currency)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-white">
                          {formatCurrency(p.qty * p.unitPrice, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Workshop Financial & Hours Estimate Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Labor Hours</span>
              <span className="text-lg font-black text-white font-mono">
                {task.actualHours || 0} / {task.estimatedHours} hrs
              </span>
              <span className="text-[11px] text-slate-500 block">@ {formatCurrency(hourlyRate, currency)}/hr</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Parts Subtotal</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {formatCurrency(partsCost, currency)}
              </span>
              <span className="text-[11px] text-slate-500 block">{task.parts?.length || 0} line items</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Est. Job Total</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {formatCurrency(estimatedTotal, currency)}
              </span>
              <span className="text-[11px] text-slate-500 block">Excl. applicable sales tax</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="no-print px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div>
            {!task.invoiceId ? (
              <button
                onClick={() => {
                  onClose();
                  onGenerateInvoice(task);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition active:scale-95"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Workshop Invoice</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Invoice Created ({task.invoiceId})</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Edit Details
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
