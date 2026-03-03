import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ScreenshotGallery from './components/ScreenshotGallery';
import StatusBar from './components/StatusBar';
import { useSnapSort } from './hooks/useSnapSort';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  
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

  // Filter screenshots based on active category
  const filteredScreenshots =
    activeCategory === 'all'
      ? screenshots
      : screenshots.filter((s) => s.category === activeCategory);

  // Build categories for sidebar
  const categories = [
    { id: 'all', name: 'All Screenshots', icon: 'Grid3x3', count: categoryCounts.all },
    { id: 'code', name: 'Code', icon: 'Code2', count: categoryCounts.code },
    { id: 'error', name: 'Errors', icon: 'AlertCircle', count: categoryCounts.error },
    { id: 'chat', name: 'Chat', icon: 'MessageSquare', count: categoryCounts.chat },
    { id: 'ui', name: 'UI Design', icon: 'Palette', count: categoryCounts.ui },
    { id: 'document', name: 'Documents', icon: 'FileText', count: categoryCounts.document },
    { id: 'other', name: 'Other', icon: 'Folder', count: categoryCounts.other },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#94a3b8]">Connecting to SnapSort...</p>
        </div>
      </div>
    );
  }

  if (error && screenshots.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-[#f1f5f9] mb-2">Backend Not Running</h2>
          <p className="text-[#94a3b8] mb-4">{error}</p>
          <p className="text-sm text-[#64748b]">
            Make sure the NestJS backend is running on port 3000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isMonitoring={status.monitoring}
        isDryRun={status.dryRun}
        onToggleMonitoring={toggleMonitoring}
        onToggleDryRun={toggleDryRun}
        onUndo={undo}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ScreenshotGallery 
          screenshots={filteredScreenshots}
          isMonitoring={status.monitoring}
        />
      </div>

      <StatusBar 
        backendConnected={!error}
        totalScreenshots={categoryCounts.all}
      />

      {error && (
        <div className="fixed bottom-14 right-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
