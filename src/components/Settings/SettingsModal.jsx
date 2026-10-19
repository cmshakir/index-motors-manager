import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Building2, 
  DollarSign, 
  Percent, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Cloud 
} from 'lucide-react';
import { exportAllDataJSON, importAllDataJSON, resetToDefaults } from '../../utils/storage';
import { supabase } from '../../utils/supabaseClient';

export default function SettingsModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetData,
  onOpenCloudModal,
  isCloudConnected
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({ ...profile });
  const [importStatus, setImportStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleExport = () => {
    exportAllDataJSON();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importAllDataJSON(event.target.result);
      if (result.success) {
        setImportStatus({ success: true, message: 'Database successfully restored!' });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setImportStatus({ success: false, message: `Failed to restore: ${result.error}` });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to clear all operational data (jobs, invoices, sales, expenses, trucks, customers) to start completely fresh? Company profile and staff logins will be preserved.')) {
      const cleanState = resetToDefaults();
      onResetData(cleanState);

      // Clear from Supabase Cloud as well
      if (isCloudConnected && supabase) {
        try {
          const tables = ['tasks', 'invoices', 'sales', 'expenses', 'trucks', 'customers'];
          await Promise.allSettled(tables.map(t => supabase.from(t).delete().neq('id', '___NON_EXISTENT___')));
        } catch (e) {
          console.warn('Could not clear all cloud tables:', e);
        }
      }

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-500">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Dealership & Workshop Settings</h3>
              <p className="text-xs text-zinc-400">Configure profile, labor rates, and manage database backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Dealership Info */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <Building2 className="h-4 w-4 text-red-500" />
              <span>Dealership Profile & Legal Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Sub-Title / Tagline</label>
                <input
                  type="text"
                  value={formData.subTitle}
                  onChange={e => setFormData({ ...formData, subTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-zinc-300">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">City, Region, Postal Code</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Tax ID / TIN</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Billing & Rates */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Workshop Rates & Invoice Currency</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Hourly Labor Rate ($/hr)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.hourlyLaborRate}
                  onChange={e => setFormData({ ...formData, hourlyLaborRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono font-bold text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Default Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.defaultTaxRate}
                  onChange={e => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Remittance Bank Info */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <span>Remittance Bank Details (Printed on Invoices)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Beneficiary Account Name</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Account / IBAN Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">SWIFT / BIC Code</label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={e => setFormData({ ...formData, swiftCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Cloud Database & Multi-Device Sync */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
                <Cloud className="h-4 w-4 text-red-500" />
                <span>Cloud Database & Multi-Device Sync</span>
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isCloudConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isCloudConnected ? 'Cloud Active' : 'Offline / Local'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-200">Supabase Cloud PostgreSQL Connection</p>
                <p className="text-zinc-400 text-[11px]">Sync workshop jobs, invoices & truck deals across mobile and computer.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCloudModal) onOpenCloudModal();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-md shadow-red-600/20"
              >
                <Cloud className="h-3.5 w-3.5" />
                <span>Configure Cloud Sync</span>
              </button>
            </div>
          </div>

          {/* Backup & Restore Data */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <h4 className="font-black text-white uppercase tracking-wider text-xs">
              Database Backup & Recovery
            </h4>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-zinc-200">Export All System Data</p>
                  <p className="text-zinc-400 text-[11px]">Download complete JSON backup of jobs, invoices, trucks, and fleets.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold border border-zinc-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-zinc-200">Restore from JSON</p>
                  <p className="text-zinc-400 text-[11px]">Upload a previously saved Index Motors backup file.</p>
                </div>
                <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-400 font-bold border border-blue-500/30 cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Restore Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                  importStatus.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {importStatus.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-red-400">Clear All Records (Fresh Start)</p>
                  <p className="text-zinc-400 text-[11px]">Erase all sample jobs, invoices, sales, expenses, and trucks from cloud & local storage to start fresh.</p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500 hover:text-white text-red-400 font-bold border border-red-500/30 transition active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All Data (Fresh Start)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Save */}
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
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-600/25"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
