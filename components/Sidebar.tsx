import React from 'react';
import { RolloutWithId } from '../types';
import { LayoutList, Search, Clock, Box } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface SidebarProps {
  rollouts: RolloutWithId[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ rollouts, selectedId, onSelect, activeId }) => {
  
  // Format timestamp to readable string
  const formatTime = (ts: number) => {
    return new Date(ts * 1000).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-72 sm:w-80 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-full flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <LayoutList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">Monitor UI</h1>
          <p className="text-xs text-slate-500">DockerEnv Observer</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Rollout History
        </div>
        
        {rollouts.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-600">
             <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
             <p className="text-sm">No rollouts found.</p>
             <p className="text-xs mt-1">Waiting for API...</p>
          </div>
        ) : (
          <ul className="space-y-1 px-2 pb-4">
            {rollouts.map((rollout) => {
              const isSelected = selectedId === rollout.rollout_id;
              const isCurrentActive = rollout.rollout_id === activeId;

              return (
                <li key={rollout.rollout_id}>
                  <button
                    onClick={() => onSelect(rollout.rollout_id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent ${
                      isSelected 
                        ? 'bg-slate-800 border-slate-700 shadow-md ring-1 ring-slate-700' 
                        : 'hover:bg-slate-800/50 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <StatusBadge status={rollout.status} isActive={isCurrentActive} />
                       <span className="text-xs font-mono text-slate-500 ml-2">
                         {rollout.last_updated}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Box className="w-3 h-3" />
                      <span className="font-mono truncate max-w-[120px]" title={rollout.container_id}>
                        {rollout.container_id || 'No Container'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(rollout.start_time)}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        Auto-polling enabled (2s)
      </div>
    </div>
  );
};