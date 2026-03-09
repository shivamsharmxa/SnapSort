/**
 * AppLayout - Main desktop app container
 * macOS-native window style with rounded corners
 */

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ScreenshotGrid from './ScreenshotGrid';
import SettingsModal from './SettingsModal';
import { useSnapSort } from '../hooks/useSnapSort';

export default function AppLayout() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    screenshots,
    categoryCounts,
    status,
    loading,
    error,
    toggleMonitoring,
    toggleDryRun,
    undo,
  } = useSnapSort();

  // Filter screenshots
  const filteredScreenshots =
    activeCategory === 'all'
      ? screenshots
      : screenshots.filter((s) => s.category === activeCategory);

  // Build categories
  const categories = [
    { id: 'all', name: 'All Files', icon: 'FileStack', count: categoryCounts.all },
    { id: 'code', name: 'Code', icon: 'Code2', count: categoryCounts.code },
    { id: 'error', name: 'Errors', icon: 'AlertCircle', count: categoryCounts.error },
    { id: 'chat', name: 'Chat', icon: 'MessageSquare', count: categoryCounts.chat },
    { id: 'ui', name: 'UI Design', icon: 'Layout', count: categoryCounts.ui },
    { id: 'document', name: 'Documents', icon: 'FileText', count: categoryCounts.document },
    { id: 'other', name: 'Other', icon: 'Folder', count: categoryCounts.other },
  ];

  if (loading) {
    return (
      <div className="h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#E5E5E5] border-t-[#0071E3] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-[#6B6B6B]">Connecting to SnapSort...</p>
        </div>
      </div>
    );
  }

  if (error && screenshots.length === 0) {
    return (
      <div className="h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-[#1F1F1F] mb-2">
            Backend Not Running
          </h2>
          <p className="text-[13px] text-[#6B6B6B] mb-4">{error}</p>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg px-4 py-3 text-left">
            <p className="text-[11px] text-[#6B6B6B]">
              Make sure the NestJS backend is running on port 3000
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main App Window */}
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopBar
          isMonitoring={status.monitoring}
          isDryRun={status.dryRun}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <ScreenshotGrid
            screenshots={filteredScreenshots}
            isMonitoring={status.monitoring}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          status={status}
          onToggleMonitoring={toggleMonitoring}
          onToggleDryRun={toggleDryRun}
          onUndo={undo}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-white border border-red-200 rounded-lg shadow-lg px-4 py-3 max-w-sm">
          <p className="text-[13px] text-red-700">{error}</p>
        </div>
      )}
    </>
  );
}
