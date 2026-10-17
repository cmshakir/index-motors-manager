import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Truck, 
  User, 
  Clock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  trucks = [],
  customers = [],
  technicians = [],
  profile
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: `JOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    truckId: '',
    truckModel: '',
    plate: '',
    vin: '',
    customerId: '',
    customerName: '',
    category: 'Preventive Maintenance',
    priority: 'Medium',
    status: 'Pending',
    assignedTech: technicians[0]?.name || 'Marcus Vance',
    bay: profile?.workshopBays?.[0] || 'Bay 1 - Heavy Lift',
    currentMileage: '',
    dateReceived: new Date().toISOString().slice(0, 10),
    targetDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    estimatedHours: 4,
    actualHours: 0,
    description: '',
    checklist: [
      { id: 'c1', task: 'Visual safety & fluid level walkaround', completed: false },
      { id: 'c2', task: 'ECU fault code diagnostics check', completed: false },
    ],
    parts: []
  });

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newPart, setNewPart] = useState({ partNo: '', name: '', qty: 1, unitPrice: 0 });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({ ...taskToEdit });
    } else {
      setFormData({
        id: `JOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        truckId: '',
        truckModel: '',
        plate: '',
        vin: '',
        customerId: '',
        customerName: '',
        category: 'Preventive Maintenance',
        priority: 'Medium',
        status: 'Pending',
        assignedTech: technicians[0]?.name || 'Marcus Vance',
        bay: profile?.workshopBays?.[0] || 'Bay 1 - Heavy Lift',
        currentMileage: '',
        dateReceived: new Date().toISOString().slice(0, 10),
        targetDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        estimatedHours: 4,
        actualHours: 0,
        description: '',
        checklist: [
          { id: 'c1', task: 'Visual safety & fluid level walkaround', completed: false },
          { id: 'c2', task: 'ECU fault code diagnostics check', completed: false },
        ],
        parts: []
      });
    }
  }, [taskToEdit, isOpen]);

  // Handle Truck Selection
  const handleTruckSelect = (e) => {
    const selectedTruckId = e.target.value;
    if (!selectedTruckId) {
      setFormData(prev => ({ ...prev, truckId: '' }));
      return;
    }
    const truck = trucks.find(t => t.id === selectedTruckId);
    if (truck) {
      setFormData(prev => ({
        ...prev,
        truckId: truck.id,
        truckModel: `${truck.make} ${truck.model}`,
        plate: truck.plate || '',
        vin: truck.vin || '',
        currentMileage: truck.mileage || prev.currentMileage,
        customerId: truck.customerId || prev.customerId,
        customerName: truck.customerName || prev.customerName,
      }));
    }
  };

  // Handle Customer Selection
  const handleCustomerSelect = (e) => {
    const selectedCustId = e.target.value;
    if (!selectedCustId) return;
    const cust = customers.find(c => c.id === selectedCustId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name
      }));
    }
  };

  // Add checklist item
  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: `c-${Date.now()}`, task: newChecklistText.trim(), completed: false }
      ]
    }));
    setNewChecklistText('');
  };

  // Remove checklist item
  const handleRemoveChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(c => c.id !== id)
    }));
  };

  // Add Part item
  const handleAddPart = (e) => {
    e.preventDefault();
    if (!newPart.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          partNo: newPart.partNo.trim() || `GEN-${Date.now().toString().slice(-4)}`,
          name: newPart.name.trim(),
          qty: Number(newPart.qty) || 1,
          unitPrice: Number(newPart.unitPrice) || 0
        }
      ]
    }));
    setNewPart({ partNo: '', name: '', qty: 1, unitPrice: 0 });
  };

  // Remove Part item
  const handleRemovePart = (index) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.truckModel.trim()) {
      alert('Please provide a job title and truck model.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {taskToEdit ? `Edit Job Card: ${formData.id}` : 'Create Workshop Job Card'}
              </h3>
              <p className="text-xs text-slate-400">
                Index Motors Commercial Vehicle Service & Work Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Top Row: Job Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Job Title / Service Order Summary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engine Turbo Overhaul & 200k Major Service"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Service Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Preventive Maintenance">Preventive Maintenance</option>
                <option value="Engine & Fuel System">Engine & Fuel System</option>
                <option value="Brake & Suspension">Brake & Suspension</option>
                <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                <option value="Electrical & Diagnostics">Electrical & Diagnostics</option>
                <option value="Hydraulics & Bodywork">Hydraulics & Bodywork</option>
                <option value="PDI & Dealership Prep">PDI & Dealership Prep</option>
                <option value="Accident Repair">Accident Repair</option>
              </select>
            </div>
          </div>

          {/* Truck & Customer Block */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Truck className="h-4 w-4" />
              <span>Commercial Truck & Fleet Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Select Existing Truck */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Quick Select Truck</label>
                <select
                  value={formData.truckId || ''}
                  onChange={handleTruckSelect}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="">-- Choose or Enter Below --</option>
                  {trucks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.make} {t.model} ({t.plate || t.vin?.slice(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Truck Model */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Truck Make & Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volvo FH16 750"
                  value={formData.truckModel}
                  onChange={e => setFormData({ ...formData, truckModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              {/* Plate No */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Registration / Plate #</label>
                <input
                  type="text"
                  placeholder="e.g. TRK-8819"
                  value={formData.plate}
                  onChange={e => setFormData({ ...formData, plate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              {/* Odometer Mileage */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Current Odometer (KM / Mi)</label>
                <input
                  type="number"
                  placeholder="e.g. 215400"
                  value={formData.currentMileage}
                  onChange={e => setFormData({ ...formData, currentMileage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
              {/* VIN / Chassis */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Chassis / VIN Number</label>
                <input
                  type="text"
                  placeholder="e.g. YV2RT40A5NA819201"
                  value={formData.vin}
                  onChange={e => setFormData({ ...formData, vin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              {/* Select Existing Customer */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Fleet Account / Client</label>
                <select
                  value={formData.customerId || ''}
                  onChange={handleCustomerSelect}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Customer Name input fallback */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Client / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Continental Haulage"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Allocation & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Priority Level</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Urgent">Urgent / Breakdown</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Routine">Routine Service</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Pending">Received / Pending</option>
                <option value="In Progress">In Progress (Bay Work)</option>
                <option value="Awaiting Parts">Awaiting Parts</option>
                <option value="Ready for Pickup">Quality Check / Ready</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Lead Mechanic / Tech</label>
              <select
                value={formData.assignedTech}
                onChange={e => setFormData({ ...formData, assignedTech: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role.split(' ')[0]})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Workshop Bay</label>
              <select
                value={formData.bay}
                onChange={e => setFormData({ ...formData, bay: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                {profile?.workshopBays?.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Date Received</label>
              <input
                type="date"
                value={formData.dateReceived}
                onChange={e => setFormData({ ...formData, dateReceived: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
              </input>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Target Completion</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
              </input>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Estimated Labor (Hrs)</label>
              <input
                type="number"
                step="0.5"
                value={formData.estimatedHours}
                onChange={e => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Actual Labor (Hrs)</label>
              <input
                type="number"
                step="0.5"
                value={formData.actualHours}
                onChange={e => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          {/* Diagnosis / Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Work Description & Mechanic Diagnostic Notes
            </label>
            <textarea
              rows="3"
              placeholder="Driver complaints, observed symptoms, diagnostic codes, work performed..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <span>Job Card Checklist & Inspection Steps ({formData.checklist.length})</span>
              </label>
            </div>

            <div className="space-y-2">
              {formData.checklist.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => {
                        const updated = [...formData.checklist];
                        updated[idx].completed = e.target.checked;
                        setFormData({ ...formData, checklist: updated });
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 bg-slate-900 cursor-pointer"
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {item.task}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add checklist input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add inspection or service task step..."
                value={newChecklistText}
                onChange={e => setNewChecklistText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                + Add Step
              </button>
            </div>
          </div>

          {/* Parts Used / Allocated */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Wrench className="h-4 w-4 text-amber-400" />
              <span>Commercial Parts & Materials Used ({formData.parts.length})</span>
            </label>

            {formData.parts.length > 0 && (
              <div className="space-y-2">
                {formData.parts.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-mono text-amber-400 mr-2">{p.partNo}</span>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono">
                      <span>x{p.qty}</span>
                      <span>${p.unitPrice}</span>
                      <span className="text-white font-bold">${(p.qty * p.unitPrice).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePart(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Part input form */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <input
                type="text"
                placeholder="Part # (e.g. VO-218944)"
                value={newPart.partNo}
                onChange={e => setNewPart({ ...newPart, partNo: e.target.value })}
                className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Part Description"
                value={newPart.name}
                onChange={e => setNewPart({ ...newPart, name: e.target.value })}
                className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white sm:col-span-1"
              />
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={newPart.qty}
                  onChange={e => setNewPart({ ...newPart, qty: Number(e.target.value) })}
                  className="w-16 px-2 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price $"
                  value={newPart.unitPrice || ''}
                  onChange={e => setNewPart({ ...newPart, unitPrice: Number(e.target.value) })}
                  className="flex-1 px-2 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPart}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400"
              >
                + Add Part
              </button>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            {taskToEdit ? 'Save Changes' : 'Create Job Card'}
          </button>
        </div>

      </div>
    </div>
  );
}
