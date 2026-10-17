import React, { useState } from 'react';
import { 
  Truck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  DollarSign, 
  Building2,
  AlertCircle
} from 'lucide-react';

export default function LoginScreen({ users = [], onLogin, profile }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const foundUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Invalid email or password. You can also click any demo user card below for instant login.');
    }
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedDemoUser(user.id);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glow & Watermark */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none hidden lg:block">
        <Truck className="h-96 w-96 text-amber-400" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Dealership Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 items-center justify-center shadow-xl shadow-amber-500/20 border border-amber-400/30 mx-auto">
            <Truck className="h-9 w-9 text-slate-950 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-wider text-white">
              {profile?.name || "INDEX MOTORS"}
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-1">
              Swaraj Mazda Sales & Service • Buses & Lorries
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Pallipadi, Gudallur • 📞 +91 8848555675
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <h3 className="text-base font-black text-white mb-1">Staff Portal Login</h3>
          <p className="text-xs text-slate-400 mb-6">Enter your authorized credentials to access workshop & sales management.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. sales@indexmotors.online"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Sign In to Dealership System</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Fast 1-Click Demo Login
            </p>

            <div className="grid grid-cols-2 gap-2 text-left">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className={`p-2.5 rounded-xl border transition text-left ${
                    selectedDemoUser === u.id
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="h-6 w-6 rounded bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center">
                      {u.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.role.split(' ')[0]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2.5">
              Click any profile above to log in instantly with appropriate permissions.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} INDEX MOTORS • Swaraj Mazda Sales & Service • Pallipadi, Gudallur
        </div>

      </div>
    </div>
  );
}
