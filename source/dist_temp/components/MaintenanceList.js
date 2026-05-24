import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { RefreshCcw, Edit2, Check, X, AlertCircle } from 'lucide-react';
const MaintenanceList = ({ ball, onReset, onUpdateInterval }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const startEdit = (task) => {
        setEditingId(task.id);
        setEditValue(task.intervalGames.toString());
    };
    const saveEdit = (taskId) => {
        const val = parseInt(editValue);
        if (!isNaN(val) && val > 0) {
            onUpdateInterval(taskId, val);
        }
        setEditingId(null);
    };
    return (_jsx("div", { className: "space-y-4", children: ball.maintenanceTasks.map(task => {
            const gamesSinceLast = ball.totalGames - task.lastDoneAtGameCount;
            const isDue = gamesSinceLast >= task.intervalGames;
            const progress = Math.min((gamesSinceLast / task.intervalGames) * 100, 100);
            return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex justify-between items-end mb-1 text-xs", children: [_jsx("span", { className: `font-bold uppercase tracking-tight ${isDue ? 'text-amber-500' : 'text-slate-400'}`, children: task.name }), _jsx("div", { className: "flex items-center gap-2", children: editingId === task.id ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "number", className: "w-12 bg-slate-800 border border-slate-600 rounded px-1 text-[10px]", value: editValue, onChange: (e) => setEditValue(e.target.value), autoFocus: true }), _jsx("button", { onClick: () => saveEdit(task.id), className: "text-emerald-500", children: _jsx(Check, { size: 14 }) }), _jsx("button", { onClick: () => setEditingId(null), className: "text-rose-500", children: _jsx(X, { size: 14 }) })] })) : (_jsxs("button", { onClick: () => startEdit(task), className: "text-slate-500 hover:text-white transition-colors", children: [_jsxs("span", { className: "text-[10px] font-medium mr-1", children: [task.intervalGames, "g interval"] }), _jsx(Edit2, { size: 10, className: "inline" })] })) })] }), _jsx("div", { className: "w-full h-1.5 bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-500 ${isDue ? 'bg-amber-500' : 'bg-indigo-500'}`, style: { width: `${progress}%` } }) }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsx("p", { className: "text-[10px] text-slate-500 font-medium", children: isDue ? (_jsxs("span", { className: "text-amber-500 flex items-center gap-1", children: [_jsx(AlertCircle, { size: 10 }), " Overdue by ", gamesSinceLast - task.intervalGames, " games"] })) : (`${task.intervalGames - gamesSinceLast} games until due`) }), _jsxs("button", { onClick: () => onReset(task.id), className: "flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors font-bold uppercase", children: [_jsx(RefreshCcw, { size: 10 }), " Reset"] })] })] }, task.id));
        }) }));
};
export default MaintenanceList;
