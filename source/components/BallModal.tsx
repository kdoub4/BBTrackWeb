
import React, { useState } from 'react';
import { X, Save, Camera } from 'lucide-react';
import { BowlingBall, CoverstockType } from '../types';

interface BallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<BowlingBall, 'id' | 'maintenanceTasks'>) => void;
  initialData: BowlingBall | null;
}

const BallModal: React.FC<BallModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<BowlingBall, 'id' | 'maintenanceTasks' | 'totalGames'>>({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    coverstock: initialData?.coverstock || CoverstockType.SOLID,
    surfaceFinish: initialData?.surfaceFinish || 'Out of Box',
    imageUrl: initialData?.imageUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand) return;
    onSave({
      ...formData,
      totalGames: initialData?.totalGames || 0
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Ball' : 'New Performance Ball'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ball Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Phaze II"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Storm"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coverstock Type</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              value={formData.coverstock}
              onChange={(e) => setFormData({ ...formData, coverstock: e.target.value as CoverstockType })}
            >
              {Object.values(CoverstockType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Surface Finish</label>
            <input 
              type="text" 
              placeholder="e.g. 2000 Grit Abralon"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.surfaceFinish}
              onChange={(e) => setFormData({ ...formData, surfaceFinish: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image URL (Optional)</label>
            <div className="flex gap-2">
               <input 
                type="text" 
                placeholder="https://..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <button type="button" className="bg-slate-800 p-3 rounded-xl text-slate-500 hover:text-indigo-400 transition-colors">
                <Camera size={20} />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Save size={20} />
              {initialData ? 'Update Ball' : 'Add to Arsenal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BallModal;
