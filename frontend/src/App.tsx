import { useEffect, useState } from "react";

interface HistoryItem {
  category: string;
  newPath: string;
}

export default function App() {
  const [dryRun, setDryRun] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function toggleDryRun() {
    await fetch("http://localhost:3000/config/dry-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !dryRun }),
    });
    setDryRun(!dryRun);
  }

  async function loadHistory() {
    const res = await fetch("http://localhost:3000/history");
    const data = await res.json();
    setHistory(data.slice(-5).reverse());
  }

  async function undoLast() {
    await fetch("http://localhost:3000/history/undo", {
      method: "POST",
    });
    loadHistory();
  }

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[380px] bg-white rounded-xl shadow-sm border p-5">
        <h1 className="text-lg font-semibold">SnapSort</h1>
        <p className="text-sm text-gray-500">Smart screenshot organization</p>

        <div className="mt-6">
          <h2 className="text-sm font-medium mb-2">Automation</h2>

          <button
            onClick={toggleDryRun}
            className={`w-full px-3 py-2 rounded-md text-sm border
              ${dryRun ? "bg-gray-100 text-gray-700" : "bg-black text-white"}`}
          >
            {dryRun ? "Disable Dry Run" : "Enable Dry Run"}
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium mb-2">Recent Activity</h2>

          <div className="space-y-2 text-sm">
            {history.length === 0 && (
              <p className="text-gray-400">No recent actions</p>
            )}

            {history.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700">
                <span className="capitalize">{item.category}</span>
                <span className="truncate max-w-[200px] text-gray-400">
                  {item.newPath.split("/").pop()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={undoLast}
          className="mt-6 w-full text-sm border rounded-md py-2 hover:bg-gray-50"
        >
          Undo Last Action
        </button>
      </div>
    </div>
  );
}
