/**
 * React hook for SnapSort state management
 * Uses simple polling - no WebSockets, no overengineering
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/snapsort';

const POLL_INTERVAL = 2000; // Poll every 2 seconds

export function useSnapSort() {
  const [history, setHistory] = useState<api.HistoryEntry[]>([]);
  const [status, setStatus] = useState<api.ConfigStatus>({
    monitoring: true,
    dryRun: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    }
  }, []);

  // Fetch status
  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    }
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([fetchHistory(), fetchStatus()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [fetchHistory, fetchStatus]);

  // Poll for updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHistory();
      fetchStatus();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchHistory, fetchStatus]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(async () => {
    try {
      const newValue = !status.monitoring;
      await api.setMonitoring(newValue);
      setStatus((prev) => ({ ...prev, monitoring: newValue }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle monitoring');
    }
  }, [status.monitoring]);

  // Toggle dry-run
  const toggleDryRun = useCallback(async () => {
    try {
      const newValue = !status.dryRun;
      await api.setDryRun(newValue);
      setStatus((prev) => ({ ...prev, dryRun: newValue }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle dry-run');
    }
  }, [status.dryRun]);

  // Undo last action
  const undo = useCallback(async () => {
    try {
      const result = await api.undoLast();
      if (result.success) {
        await fetchHistory(); // Refresh history after undo
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to undo');
      return { success: false, undone: null };
    }
  }, [fetchHistory]);

  // Get screenshots for gallery
  const screenshots = api.historyToScreenshots(history);

  // Get category counts
  const categoryCounts = api.getCategoryCounts(history);

  return {
    screenshots,
    categoryCounts,
    status,
    loading,
    error,
    toggleMonitoring,
    toggleDryRun,
    undo,
    refresh: fetchHistory,
  };
}
