
import React, { useState } from 'react';
import { RefreshCcw, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { BowlingBall, MaintenanceTask } from '../types';

interface MaintenanceListProps {
  ball: BowlingBall;
  onReset: (taskId: string) => void;
  onUpdateInterval: (taskId: string, interval: number) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ ball, onReset, onUpdateInterval }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (task: MaintenanceTask) => {
    setEditingId(task.id);
    setEditValue(task.intervalGames.toString());
  };

  const saveEdit = (taskId: string) => {
    const val = parseInt(editValue);
    if (!isNaN(val) && val > 0) {
      onUpdateInterval(taskId, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {ball.maintenanceTasks.map(task => {
        const gamesSinceLast = ball.totalGames - task.lastDoneAtGameCount;
        const isDue = gamesSinceLast >= task.intervalGames;
        const progress = Math.min((gamesSinceLast / task.intervalGames) * 100, 100);

        return (
          <div key={task.id} className="relative">
            <div className="flex justify-between items-end mb-1 text-xs">
              <span className={`font-bold uppercase tracking-tight ${isDue ? 'text-amber-500' : 'text-slate-400'}`}>
                {task.name}
              </span>
              <div className="flex items-center gap-2">
                {editingId === task.id ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      className="w-12 bg-slate-800 border border-slate-600 rounded px-1 text-[10px]"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(task.id)} className="text-emerald-500"><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} className="text-rose-500"><X size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(task)} className="text-slate-500 hover:text-white transition-colors">
                    <span className="text-[10px] font-medium mr-1">{task.intervalGames}g interval</span>
                    <Edit2 size={10} className="inline" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isDue ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
               <p className="text-[10px] text-slate-500 font-medium">
                {isDue ? (
                  <span className="text-amber-500 flex items-center gap-1">
                    <AlertCircle size={10} /> Overdue by {gamesSinceLast - task.intervalGames} games
                  </span>
                ) : (
                  `${task.intervalGames - gamesSinceLast} games until due`
                )}
               </p>
               <button 
                onClick={() => onReset(task.id)}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors font-bold uppercase"
               >
                 <RefreshCcw size={10} /> Reset
               </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MaintenanceList;
