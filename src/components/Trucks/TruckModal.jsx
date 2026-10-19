import React, { useState, useEffect } from 'react';
import { X, Truck, Building, DollarSign, CheckCircle2 } from 'lucide-react';
import { SWARAJ_MAZDA_CATALOG } from '../../data/initialData';

const TATA_PRESETS = [
  { model: "Tata 407 Gold SFC 29 WB Lorry", engine: "Tata 4SP CR BS6 (100 HP)", axle: "4x2 Light Commercial (4.5T GVW)" },
  { model: "Tata 709g LPT BS6 Cargo Lorry", engine: "Tata 3.8L Turbotronn (125 HP)", axle: "4x2 Intermediate Lorry (7.5T GVW)" },
  { model: "Tata 1109g LPT Medium Lorry", engine: "Tata 3.8L Turbotronn (140 HP)", axle: "4x2 Medium Heavy (11.2T GVW)" },
  { model: "Tata 1512 LPT Heavy Cargo", engine: "Tata 3.3L NG BS6 (125 HP)", axle: "4x2 6-Wheeler Hauler (16T GVW)" },
  { model: "Tata Signa 2823.K Tipper (16 CuM)", engine: "Cummins ISBe 5.6L (220 HP)", axle: "6x4 Heavy Rock Tipper (28T GVW)" },
  { model: "Tata Starbus Ultra 36-Seater", engine: "Tata 4SP CR BS6 (100 HP)", axle: "4x2 Passenger Bus (8.2T GVW)" },
  { model: "Tata Winger Commercial Passenger Van", engine: "Tata 2.2L DICOR BS6 (100 HP)", axle: "4x2 Commercial Van (3.5T GVW)" },
];

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
    make: 'Swaraj Mazda',
    model: 'SML Isuzu Sartaj 5252 XM Lorry',
    year: new Date().getFullYear(),
    plate: '',
    vin: '',
    engine: '3455cc SLT4 Turbo BS6 (100 HP)',
    transmission: '5-Speed Manual Synchromesh',
    axle: '4x2 Cargo Lorry (5.2T GVW)',
    mileage: 0,
    customerId: '',
    customerName: 'Index Motors Dealership Inventory',
    salePrice: 1340000,
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
        make: 'Swaraj Mazda',
        model: 'SML Isuzu Sartaj 5252 XM Lorry',
        year: new Date().getFullYear(),
        plate: '',
        vin: `VIN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        engine: '3455cc SLT4 Turbo BS6 (100 HP)',
        transmission: '5-Speed Manual Synchromesh',
        axle: '4x2 Cargo Lorry (5.2T GVW)',
        mileage: 0,
        customerId: '',
        customerName: 'Index Motors Dealership Inventory',
        salePrice: 1340000,
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

  const handleQuickModelSelect = (e) => {
    const selected = e.target.value;
    if (!selected) return;

    if (formData.make === 'Swaraj Mazda') {
      const match = SWARAJ_MAZDA_CATALOG.find(m => m.model === selected);
      if (match) {
        setFormData(prev => ({
          ...prev,
          model: match.model,
          engine: match.engine,
          axle: `${match.type} (${match.gvw})`,
          salePrice: match.basePrice
        }));
      }
    } else if (formData.make === 'Tata Motors') {
      const match = TATA_PRESETS.find(m => m.model === selected);
      if (match) {
        setFormData(prev => ({
          ...prev,
          model: match.model,
          engine: match.engine,
          axle: match.axle
        }));
      }
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-black border border-red-500/30 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {truckToEdit ? `Edit Commercial Vehicle: ${formData.id}` : 'Register Commercial Vehicle / Stock'}
              </h3>
              <p className="text-xs text-red-400 font-medium">
                Swaraj Mazda Sales Stock & Tata / SML Workshop Service Fleet
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Classification & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Vehicle Classification *</label>
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium focus:border-red-500"
              >
                <option value="Dealership Stock">Dealership Stock (Showroom / Sales Yard)</option>
                <option value="Customer Truck">Customer Fleet Vehicle (Workshop Service)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-red-400 focus:border-red-500"
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

          {/* Make, Model, Preset */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Make / Manufacturer *</label>
              <select
                value={formData.make}
                onChange={e => {
                  const newMake = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    make: newMake,
                    model: newMake === 'Swaraj Mazda' ? SWARAJ_MAZDA_CATALOG[0].model : (newMake === 'Tata Motors' ? TATA_PRESETS[0].model : prev.model)
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-red-400 focus:border-red-500"
              >
                <option value="Swaraj Mazda">Swaraj Mazda (SML Isuzu)</option>
                <option value="Tata Motors">Tata Motors Commercial</option>
                <option value="Ashok Leyland">Ashok Leyland</option>
                <option value="Eicher Motors">Eicher Motors</option>
                <option value="BharatBenz">BharatBenz</option>
                <option value="Mahindra">Mahindra Truck & Bus</option>
                <option value="Other">Other Make</option>
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-bold text-zinc-300">
                Quick Model Preset ({formData.make})
              </label>
              <select
                onChange={handleQuickModelSelect}
                defaultValue=""
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-red-500"
              >
                <option value="">-- Choose From Catalog Presets --</option>
                {formData.make === 'Swaraj Mazda' && SWARAJ_MAZDA_CATALOG.map(v => (
                  <option key={v.id} value={v.model}>
                    [{v.type}] {v.model} ({v.gvw})
                  </option>
                ))}
                {formData.make === 'Tata Motors' && TATA_PRESETS.map(v => (
                  <option key={v.model} value={v.model}>
                    {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="font-bold text-zinc-300">Full Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. SML Isuzu Sartaj 5252 XM Lorry"
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Model Year</label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:border-red-500"
              />
            </div>
          </div>

          {/* Plate & VIN */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Registration / Plate #</label>
              <input
                type="text"
                placeholder="e.g. TN-43-C-1984 or KL-72-B-4412"
                value={formData.plate}
                onChange={e => setFormData({ ...formData, plate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono uppercase focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Chassis / VIN Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. SML5252XM9820194A"
                value={formData.vin}
                onChange={e => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono uppercase focus:border-red-500"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">Engine / Powertrain</label>
              <input
                type="text"
                placeholder="e.g. 3455cc SLT4 Turbo BS6"
                value={formData.engine}
                onChange={e => setFormData({ ...formData, engine: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Transmission</label>
              <input
                type="text"
                placeholder="e.g. 5-Speed Manual Synchromesh"
                value={formData.transmission}
                onChange={e => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Axle / Body Config</label>
              <input
                type="text"
                placeholder="e.g. 4x2 Cargo Lorry (5.2T GVW)"
                value={formData.axle}
                onChange={e => setFormData({ ...formData, axle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-500"
              />
            </div>
          </div>

          {/* Odometer & Customer Assignment */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">Current Odometer (km)</label>
              <input
                type="number"
                min="0"
                value={formData.mileage}
                onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:border-red-500"
              />
            </div>

            {formData.type === 'Dealership Stock' ? (
              <div className="col-span-2 space-y-1">
                <label className="text-zinc-400">Showroom Ex-Showroom Sale Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono font-bold text-red-400 focus:border-red-500"
                  />
                </div>
              </div>
            ) : (
              <div className="col-span-2 space-y-1">
                <label className="text-zinc-400">Registered Fleet Owner / Client</label>
                <select
                  value={formData.customerId || ''}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium focus:border-red-500"
                >
                  <option value="">-- Private / Unlinked Client --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-zinc-400">Notes & Service History</label>
            <textarea
              rows="2"
              placeholder="Factory options, high-deck body specs, warranty terms, or special service requests..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-500"
            />
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black shadow-lg shadow-red-600/30 transition active:scale-95 cursor-pointer"
            >
              {truckToEdit ? 'Save Vehicle Updates' : 'Add Commercial Vehicle'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
