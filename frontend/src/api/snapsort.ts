/**
 * SnapSort API Client
 * Simple, no-nonsense API layer for frontend-backend communication
 */

const API_BASE = 'http://localhost:3000';

export interface HistoryEntry {
  originalPath: string;
  newPath: string;
  category: string;
  timestamp: number;
}

export interface ConfigStatus {
  monitoring: boolean;
  dryRun: boolean;
}

export interface Screenshot {
  id: string;
  fileName: string;
  category: string;
  timestamp: number;
  originalPath: string;
  newPath: string;
}

/**
 * Get current configuration status
 */
export async function getStatus(): Promise<ConfigStatus> {
  const response = await fetch(`${API_BASE}/config/status`);
  if (!response.ok) throw new Error('Failed to fetch status');
  return response.json();
}

/**
 * Toggle monitoring on/off
 */
export async function setMonitoring(enabled: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/config/monitoring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) throw new Error('Failed to set monitoring');
}

/**
 * Toggle dry-run mode on/off
 */
export async function setDryRun(enabled: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/config/dry-run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) throw new Error('Failed to set dry-run');
}

/**
 * Get history of all processed screenshots
 */
export async function getHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

/**
 * Undo the last action
 */
export async function undoLast(): Promise<{ success: boolean; undone: HistoryEntry | null }> {
  const response = await fetch(`${API_BASE}/history/undo`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to undo');
  return response.json();
}

/**
 * Convert history entries to screenshot format for gallery display
 */
export function historyToScreenshots(history: HistoryEntry[]): Screenshot[] {
  return history.map((entry, index) => ({
    id: `${entry.timestamp}-${index}`,
    fileName: entry.newPath.split('/').pop() || 'unknown.png',
    category: entry.category,
    timestamp: entry.timestamp,
    originalPath: entry.originalPath,
    newPath: entry.newPath,
  }));
}

/**
 * Get category counts from history
 */
export function getCategoryCounts(history: HistoryEntry[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: history.length,
    code: 0,
    error: 0,
    chat: 0,
    ui: 0,
    document: 0,
    other: 0,
  };

  history.forEach((entry) => {
    if (counts[entry.category] !== undefined) {
      counts[entry.category]++;
    }
  });

  return counts;
}
