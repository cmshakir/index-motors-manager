import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Truck, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function InvoicePrintModal({
  isOpen,
  onClose,
  invoice,
  profile,
  onRecordPayment
}) {
  if (!isOpen || !invoice) return null;

  const currency = profile?.currency || '$';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-black text-blue-400">
              {invoice.invoiceNumber}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${getStatusBadgeClass(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.balanceDue > 0 && onRecordPayment && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>Record Payment</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-950/40">
          
          {/* THE OFFICIAL PRINTABLE INVOICE SHEET (White paper style on print) */}
          <div className="printable-area bg-white text-slate-900 rounded-xl p-8 sm:p-10 shadow-2xl mx-auto max-w-3xl border border-slate-200">
            
            {/* Header: Company Info + Invoice Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
              
              {/* Left: Dealership Branding */}
              <div className="space-y-1 max-w-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-red-600/30">
                    <Truck className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-wider text-slate-950">
                      {profile.name || "INDEX MOTORS"}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                      {profile.subTitle || "Swaraj Mazda Sales & Service - Buses & Lorries"}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                  {profile.address}<br />
                  {profile.city}, {profile.country}<br />
                  Phone: {profile.phone}<br />
                  Email: {profile.email} • {profile.website}
                </p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  GSTIN / Tax ID: <strong>{profile.taxId}</strong>
                </div>
              </div>

              {/* Right: Invoice Meta */}
              <div className="text-right sm:text-right space-y-1">
                <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-sm font-black rounded">
                  OFFICIAL COMMERCIAL INVOICE
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-2">
                  #{invoice.invoiceNumber}
                </div>
                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  <p>Issue Date: <strong>{formatDate(invoice.issueDate)}</strong></p>
                  <p>Due Date: <strong>{formatDate(invoice.dueDate)}</strong></p>
                  <p>Terms: <strong>{invoice.paymentTerms || "Net 15"}</strong></p>
                  <p>Type: <strong>{invoice.type}</strong></p>
                </div>
              </div>

            </div>

            {/* Bill To & Vehicle Spec Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
              
              {/* Customer Info */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2">
                  Billed To / Fleet Account:
                </h3>
                <div className="text-sm font-black text-slate-900">{invoice.customerName}</div>
                {invoice.taxId && (
                  <p className="text-slate-600 font-mono text-[11px] mt-0.5">Tax ID: {invoice.taxId}</p>
                )}
                {invoice.billingAddress && (
                  <p className="text-slate-600 mt-1">{invoice.billingAddress}</p>
                )}
                <div className="mt-2 text-slate-600 space-y-0.5">
                  {invoice.customerPhone && <p>Phone: {invoice.customerPhone}</p>}
                  {invoice.customerEmail && <p>Email: {invoice.customerEmail}</p>}
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2 flex items-center justify-between">
                  <span>Commercial Vehicle Identified:</span>
                  <Truck className="h-3.5 w-3.5 text-slate-400" />
                </h3>
                <div className="text-sm font-black text-slate-900">
                  {invoice.truckDetails || "General Workshop Parts / Service"}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Odometer:</span>
                    <span className="font-semibold text-slate-800">
                      {invoice.mileage ? `${Number(invoice.mileage).toLocaleString()} KM` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Job Reference:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {invoice.jobCardId || 'Direct Invoice'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Line Items Table */}
            <div className="my-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-800 uppercase text-[10px] tracking-wider font-black">
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-2 w-20 text-center">Category</th>
                    <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-24 text-right">Rate</th>
                    <th className="py-2.5 px-3 w-16 text-center">Tax %</th>
                    <th className="py-2.5 px-3 w-28 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-2.5 px-2 text-center text-[10px] font-bold text-slate-600 uppercase">
                        {item.type}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{item.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(item.unitPrice, currency)}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{item.taxPercent || 0}%</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.total, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Bank Remittance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-4 border-t-2 border-slate-900 text-xs">
              
              {/* Left: Remittance Bank Instructions */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-600 mb-1">
                    Direct Remittance Bank Details:
                  </h4>
                  <div className="space-y-0.5 text-[11px] text-slate-700">
                    <p>Bank: <strong>{profile.bankName}</strong> ({profile.branch || "Gudallur Branch"})</p>
                    <p>Beneficiary: <strong>{profile.accountName}</strong></p>
                    <p>Account #: <strong className="font-mono">{profile.accountNumber}</strong></p>
                    <p>IFSC Code: <strong className="font-mono">{profile.ifscCode || profile.swiftCode}</strong></p>
                  </div>
                </div>

                {invoice.notes && (
                  <p className="text-[11px] text-slate-500 italic leading-snug">
                    <strong>Notice:</strong> {invoice.notes}
                  </p>
                )}
              </div>

              {/* Right: Totals Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between py-1 text-slate-600 border-b border-slate-200">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(invoice.subtotal, currency)}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600 border-b border-slate-200">
                    <span>Discount ({invoice.discountPercent}%):</span>
                    <span className="font-mono">-{formatCurrency(invoice.discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 text-slate-600 border-b border-slate-200">
                  <span>Estimated Tax / VAT:</span>
                  <span className="font-mono text-slate-900">{formatCurrency(invoice.taxAmount, currency)}</span>
                </div>

                <div className="flex justify-between py-2 text-base font-black text-slate-950 border-b-2 border-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatCurrency(invoice.totalAmount, currency)}</span>
                </div>

                <div className="flex justify-between py-1 text-emerald-700 border-b border-slate-200">
                  <span>Amount Settled / Deposit:</span>
                  <span className="font-mono font-bold">{formatCurrency(invoice.paidAmount || 0, currency)}</span>
                </div>

                <div className="flex justify-between py-2 text-sm font-black bg-red-50 px-3 rounded border border-red-200 text-red-950">
                  <span>Balance Due:</span>
                  <span className="font-mono font-black">{formatCurrency(invoice.balanceDue, currency)}</span>
                </div>
              </div>

            </div>

            {/* Payment History Log (if any payments recorded) */}
            {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
              <div className="my-4 pt-3 border-t border-slate-200 text-xs">
                <h4 className="font-bold text-[10px] uppercase text-slate-500 mb-1.5">
                  Recorded Payments & Settlements:
                </h4>
                <div className="space-y-1">
                  {invoice.paymentHistory.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-600 py-1 bg-slate-50 px-2.5 rounded">
                      <span>{formatDate(p.date)} • {p.method} ({p.reference || 'No Ref'})</span>
                      <span className="font-mono font-bold text-emerald-700">{formatCurrency(p.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Terms & Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="h-12 border-b border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="font-bold text-slate-800">Authorized Dealership Signatory</p>
                <p className="text-[10px] text-slate-500">{profile.name} Accounts Division</p>
              </div>

              <div>
                <div className="h-12 border-b border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="font-bold text-slate-800">Customer Fleet Authorization</p>
                <p className="text-[10px] text-slate-500">Received & Approved</p>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-slate-400">
              {profile.termsAndConditions?.split('\n')[0] || "All genuine parts carry manufacturer warranty. Invoices payable per agreed fleet credit terms."}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
