import React, { useState } from 'react';
import { UserCheck, Phone, Wrench, Shield, Plus, X, Edit3, Trash2 } from 'lucide-react';

export default function TechniciansView({
  technicians = [],
  tasks = [],
  onSaveTechnician,
  onDeleteTechnician
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [techToEdit, setTechToEdit] = useState(null);
  const [formData, setFormData] = useState({
    id: `TECH-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    role: 'Diesel Technician',
    specialty: 'Heavy Engine & Drivetrain',
    phone: '',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    setTechToEdit(null);
    setFormData({
      id: `TECH-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      role: 'Diesel Technician',
      specialty: 'Heavy Engine & Drivetrain',
      phone: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tech) => {
    setTechToEdit(tech);
    setFormData({ ...tech });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSaveTechnician(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-wide">
              Workshop Technicians & Specialists
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {technicians.length} Mechanics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified diesel mechanics, heavy commercial electrical specialists, and PDI foremen.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 w-fit"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Add Technician</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {technicians.map((tech) => {
          const assignedJobs = tasks.filter(t => t.assignedTech === tech.name && t.status !== 'Completed' && t.status !== 'Ready for Pickup');
          return (
            <div 
              key={tech.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{tech.name}</h3>
                      <p className="text-xs text-amber-400 font-medium">{tech.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {tech.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Specialty:</span>
                    <span className="text-slate-200 font-medium">{tech.specialty}</span>
                  </div>
                  {tech.phone && (
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tech.phone}</span>
                    </div>
                  )}
                </div>

                {/* Active Jobs for this tech */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Assigned Jobs ({assignedJobs.length}):
                  </span>
                  {assignedJobs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No active job currently assigned</p>
                  ) : (
                    assignedJobs.map(j => (
                      <div key={j.id} className="p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-xs flex items-center justify-between">
                        <span className="font-semibold text-white truncate max-w-[160px]">{j.truckModel}</span>
                        <span className="font-mono text-amber-400 text-[10px]">{j.bay}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-1">
                <button
                  onClick={() => handleOpenEdit(tech)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTechnician(tech.id)}
                  className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {techToEdit ? 'Edit Technician' : 'Add Technician'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Job Title / Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Technical Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
