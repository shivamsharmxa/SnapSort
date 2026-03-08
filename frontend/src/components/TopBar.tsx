/**
 * TopBar - Clean, minimal toolbar
 * Search + status + settings (macOS-style)
 */

import { Search, Settings, Circle } from 'lucide-react';

interface TopBarProps {
  isMonitoring: boolean;
  isDryRun: boolean;
  onOpenSettings: () => void;
}

export default function TopBar({ isMonitoring, isDryRun, onOpenSettings }: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-[#E5E5E5] flex items-center px-4 gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search screenshots..."
            className="
              w-full h-8 pl-9 pr-3 
              bg-[#F5F5F5] border border-[#E5E5E5] 
              rounded-md
              text-[13px] text-[#1F1F1F] placeholder-[#9B9B9B]
              focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3]
              transition-all duration-150
            "
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Dry Run Badge */}
        {isDryRun && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">
            <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-medium text-amber-700">
              Test Mode
            </span>
          </div>
        )}

        {/* Monitoring Status */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#E5E5E5] rounded-md">
          <Circle 
            className={`w-2.5 h-2.5 ${
              isMonitoring 
                ? 'fill-green-500 text-green-500' 
                : 'fill-slate-400 text-slate-400'
            }`}
          />
          <span className="text-[11px] font-medium text-[#6B6B6B]">
            {isMonitoring ? 'Monitoring' : 'Paused'}
          </span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="
            w-8 h-8 flex items-center justify-center
            bg-white border border-[#E5E5E5] rounded-md
            hover:bg-[#F5F5F5] hover:border-[#D0D0D0]
            transition-all duration-150
          "
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 text-[#6B6B6B]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
