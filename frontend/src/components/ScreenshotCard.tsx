/**
 * ScreenshotCard - Finder-style file card
 * Clean, minimal, with soft hover effect
 */

import { FileImage, Clock, Tag } from 'lucide-react';
import { useState } from 'react';

interface Screenshot {
  id: string;
  fileName: string;
  category: string;
  timestamp: number;
  originalPath: string;
  newPath: string;
}

interface ScreenshotCardProps {
  screenshot: Screenshot;
}

export default function ScreenshotCard({ screenshot }: ScreenshotCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    code: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    error: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    chat: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    ui: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    document: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    other: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  };

  const colors = categoryColors[screenshot.category] || categoryColors.other;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white border border-[#E8E8E8] rounded-lg overflow-hidden
        transition-all duration-150 ease-in-out cursor-pointer
        ${isHovered ? 'shadow-[0_2px_8px_rgba(0,0,0,0.12)] border-[#D0D0D0]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.08)]'}
      `}
    >
      {/* Thumbnail Area */}
      <div className="aspect-video bg-[#FAFAFA] flex items-center justify-center border-b border-[#E8E8E8] relative group overflow-hidden">
        {/* Actual Screenshot Image */}
        <img
          src={`http://localhost:3000/screenshots/image/${encodeURIComponent(screenshot.fileName)}`}
          alt={screenshot.fileName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
        
        {/* Fallback Icon (hidden by default, shown on image error) */}
        <div className="hidden absolute inset-0 flex items-center justify-center bg-[#FAFAFA]">
          <FileImage className="w-12 h-12 text-[#D0D0D0]" strokeWidth={1.5} />
        </div>
        
        {/* Hover Overlay - Show File Path */}
        {isHovered && (
          <div className="absolute inset-0 bg-white/95 p-3 flex flex-col justify-center text-[11px] leading-relaxed">
            <p className="font-medium text-[#1F1F1F] mb-1">File Path:</p>
            <p className="text-[#6B6B6B] break-all line-clamp-3">
              {screenshot.newPath}
            </p>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 space-y-2">
        {/* Filename */}
        <h3 
          className="text-[13px] font-medium text-[#1F1F1F] truncate" 
          title={screenshot.fileName}
        >
          {screenshot.fileName}
        </h3>

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-[11px]">
          {/* Time */}
          <div className="flex items-center gap-1 text-[#9B9B9B]">
            <Clock className="w-3 h-3" strokeWidth={2} />
            <span>{formatTime(screenshot.timestamp)}</span>
          </div>

          {/* Category Badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${colors.bg} ${colors.border} border`}>
            <Tag className={`w-3 h-3 ${colors.text}`} strokeWidth={2} />
            <span className={`font-medium ${colors.text} capitalize`}>
              {screenshot.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
