import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Monitor
} from 'lucide-react';
import { 
  getCloudCredentials, 
  saveCloudCredentials, 
  clearCloudCredentials, 
  testCloudConnection 
} from '../../utils/supabaseClient';

const SUPABASE_SCHEMA_SQL = `-- INDEX MOTORS: SUPABASE POSTGRESQL SCHEMA (ALL 9 TABLES)
CREATE TABLE IF NOT EXISTS public.tasks (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.invoices (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.sales (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.expenses (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.trucks (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.customers (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.technicians (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.users (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.profile (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now());

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on tasks" ON public.tasks;
CREATE POLICY "Allow all on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on invoices" ON public.invoices;
CREATE POLICY "Allow all on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on sales" ON public.sales;
CREATE POLICY "Allow all on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on expenses" ON public.expenses;
CREATE POLICY "Allow all on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on trucks" ON public.trucks;
CREATE POLICY "Allow all on trucks" ON public.trucks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on customers" ON public.customers;
CREATE POLICY "Allow all on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on technicians" ON public.technicians;
CREATE POLICY "Allow all on technicians" ON public.technicians FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on users" ON public.users;
CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on profile" ON public.profile;
CREATE POLICY "Allow all on profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.tasks, 
      public.invoices, 
      public.sales, 
      public.expenses, 
      public.trucks, 
      public.customers, 
      public.technicians, 
      public.users, 
      public.profile;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;`;

const EXPENSES_ONLY_SQL = `-- INDEX MOTORS: QUICK FIX TO CREATE MISSING EXPENSES & INCOMES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on expenses" ON public.expenses;
CREATE POLICY "Allow all on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;`;

export default function CloudConnectModal({
  isOpen,
  onClose,
  isCloudConnected,
  onConnected
}) {
  if (!isOpen) return null;

  const currentCreds = getCloudCredentials();
  const [url, setUrl] = useState(currentCreds.url || '');
  const [key, setKey] = useState(currentCreds.key || '');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedExpensesSql, setCopiedExpensesSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyExpensesSql = () => {
    navigator.clipboard.writeText(EXPENSES_ONLY_SQL);
    setCopiedExpensesSql(true);
    setTimeout(() => setCopiedExpensesSql(false), 2500);
  };

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter both Supabase Project URL and Anon Public Key.' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    const result = await testCloudConnection(url.trim(), key.trim());
    setTesting(false);

    if (result.success) {
      saveCloudCredentials(url.trim(), key.trim());
      setStatusMessage({ 
        type: 'success', 
        text: 'Successfully connected to Supabase! Syncing data across devices...' 
      });
      setTimeout(() => {
        if (onConnected) onConnected();
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ 
        type: 'error', 
        text: result.error || 'Connection failed. Please check credentials or run the SQL schema.' 
      });
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from Supabase? The app will revert to local browser storage on this device.')) {
      clearCloudCredentials();
      setUrl('');
      setKey('');
      setStatusMessage({ type: 'info', text: 'Disconnected from cloud database. Reverted to local storage.' });
      if (onConnected) onConnected();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              isCloudConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Multi-Device Cloud Sync (Supabase)</h3>
              <p className="text-xs text-slate-400">Share workshop jobs, invoices & sales between PC and Mobile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Status Alert Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
            isCloudConnected 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {isCloudConnected ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold text-sm">
                {isCloudConnected ? 'Cloud Database Connected' : 'Local Storage Mode (Not Synced)'}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {isCloudConnected 
                  ? 'All devices connected to this database receive updates in real time via WebSockets.'
                  : 'Data entered on this phone is currently saved ONLY on this device. Connect to Supabase to access data from your computer.'}
              </p>
            </div>
          </div>

          {/* Sync explanation card */}
          <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <Monitor className="h-5 w-5 text-red-400 mb-1" />
              <span className="font-bold text-white text-xs">Office PC</span>
              <span className="text-[10px] text-slate-400">Admin & Billing</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <Smartphone className="h-5 w-5 text-emerald-400 mb-1" />
              <span className="font-bold text-white text-xs">Mobile Phone</span>
              <span className="text-[10px] text-slate-400">Workshop & Sales</span>
            </div>
          </div>

          {/* Feedback status message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                : statusMessage.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
            }`}>
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleTestAndSave} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition text-xs font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">Found in Supabase: Project Settings ➔ API ➔ Project URL</p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Supabase Anon Public API Key
              </label>
              <textarea
                rows={2}
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={e => setKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition text-xs font-mono break-all"
              />
              <p className="text-[10px] text-slate-500 mt-1">Found in Supabase: Project Settings ➔ API ➔ Project API Keys (anon public)</p>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="submit"
                disabled={testing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    <span>Connect & Sync All Devices</span>
                  </>
                )}
              </button>

              {isCloudConnected && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-semibold border border-slate-700 transition"
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>

          {/* SQL Setup Helper */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-slate-200 text-xs">Supabase Database Setup Queries:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyExpensesSql}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-400 text-xs font-semibold transition"
                  title="Copy SQL to create only the missing expenses/income table"
                >
                  {copiedExpensesSql ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Expenses SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Expenses Fix SQL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-semibold transition"
                  title="Copy complete 9-table schema"
                >
                  {copiedSql ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied All SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy All 9 Tables SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If saving income or expenses fails, click <strong>Copy Expenses Fix SQL</strong> and paste it into your <strong>Supabase Dashboard ➔ SQL Editor ➔ Run</strong>. All tables are created safely with <code className="text-red-400">IF NOT EXISTS</code> without affecting existing data.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>INDEX MOTORS • Gudallur Hub</span>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-red-400 hover:underline"
          >
            <span>Open Supabase</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
