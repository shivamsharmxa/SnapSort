import { motion } from 'framer-motion';
import { Activity, Undo2, FlaskConical } from 'lucide-react';

interface HeaderProps {
    isMonitoring: boolean;
    isDryRun: boolean;
    onToggleMonitoring: () => void;
    onToggleDryRun: () => void;
    onUndo: () => Promise<{ success: boolean; undone: any }>;
}

export default function Header({ 
    isMonitoring, 
    isDryRun,
    onToggleMonitoring,
    onToggleDryRun,
    onUndo,
}: HeaderProps) {
    const handleUndo = async () => {
        const result = await onUndo();
        if (result.success) {
            // Could add a toast notification here
            console.log('Undo successful:', result.undone);
        }
    };

    return (
        <header className="glass border-b border-slate sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SS</span>
                    </div>
                    <h1 className="text-xl font-semibold">SnapSort</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Dry Run Badge */}
                    {isDryRun && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <FlaskConical className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-500">Dry Run</span>
                        </div>
                    )}

                    {/* Undo Button */}
                    <button
                        onClick={handleUndo}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] transition-colors"
                        title="Undo last action"
                    >
                        <Undo2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Undo</span>
                    </button>

                    {/* Monitoring Toggle */}
                    <button onClick={onToggleMonitoring}>
                        <motion.div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-slate cursor-pointer ${
                                isMonitoring ? 'bg-[#10b981]/10' : 'bg-[#1e293b]'
                            }`}
                            animate={
                                isMonitoring
                                    ? {
                                        boxShadow: [
                                            '0 0 20px rgba(16, 185, 129, 0.4)',
                                            '0 0 30px rgba(16, 185, 129, 0.6)',
                                            '0 0 20px rgba(16, 185, 129, 0.4)',
                                        ],
                                    }
                                    : {}
                            }
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Activity
                                className={`w-4 h-4 ${isMonitoring ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}
                            />
                            <span
                                className={`text-sm font-medium ${
                                    isMonitoring ? 'text-[#10b981]' : 'text-[#94a3b8]'
                                }`}
                            >
                                {isMonitoring ? 'Monitoring' : 'Paused'}
                            </span>
                        </motion.div>
                    </button>

                    {/* Settings (Dry Run Toggle) */}
                    <button
                        onClick={onToggleDryRun}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                            isDryRun 
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' 
                                : 'border-slate text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b]'
                        }`}
                        title="Toggle dry-run mode (test without moving files)"
                    >
                        <FlaskConical className="w-4 h-4" />
                        <span className="text-sm font-medium">Test Mode</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
