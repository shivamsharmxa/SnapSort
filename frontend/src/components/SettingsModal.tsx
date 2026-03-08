/**
 * SettingsModal - Clean settings panel
 * macOS-style modal with clear sections
 */

import { X, Monitor, FlaskConical, Undo2, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: {
    monitoring: boolean;
    dryRun: boolean;
  };
  onToggleMonitoring: () => void;
  onToggleDryRun: () => void;
  onUndo: () => Promise<any>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  status,
  onToggleMonitoring,
  onToggleDryRun,
  onUndo,
}: SettingsModalProps) {
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);

  // Check Ollama status
  useEffect(() => {
    if (!isOpen) return;

    const checkOllama = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/version', {
          signal: AbortSignal.timeout(2000),
        });
        setOllamaOnline(response.ok);
      } catch {
        setOllamaOnline(false);
      }
    };

    checkOllama();
    const interval = setInterval(checkOllama, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-[#E5E5E5]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-[15px] font-semibold text-[#1F1F1F]">Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4 text-[#6B6B6B]" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Monitoring Toggle */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#F5F5F5] rounded-lg flex items-center justify-center mt-0.5">
                <Monitor className="w-4 h-4 text-[#6B6B6B]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[13px] font-medium text-[#1F1F1F] mb-1">
                  Screenshot Monitoring
                </h3>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed max-w-xs">
                  Automatically detect and organize new screenshots from your Desktop
                </p>
              </div>
            </div>
            <button
              onClick={onToggleMonitoring}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200
                ${status.monitoring ? 'bg-[#0071E3]' : 'bg-[#E5E5E5]'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${status.monitoring ? 'translate-x-5.5' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          {/* Dry Run Toggle */}
          <div className="flex items-start justify-between pt-4 border-t border-[#E5E5E5]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mt-0.5">
                <FlaskConical className="w-4 h-4 text-amber-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[13px] font-medium text-[#1F1F1F] mb-1">
                  Test Mode (Dry Run)
                </h3>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed max-w-xs">
                  Preview classification without moving files. Safe for testing.
                </p>
              </div>
            </div>
            <button
              onClick={onToggleDryRun}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200
                ${status.dryRun ? 'bg-amber-500' : 'bg-[#E5E5E5]'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${status.dryRun ? 'translate-x-5.5' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          {/* Undo Last Action */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={onUndo}
              className="
                w-full flex items-center gap-3 px-4 py-3 
                bg-[#F5F5F5] hover:bg-[#EBEBEB] 
                border border-[#E5E5E5] rounded-lg
                transition-colors duration-150
              "
            >
              <Undo2 className="w-4 h-4 text-[#6B6B6B]" strokeWidth={2} />
              <div className="flex-1 text-left">
                <h3 className="text-[13px] font-medium text-[#1F1F1F]">
                  Undo Last Action
                </h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  Move the last screenshot back to Desktop
                </p>
              </div>
            </button>
          </div>

          {/* Connection Status */}
          <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
            <h3 className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">
              Status
            </h3>
            
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
              <span className="text-[#1F1F1F]">Backend Connected</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              {ollamaOnline === null ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span className="text-[#6B6B6B]">Checking Ollama...</span>
                </>
              ) : ollamaOnline ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                  <span className="text-[#1F1F1F]">Ollama Running (AI enabled)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-amber-600" strokeWidth={2} />
                  <span className="text-[#1F1F1F]">Ollama Offline (using rules only)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-[#FAFAFA] border-t border-[#E5E5E5] rounded-b-xl">
          <p className="text-[11px] text-[#9B9B9B] text-center">
            SnapSort v1.0.0 · 100% Offline · Privacy-First
          </p>
        </div>
      </div>
    </div>
  );
}
