import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  RefreshCcw, 
  Activity, 
  AlertTriangle, 
  ChevronRight,
  Search,
  Dumbbell
} from 'lucide-react';
import { BowlingBall, CoverstockType, MaintenanceTask } from './types';
import BallCard from './components/BallCard';
import BallModal from './components/BallModal';
import MaintenanceList from './components/MaintenanceList';

const DEFAULT_TASKS: Omit<MaintenanceTask, 'id' | 'lastDoneAtGameCount'>[] = [
  { name: 'Clean Ball', intervalGames: 3 },
  { name: 'Quick Surface', intervalGames: 10 },
  { name: 'Resurface', intervalGames: 60 },
  { name: 'Change Inserts', intervalGames: 60 },
  { name: 'Deep Clean / Detox', intervalGames: 100 },
];

const STORAGE_KEY = 'bbtrack_arsenal_v1';

const App: React.FC = () => {
  const [balls, setBalls] = useState<BowlingBall[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBall, setEditingBall] = useState<BowlingBall | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'arsenal' | 'alerts'>('arsenal');
  const [draggedBallId, setDraggedBallId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    // Attempt to load from the new key, fallback to old key if exists for migration
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('striketrack_arsenal_v1');
    if (stored) {
      try {
        setBalls(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored balls");
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balls));
  }, [balls]);

  const addBall = (newBall: Omit<BowlingBall, 'id' | 'maintenanceTasks'>) => {
    const tasksWithIds: MaintenanceTask[] = DEFAULT_TASKS.map(t => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      lastDoneAtGameCount: 0
    }));

    const ball: BowlingBall = {
      ...newBall,
      id: Math.random().toString(36).substr(2, 9),
      maintenanceTasks: tasksWithIds,
      totalGames: 0
    };

    setBalls([...balls, ball]);
  };

  const updateBall = (updatedBall: BowlingBall) => {
    setBalls(balls.map(b => b.id === updatedBall.id ? updatedBall : b));
  };

  const deleteBall = (id: string) => {
    if (window.confirm('Remove this ball from your arsenal?')) {
      setBalls(balls.filter(b => b.id !== id));
    }
  };

  const addGamesToBall = (id: string, count: number) => {
    setBalls(balls.map(b => {
      if (b.id === id) {
        return { ...b, totalGames: b.totalGames + count };
      }
      return b;
    }));
  };

  const resetMaintenance = (ballId: string, taskId: string) => {
    setBalls(balls.map(b => {
      if (b.id === ballId) {
        return {
          ...b,
          maintenanceTasks: b.maintenanceTasks.map(t => 
            t.id === taskId ? { ...t, lastDoneAtGameCount: b.totalGames } : t
          )
        };
      }
      return b;
    }));
  };

  const updateInterval = (ballId: string, taskId: string, newInterval: number) => {
    setBalls(balls.map(b => {
      if (b.id === ballId) {
        return {
          ...b,
          maintenanceTasks: b.maintenanceTasks.map(t => 
            t.id === taskId ? { ...t, intervalGames: newInterval } : t
          )
        };
      }
      return b;
    }));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBallId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image or just let it be
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedBallId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId === targetId) return;

    const sourceIndex = balls.findIndex(b => b.id === sourceId);
    const targetIndex = balls.findIndex(b => b.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newBalls = [...balls];
    const [removed] = newBalls.splice(sourceIndex, 1);
    newBalls.splice(targetIndex, 0, removed);

    setBalls(newBalls);
  };

  const filteredBalls = useMemo(() => {
    return balls.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [balls, searchQuery]);

  const alertCount = useMemo(() => {
    return balls.reduce((acc, ball) => {
      const dueTasks = ball.maintenanceTasks.filter(t => 
        (ball.totalGames - t.lastDoneAtGameCount) >= t.intervalGames
      );
      return acc + dueTasks.length;
    }, 0);
  }, [balls]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                BBTrack
              </h1>
              <p className="text-xs text-slate-400 font-medium">Arsenal Performance Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:relative md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search arsenal..." 
                className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingBall(null); setIsModalOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Add Ball</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Arsenal</p>
            <h2 className="text-3xl font-bold">{balls.length} Balls</h2>
          </div>
          <div className={`glass p-6 rounded-2xl border-l-4 ${alertCount > 0 ? 'border-amber-500' : 'border-emerald-500'}`}>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Maintenance Due</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{alertCount} Tasks</h2>
              {alertCount > 0 && <AlertTriangle className="text-amber-500 animate-pulse" size={24} />}
            </div>
          </div>
          <div className="glass p-6 rounded-2xl border-l-4 border-sky-500">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Games</p>
            <h2 className="text-3xl font-bold">
              {balls.reduce((acc, b) => acc + b.totalGames, 0)} <span className="text-lg font-normal text-slate-500">Games</span>
            </h2>
          </div>
        </div>

        {/* View Selection */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('arsenal')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${view === 'arsenal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            My Arsenal
          </button>
          <button 
            onClick={() => setView('alerts')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${view === 'alerts' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Alerts
            {alertCount > 0 && <span className="bg-amber-800 text-amber-200 text-xs px-2 py-0.5 rounded-full">{alertCount}</span>}
          </button>
        </div>

        {view === 'arsenal' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBalls.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <Activity size={32} />
                </div>
                <p className="text-slate-400">Your arsenal is empty. Add your first ball to start tracking!</p>
              </div>
            ) : (
              filteredBalls.map(ball => (
                <BallCard 
                  key={ball.id} 
                  ball={ball} 
                  onAddGames={(count) => addGamesToBall(ball.id, count)}
                  onEdit={() => { setEditingBall(ball); setIsModalOpen(true); }}
                  onDelete={() => deleteBall(ball.id)}
                  onResetMaintenance={(taskId) => resetMaintenance(ball.id, taskId)}
                  onUpdateInterval={(taskId, interval) => updateInterval(ball.id, taskId, interval)}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
             {balls.map(ball => {
               const dueTasks = ball.maintenanceTasks.filter(t => (ball.totalGames - t.lastDoneAtGameCount) >= t.intervalGames);
               if (dueTasks.length === 0) return null;
               return (
                 <div key={ball.id} className="glass p-6 rounded-2xl border border-amber-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
                          <Dumbbell className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{ball.name}</h3>
                          <p className="text-slate-400 text-sm">{ball.brand} • {ball.coverstock}</p>
                        </div>
                      </div>
                      <span className="text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-xs">
                        {dueTasks.length} ACTIONS DUE
                      </span>
                    </div>
                    <div className="space-y-2">
                      {dueTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="text-amber-500" size={16} />
                            <span className="font-medium">{task.name}</span>
                          </div>
                          <button 
                            onClick={() => resetMaintenance(ball.id, task.id)}
                            className="text-xs bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg transition-all font-semibold"
                          >
                            Mark Completed
                          </button>
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
             {alertCount === 0 && (
               <div className="py-20 text-center">
                 <div className="w-16 h-16 bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity size={32} />
                 </div>
                 <p className="text-slate-400">Everything looks great! No pending maintenance.</p>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <BallModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingBall(null); }}
          onSave={(data) => {
            if (editingBall) {
              updateBall({ ...editingBall, ...data });
            } else {
              addBall(data);
            }
            setIsModalOpen(false);
            setEditingBall(null);
          }}
          initialData={editingBall}
        />
      )}

      {/* Mobile Quick Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-700/50 px-6 py-3 flex justify-around items-center">
        <button onClick={() => setView('arsenal')} className={`flex flex-col items-center gap-1 ${view === 'arsenal' ? 'text-indigo-500' : 'text-slate-400'}`}>
          <Activity size={24} />
          <span className="text-[10px] font-bold">Arsenal</span>
        </button>
        <button 
          onClick={() => { setEditingBall(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white p-3 rounded-full -mt-10 shadow-xl shadow-indigo-500/30"
        >
          <Plus size={24} />
        </button>
        <button onClick={() => setView('alerts')} className={`flex flex-col items-center gap-1 ${view === 'alerts' ? 'text-indigo-500' : 'text-slate-400'}`}>
          <AlertTriangle size={24} />
          <span className="text-[10px] font-bold">Alerts</span>
        </button>
      </div>
    </div>
  );
};

export default App;
