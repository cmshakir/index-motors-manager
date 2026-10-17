import React, { useState, useEffect } from 'react';
import { X, Truck, Building, DollarSign } from 'lucide-react';

export default function TruckModal({
  isOpen,
  onClose,
  onSave,
  truckToEdit,
  customers = []
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: `TRK-${Math.floor(100 + Math.random() * 900)}`,
    type: 'Dealership Stock',
    make: 'Volvo',
    model: 'FH16 750',
    year: new Date().getFullYear(),
    plate: '',
    vin: '',
    engine: 'D16K 750HP Euro 6',
    transmission: 'I-Shift 12-Speed',
    axle: '6x4 Tractor',
    mileage: 0,
    customerId: '',
    customerName: 'Index Motors Dealership Inventory',
    salePrice: 150000,
    status: 'For Sale',
    notes: ''
  });

  useEffect(() => {
    if (truckToEdit) {
      setFormData({ ...truckToEdit });
    } else {
      setFormData({
        id: `TRK-${Math.floor(100 + Math.random() * 900)}`,
        type: 'Dealership Stock',
        make: 'Volvo',
        model: 'FH16 750',
        year: new Date().getFullYear(),
        plate: '',
        vin: `VIN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        engine: 'D16K 750HP Euro 6',
        transmission: 'I-Shift 12-Speed',
        axle: '6x4 Tractor',
        mileage: 0,
        customerId: '',
        customerName: 'Index Motors Dealership Inventory',
        salePrice: 150000,
        status: 'For Sale',
        notes: ''
      });
    }
  }, [truckToEdit, isOpen]);

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    if (!custId) {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: prev.type === 'Dealership Stock' ? 'Index Motors Dealership Inventory' : 'Private Client'
      }));
      return;
    }
    const cust = customers.find(c => c.id === custId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.make.trim() || !formData.model.trim() || !formData.vin.trim()) {
      alert('Please fill in truck make, model, and VIN number.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {truckToEdit ? `Edit Truck: ${formData.make} ${formData.model}` : 'Register Commercial Truck'}
              </h3>
              <p className="text-xs text-slate-400">Index Motors Commercial Inventory & Fleet Registry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Classification & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Classification</label>
              <select
                value={formData.type}
                onChange={e => {
                  const newType = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    type: newType,
                    customerName: newType === 'Dealership Stock' ? 'Index Motors Dealership Inventory' : prev.customerName,
                    status: newType === 'Dealership Stock' ? 'For Sale' : 'In Workshop'
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Dealership Stock">Dealership Stock (Yard / Showroom)</option>
                <option value="Customer Truck">Customer Fleet Vehicle (Workshop)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {formData.type === 'Dealership Stock' ? (
                  <>
                    <option value="For Sale">For Sale (Showroom)</option>
                    <option value="Reserved">Reserved / Under Offer</option>
                    <option value="Sold">Sold</option>
                  </>
                ) : (
                  <>
                    <option value="In Workshop">In Workshop (Active Job)</option>
                    <option value="Ready for Pickup">Ready for Pickup / Serviced</option>
                    <option value="Active Fleet">Active Fleet on Road</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Make, Model, Year */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Make / Manufacturer *</label>
              <select
                value={formData.make}
                onChange={e => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Volvo">Volvo Trucks</option>
                <option value="Scania">Scania</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="MAN">MAN Trucks</option>
                <option value="Isuzu">Isuzu Commercial</option>
                <option value="Hino">Hino</option>
                <option value="DAF">DAF Trucks</option>
                <option value="Freightliner">Freightliner</option>
                <option value="Mack">Mack</option>
                <option value="Iveco">Iveco</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. FH16 750 or Actros 2653"
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Year</label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Plate & VIN */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Registration / Plate #</label>
              <input
                type="text"
                placeholder="e.g. APX-8821"
                value={formData.plate}
                onChange={e => setFormData({ ...formData, plate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Chassis / VIN Number *</label>
              <input
                type="text"
                required
                placeholder="17-character VIN"
                value={formData.vin}
                onChange={e => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
              />
            </div>
          </div>

          {/* Engine & Axle */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Engine Specs</label>
              <input
                type="text"
                placeholder="e.g. D16K 750HP / 3550Nm Euro 6"
                value={formData.engine}
                onChange={e => setFormData({ ...formData, engine: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Axle Configuration</label>
              <select
                value={formData.axle}
                onChange={e => setFormData({ ...formData, axle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="6x4 Tractor">6x4 Heavy Prime Mover / Tractor</option>
                <option value="6x2 Tag Axle">6x2 Tag / Pusher Axle</option>
                <option value="4x2 Rigid / Tractor">4x2 Distribution</option>
                <option value="8x4 Heavy Tipper / Construction">8x4 Heavy Tipper / Crane</option>
                <option value="6x6 All-Wheel Drive">6x6 All-Wheel Drive Off-Road</option>
              </select>
            </div>
          </div>

          {/* Odometer & Asking Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Odometer Mileage (KM)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={formData.mileage}
                onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            {formData.type === 'Dealership Stock' ? (
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Asking Sale Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 175000"
                  value={formData.salePrice || ''}
                  onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-emerald-400 font-bold"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Fleet Owner / Customer</label>
                <select
                  value={formData.customerId || ''}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Vehicle Notes / Specs</label>
            <textarea
              rows="2"
              placeholder="Features, retarder, sleeper cab type, maintenance history..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              {truckToEdit ? 'Save Changes' : 'Register Truck'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
