/**
 * Desktop-style status bar (footer)
 * Shows connection status, backend health, Ollama status
 */

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatusBarProps {
  backendConnected: boolean;
  totalScreenshots: number;
}

export default function StatusBar({ backendConnected, totalScreenshots }: StatusBarProps) {
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');

  useEffect(() => {
    // Check Ollama status
    const checkOllama = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/version');
        setOllamaStatus(response.ok ? 'online' : 'offline');
      } catch {
        setOllamaStatus('offline');
      }
    };

    checkOllama();
    const interval = setInterval(checkOllama, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-slate-700 bg-[#1e293b]/50 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-xs text-[#94a3b8]">
      <div className="flex items-center gap-4">
        {/* Backend Status */}
        <div className="flex items-center gap-1.5">
          {backendConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Backend Connected</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-400">Backend Offline</span>
            </>
          )}
        </div>

        {/* Ollama Status */}
        <div className="flex items-center gap-1.5">
          {ollamaStatus === 'online' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Ollama Running</span>
            </>
          ) : ollamaStatus === 'offline' ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-400">Ollama Offline (using rules only)</span>
            </>
          ) : (
            <span className="text-[#64748b]">Checking Ollama...</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Total Screenshots */}
        <span>{totalScreenshots} screenshot{totalScreenshots !== 1 ? 's' : ''} processed</span>

        {/* Privacy Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
          <span className="font-medium">100% Offline</span>
        </div>
      </div>
    </footer>
  );
}
