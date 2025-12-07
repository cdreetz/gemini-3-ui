import React, { useState, useMemo, useEffect } from 'react';
import { FileText, AlertCircle, Info, FolderOpen, Terminal } from 'lucide-react';

interface FileViewerProps {
  files: Record<string, string>;
}

export const FileViewer: React.FC<FileViewerProps> = ({ files }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Separate actual files from system keys (info, error)
  const { fileList, systemMessages } = useMemo(() => {
    const list: string[] = [];
    const messages: { type: 'info' | 'error', content: string }[] = [];

    Object.entries(files).forEach(([key, value]) => {
      if (key === 'info') {
        if (value) messages.push({ type: 'info', content: value as string });
      } else if (key === 'error') {
        if (value) messages.push({ type: 'error', content: value as string });
      } else {
        list.push(key);
      }
    });

    // Sort files alphabetically
    list.sort();
    return { fileList: list, systemMessages: messages };
  }, [files]);

  // Select first file by default if none selected or selection invalid
  useEffect(() => {
    if (fileList.length > 0 && (!selectedPath || !fileList.includes(selectedPath))) {
      setSelectedPath(fileList[0]);
    } else if (fileList.length === 0) {
      setSelectedPath(null);
    }
  }, [fileList, selectedPath]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* System Messages Area (Top) */}
      {systemMessages.length > 0 && (
        <div className="p-4 border-b border-slate-100 space-y-2 bg-slate-50/50">
          {systemMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                msg.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-100' 
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}
            >
              {msg.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Info className="w-4 h-4 mt-0.5 shrink-0" />}
              <div className="whitespace-pre-wrap font-mono text-xs">{msg.content}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* File List (Left Sidebar) */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-200 font-medium text-slate-500 text-xs uppercase tracking-wider flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Container Files
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {fileList.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8 italic">
                No files found
              </div>
            ) : (
              fileList.map((path) => (
                <button
                  key={path}
                  onClick={() => setSelectedPath(path)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm truncate flex items-center gap-2 transition-colors ${
                    selectedPath === path
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 font-medium'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                  title={path}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Viewer (Right Main) */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-white">
             <Terminal className="w-4 h-4 text-slate-400" />
             <span className="font-mono text-sm text-slate-700 font-medium truncate">
               {selectedPath || 'No file selected'}
             </span>
          </div>
          <div className="flex-1 overflow-auto bg-[#fafafa]">
             {selectedPath && files[selectedPath] ? (
               <pre className="p-4 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 whitespace-pre tab-4">
                 <code>{files[selectedPath]}</code>
               </pre>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-12 h-12 mb-2 opacity-20" />
                  <span className="text-sm">Select a file to view content</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};