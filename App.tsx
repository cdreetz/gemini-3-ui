import React, { useEffect, useState, useMemo } from 'react';
import { HistoryResponse, RolloutWithId } from './types';
import { Sidebar } from './components/Sidebar';
import { FileViewer } from './components/FileViewer';
import { StatusBadge } from './components/StatusBadge';
import { RefreshCw, Server, AlertTriangle } from 'lucide-react';

const API_ENDPOINT = '/api/history';
const POLL_INTERVAL = 2000;

export default function App() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch Logic
  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      const json: HistoryResponse = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      // Don't clear old data on transient error, just show indicator
      setError("Connection lost. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  // Poll Interval
  useEffect(() => {
    fetchData(); // Initial load
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Prepare Rollout List
  const rollouts: RolloutWithId[] = useMemo(() => {
    if (!data || !data.history) return [];
    
    return Object.entries(data.history)
      .map(([id, meta]) => ({
        ...meta,
        rollout_id: id,
        isActive: id === data.active_id
      }))
      .sort((a, b) => {
        // Sort by Active first, then by Start Time (newest first)
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return b.start_time - a.start_time;
      });
  }, [data]);

  // Handle Initial Selection
  useEffect(() => {
    // If nothing is selected, select the active one or the first one
    if (!selectedId && rollouts.length > 0) {
      const active = rollouts.find(r => r.isActive);
      setSelectedId(active ? active.rollout_id : rollouts[0].rollout_id);
    }
  }, [rollouts, selectedId]);

  // Get currently selected rollout data
  const selectedRollout = rollouts.find(r => r.rollout_id === selectedId);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* Sidebar */}
      <Sidebar 
        rollouts={rollouts} 
        selectedId={selectedId} 
        onSelect={setSelectedId}
        activeId={data?.active_id || null}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {selectedRollout ? 'Rollout Details' : 'Dashboard'}
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400 ml-2" />}
            </h2>
            <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
              {selectedRollout ? (
                <>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    ID: {selectedRollout.rollout_id.split('-')[0]}...
                  </span>
                  <span>Container: <span className="font-mono">{selectedRollout.container_id}</span></span>
                </>
              ) : (
                <span>Select a run to view details</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md text-sm border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {selectedRollout && (
              <StatusBadge 
                status={selectedRollout.status} 
                isActive={selectedRollout.isActive} 
                className="text-sm px-3 py-1"
              />
            )}
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 p-6 overflow-hidden relative">
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-pulse">
               <Server className="w-12 h-12 mb-4" />
               <p>Connecting to Monitor Service...</p>
            </div>
          ) : !selectedRollout ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
               <p>No run selected or history is empty.</p>
            </div>
          ) : (
            <FileViewer files={selectedRollout.files} />
          )}
        </div>

      </main>
    </div>
  );
}