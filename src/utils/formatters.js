export const formatCurrency = (amount, symbol = '$') => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol}0.00`;
  return `${symbol}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Paid':
    case 'Ready for Pickup':
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    case 'In Progress':
    case 'Partially Paid':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
    case 'Awaiting Parts':
    case 'Pending':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'Overdue':
      return 'bg-red-500/10 text-red-400 border border-red-500/30';
    case 'Draft':
      return 'bg-slate-700/40 text-slate-300 border border-slate-600/40';
    case 'For Sale':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    case 'Reserved':
      return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
    case 'Sold':
      return 'bg-slate-600/30 text-slate-400 border border-slate-600/30';
    case 'In Workshop':
      return 'bg-orange-500/15 text-orange-300 border border-orange-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
    case 'High':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
    case 'Medium':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    case 'Routine':
    case 'Low':
      return 'bg-slate-700/40 text-slate-300 border border-slate-600/40';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};
