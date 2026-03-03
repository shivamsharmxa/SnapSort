import { FolderOpen, Zap } from 'lucide-react';

interface EmptyStateProps {
  isMonitoring: boolean;
}

export default function EmptyState({ isMonitoring }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-[#64748b]" />
      </div>

      <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">
        No Screenshots Yet
      </h2>

      {isMonitoring ? (
        <>
          <p className="text-[#94a3b8] mb-6 max-w-md">
            SnapSort is actively monitoring your Desktop for new screenshots.
            Take a screenshot and watch it get organized automatically!
          </p>

          <div className="bg-[#1e293b] border border-slate-700 rounded-lg px-6 py-4 max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-sm font-medium text-[#10b981]">
                Monitoring Active
              </span>
            </div>

            <div className="space-y-2 text-left text-sm text-[#94a3b8]">
              <div className="flex items-start gap-2">
                <span className="text-[#10b981]">→</span>
                <span>Take a screenshot (⌘⇧4 on Mac)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#10b981]">→</span>
                <span>OCR reads the content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#10b981]">→</span>
                <span>AI classifies and renames it</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#10b981]">→</span>
                <span>Appears here in ~2 seconds</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-[#94a3b8] mb-6 max-w-md">
            Monitoring is paused. Click the "Monitoring" button in the header to start watching for screenshots.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-6 py-4 max-w-md">
            <p className="text-sm text-amber-400">
              Click <strong>Monitoring</strong> in the header to resume
            </p>
          </div>
        </>
      )}
    </div>
  );
}
