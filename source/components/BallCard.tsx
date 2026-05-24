
import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  PlusCircle,
  Info
} from 'lucide-react';
import { BowlingBall, MaintenanceTask } from '../types';
import MaintenanceList from './MaintenanceList';

interface BallCardProps {
  ball: BowlingBall;
  onAddGames: (count: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetMaintenance: (taskId: string) => void;
  onUpdateInterval: (taskId: string, interval: number) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}

const BallCard: React.FC<BallCardProps> = ({ 
  ball, 
  onAddGames, 
  onEdit, 
  onDelete, 
  onResetMaintenance,
  onUpdateInterval,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const [expanded, setExpanded] = useState(false);
  const [manualGames, setManualGames] = useState('');

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(manualGames);
    if (!isNaN(count) && count > 0) {
      onAddGames(count);
      setManualGames('');
    }
  };

  const dueCount = ball.maintenanceTasks.filter(t => 
    (ball.totalGames - t.lastDoneAtGameCount) >= t.intervalGames
  ).length;

  return (
    <div 
      className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:ring-2 hover:ring-indigo-500/50 cursor-move"
      draggable={true}
      onDragStart={(e) => onDragStart(e, ball.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, ball.id)}
    >
      {/* Top section: Ball Info */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-slate-400">
               {ball.imageUrl ? (
                 <img src={ball.imageUrl} alt={ball.name} className="w-full h-full object-cover rounded-full" />
               ) : (
                 <span className="text-xl font-bold tracking-tighter">{ball.name.substring(0, 2).toUpperCase()}</span>
               )}
             </div>
             <div>
               <h3 className="font-bold text-lg leading-tight group-hover:text-indigo-400 transition-colors">{ball.name}</h3>
               <p className="text-slate-400 text-xs font-medium">{ball.brand} • {ball.coverstock}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2 text-slate-500 hover:text-white transition-colors">
              <Settings size={18} />
            </button>
            <button onClick={onDelete} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-3 rounded-xl">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Games</p>
             <p className="text-xl font-bold">{ball.totalGames}</p>
          </div>
          <div className={`p-3 rounded-xl transition-colors ${dueCount > 0 ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-slate-800/50'}`}>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
             <p className={`text-sm font-bold ${dueCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
               {dueCount > 0 ? `${dueCount} Task(s) Due` : 'Healthy'}
             </p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => onAddGames(1)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-all"
          >
            +1 Game
          </button>
          <button 
            onClick={() => onAddGames(3)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg transition-all"
          >
            +3 Games (Series)
          </button>
        </div>

        <form onSubmit={handleManualAdd} className="flex gap-2 mb-2">
          <input 
            type="number" 
            placeholder="Custom add..." 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            value={manualGames}
            onChange={(e) => setManualGames(e.target.value)}
          />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg">
            <PlusCircle size={16} />
          </button>
        </form>
      </div>

      {/* Expandable Sections */}
      <div className="px-5 py-3 flex items-center justify-between text-slate-400 text-sm">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-xs font-bold uppercase tracking-widest">Maintenance</span>
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-700/30 pt-4 bg-slate-900/30">
          <MaintenanceList 
            ball={ball} 
            onReset={(taskId) => onResetMaintenance(taskId)}
            onUpdateInterval={onUpdateInterval}
          />
        </div>
      )}
    </div>
  );
};

export default BallCard;
