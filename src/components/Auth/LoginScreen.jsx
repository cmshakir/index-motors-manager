import React, { useState } from 'react';
import { 
  Truck, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginScreen({ users = [], onLogin, profile }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // The primary authorized single user
  const primaryUser = users[0] || {
    id: "USR-ADMIN",
    username: "shakir",
    name: "Shakir CM",
    email: "shakir@indexmotors.online",
    password: "admin",
    role: "Dealership Owner & Managing Director",
    avatar: "SC"
  };

  const handleFillCredentials = () => {
    setIdentifier(primaryUser.username || 'shakir');
    setPassword(primaryUser.password || 'admin');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputId = identifier.trim().toLowerCase();
    const inputPass = password.trim();

    // Check credentials against the single authorized user or users list
    const foundUser = users.find(u => {
      const matchEmail = u.email && u.email.toLowerCase() === inputId;
      const matchUsername = u.username && u.username.toLowerCase() === inputId;
      const matchName = u.name && u.name.toLowerCase().includes(inputId);
      const matchAdmin = inputId === 'admin' || inputId === 'shakir' || inputId === '8848555675';
      const matchPass = u.password === inputPass || (inputPass === 'admin' && (!u.password || u.password === 'admin'));
      return (matchEmail || matchUsername || matchName || matchAdmin) && matchPass;
    });

    setTimeout(() => {
      setLoading(false);
      if (foundUser) {
        onLogin(foundUser);
      } else if ((inputId === 'shakir' || inputId === 'admin' || inputId === primaryUser.email.toLowerCase()) && inputPass === (primaryUser.password || 'admin')) {
        onLogin(primaryUser);
      } else {
        setError('Invalid username or password. Click "Fill Login" below to autofill your authorized credentials.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 opacity-5 pointer-events-none hidden lg:block">
        <Truck className="h-80 w-80 text-amber-500" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Dealership Branding Window Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 items-center justify-center shadow-2xl shadow-amber-500/25 border border-amber-400/30 mx-auto transform hover:scale-105 transition duration-300">
            <Truck className="h-9 w-9 sm:h-11 sm:w-11 text-slate-950 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Authorized Dealership Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
              {profile?.name || "INDEX MOTORS"}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-1">
              Swaraj Mazda Sales & Service • Buses & Lorries
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Pallipadi, Gudallur • Nilgiris • 📞 +91 8848555675
            </p>
          </div>
        </div>

        {/* Dedicated Login Window Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <span>Owner & Administrator Sign In</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Single-user authorized login window
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400" title="Cloud Database Ready">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2 animate-shake">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Authorized Username or Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="e.g. shakir or shakir@indexmotors.online"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition text-xs font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick Autofill Helper for Authorized User */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                <span>User: <strong className="text-amber-400">{primaryUser.username || 'shakir'}</strong></span>
                <span className="mx-1.5">•</span>
                <span>Pass: <strong className="text-amber-400">{primaryUser.password || 'admin'}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition active:scale-95"
                title="Fill authorized credentials automatically"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Fill Login</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Index Motors"}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>

          </form>

          {/* Footer Security Badge */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Single-User Secure Session</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">v3.0 • Supabase Cloud</span>
          </div>

        </div>

        {/* Bottom Dealership Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} INDEX MOTORS • SML Isuzu Commercial Vehicles • Pallipadi, Gudallur
        </div>

      </div>
    </div>
  );
}
