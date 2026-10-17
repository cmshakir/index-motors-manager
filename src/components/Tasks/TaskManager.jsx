import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  Table as TableIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Eye, 
  Truck,
  User,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { formatCurrency, formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

const KANBAN_COLUMNS = [
  { id: 'Pending', label: 'Received / Pending', color: 'border-slate-600' },
  { id: 'In Progress', label: 'In Progress (Bay Work)', color: 'border-blue-500' },
  { id: 'Awaiting Parts', label: 'Awaiting Parts / Order', color: 'border-amber-500' },
  { id: 'Ready for Pickup', label: 'Quality Check / Ready', color: 'border-emerald-500' },
];

export default function TaskManager({
  profile,
  tasks = [],
  onNewTask,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onGenerateInvoiceFromTask
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      task.id.toLowerCase().includes(q) ||
      task.title.toLowerCase().includes(q) ||
      task.truckModel.toLowerCase().includes(q) ||
      (task.plate && task.plate.toLowerCase().includes(q)) ||
      (task.vin && task.vin.toLowerCase().includes(q)) ||
      task.customerName.toLowerCase().includes(q) ||
      task.assignedTech.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Workshop Job Cards & Service Tasks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {filteredTasks.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage heavy truck work orders, bay allocation, technician assignments, and parts usage.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'kanban' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onNewTask}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ New Job Card</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Job #, Truck, Plate, VIN, Customer, or Mechanic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent / Breakdown</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Routine">Routine Service</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Service Types</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter for Table view */}
            {viewMode === 'table' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Received / Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Parts">Awaiting Parts</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
              </select>
            )}

            {(searchQuery || priorityFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Kanban or Table */}
      {viewMode === 'kanban' ? (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                className="bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-slate-800 flex items-center justify-between border-t-4 ${col.color} rounded-t-2xl`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-white tracking-wide uppercase">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Body / Cards List */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      No jobs in this stage
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        currency={profile?.currency || '$'}
                        onView={() => onViewTask(task)}
                        onEdit={() => onEditTask(task)}
                        onDelete={() => onDeleteTask(task.id)}
                        onStatusChange={(newStatus) => onUpdateTaskStatus(task.id, newStatus)}
                        onGenerateInvoice={() => onGenerateInvoiceFromTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Job Card #</th>
                  <th className="py-3.5 px-4">Truck & Fleet</th>
                  <th className="py-3.5 px-4">Category & Work</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status & Bay</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-sm text-slate-500">
                      No workshop job cards match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-slate-850/60 transition cursor-pointer"
                      onClick={() => onViewTask(task)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-xs whitespace-nowrap">
                        {task.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{task.truckModel}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                          <span className="font-mono text-amber-300/90">{task.plate}</span>
                          <span>•</span>
                          <span className="truncate max-w-[140px]">{task.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 text-xs truncate max-w-xs">{task.title}</div>
                        <div className="text-[11px] text-slate-400">{task.category}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusBadgeClass(task.status)} block w-fit`}>
                          {task.status}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{task.bay}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300 whitespace-nowrap">
                        {task.assignedTech}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                        {task.actualHours || 0} / {task.estimatedHours}h
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          {!task.invoiceId && (
                            <button
                              onClick={() => onGenerateInvoiceFromTask(task)}
                              className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition"
                              title="Generate Invoice from Job Card"
                            >
                              + Bill
                            </button>
                          )}
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                            title="Edit Job Card"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                            title="Delete Job Card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponent: Kanban Task Card
function TaskCard({ task, currency, onView, onEdit, onDelete, onStatusChange, onGenerateInvoice }) {
  const completedChecklist = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
  const totalChecklist = task.checklist ? task.checklist.length : 0;
  const partsCount = task.parts ? task.parts.length : 0;
  const partsCost = task.parts ? task.parts.reduce((acc, p) => acc + (p.qty * p.unitPrice), 0) : 0;

  return (
    <div 
      onClick={onView}
      className="group bg-slate-950/90 rounded-xl border border-slate-800 hover:border-amber-500/50 p-3.5 space-y-3 cursor-pointer transition shadow-md hover:shadow-xl"
    >
      {/* Top Header: ID & Priority */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-amber-400">
          {task.id}
        </span>
        <div className="flex items-center space-x-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Title & Category */}
      <div>
        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
          {task.title}
        </h4>
        <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">
          {task.category}
        </span>
      </div>

      {/* Truck & Customer Block */}
      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1 text-xs">
        <div className="flex items-center space-x-1.5 text-white font-semibold truncate">
          <Truck className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">{task.truckModel}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-amber-400">{task.plate || "No Plate"}</span>
          <span className="truncate max-w-[110px]">{task.customerName}</span>
        </div>
      </div>

      {/* Bay & Mechanic */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[120px] font-medium text-slate-300">
          📍 {task.bay || "Unassigned Bay"}
        </span>
        <span className="truncate max-w-[100px] text-slate-400">
          🔧 {task.assignedTech}
        </span>
      </div>

      {/* Checklist & Hours summary */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        {totalChecklist > 0 ? (
          <span className="text-slate-400 flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>{completedChecklist}/{totalChecklist} Checks</span>
          </span>
        ) : (
          <span className="text-slate-500">No checklist</span>
        )}

        <span className="font-mono text-slate-400">
          <Clock className="h-3 w-3 inline mr-0.5 text-amber-400" />
          {task.actualHours || 0}/{task.estimatedHours}h
        </span>
      </div>

      {/* Footer Quick Stage Mover & Invoice Button */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-1">
          {task.status !== 'Pending' && (
            <button
              onClick={() => {
                if (task.status === 'Ready for Pickup') onStatusChange('Awaiting Parts');
                else if (task.status === 'Awaiting Parts') onStatusChange('In Progress');
                else if (task.status === 'In Progress') onStatusChange('Pending');
              }}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Move backward"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}

          {task.status !== 'Ready for Pickup' && (
            <button
              onClick={() => {
                if (task.status === 'Pending') onStatusChange('In Progress');
                else if (task.status === 'In Progress') onStatusChange('Awaiting Parts');
                else if (task.status === 'Awaiting Parts') onStatusChange('Ready for Pickup');
              }}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Advance stage"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {!task.invoiceId ? (
            <button
              onClick={onGenerateInvoice}
              className="text-[10px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition flex items-center space-x-1"
              title="Generate Invoice from Job Card"
            >
              <FileText className="h-3 w-3" />
              <span>Bill</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center">
              ✓ Invoiced
            </span>
          )}

          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
