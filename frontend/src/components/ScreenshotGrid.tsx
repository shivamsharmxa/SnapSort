/**
 * ScreenshotGrid - Main content area
 * Finder-style grid layout with clean spacing
 */

import ScreenshotCard from './ScreenshotCard';
import { FolderOpen } from 'lucide-react';

interface Screenshot {
  id: string;
  fileName: string;
  category: string;
  timestamp: number;
  originalPath: string;
  newPath: string;
}

interface ScreenshotGridProps {
  screenshots: Screenshot[];
  isMonitoring: boolean;
}

function EmptyState({ isMonitoring }: { isMonitoring: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
        <FolderOpen className="w-10 h-10 text-[#D0D0D0]" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-semibold text-[#1F1F1F] mb-2">
        No Screenshots Yet
      </h2>

      {isMonitoring ? (
        <div className="max-w-sm space-y-3">
          <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
            SnapSort is monitoring your Desktop. Take a screenshot and it will appear here automatically.
          </p>

          <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg p-4 text-left space-y-2">
            <p className="text-[11px] font-semibold text-[#1F1F1F] mb-2">
              How it works:
            </p>
            <div className="space-y-1.5 text-[11px] text-[#6B6B6B]">
              <p>1. Take a screenshot (⌘⇧4 on Mac)</p>
              <p>2. OCR extracts the text content</p>
              <p>3. AI classifies and renames it</p>
              <p>4. Appears here in ~2 seconds</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-sm">
          <p className="text-[13px] text-[#6B6B6B] mb-3">
            Monitoring is paused. Click the monitoring indicator in the top bar to resume.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            <p className="text-[11px] font-medium text-amber-700">
              Enable monitoring to start organizing screenshots
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScreenshotGrid({ screenshots, isMonitoring }: ScreenshotGridProps) {
  if (screenshots.length === 0) {
    return (
      <main className="flex-1 bg-[#FAFAFA]">
        <EmptyState isMonitoring={isMonitoring} />
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#FAFAFA] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#1F1F1F]">
            {screenshots.length} {screenshots.length === 1 ? 'Screenshot' : 'Screenshots'}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {screenshots.map((screenshot) => (
            <ScreenshotCard key={screenshot.id} screenshot={screenshot} />
          ))}
        </div>
      </div>
    </main>
  );
}
