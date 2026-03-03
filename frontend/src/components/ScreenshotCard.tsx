import { motion } from 'framer-motion';
import { Clock, Tag, FileImage } from 'lucide-react';

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

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const categoryColors: Record<string, string> = {
        code: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        chat: 'bg-green-500/20 text-green-400 border-green-500/30',
        ui: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        document: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative group"
        >
            <div className="bg-[#1e293b] border-slate rounded-lg overflow-hidden recessed">
                {/* Screenshot Preview Placeholder */}
                <div className="aspect-video bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                        <FileImage className="w-12 h-12 text-[#334155] mx-auto mb-2" />
                        <p className="text-xs text-[#475569]">
                            {screenshot.fileName.split('_')[0]}
                        </p>
                    </div>
                    
                    {/* Hover overlay with file path */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-sm p-4 flex flex-col justify-center"
                    >
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs font-medium text-[#10b981] mb-1">Original Path:</p>
                                <p className="text-xs text-[#64748b] font-mono break-all">
                                    {screenshot.originalPath}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#10b981] mb-1">Moved To:</p>
                                <p className="text-xs text-[#64748b] font-mono break-all">
                                    {screenshot.newPath}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Card Footer */}
                <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#f1f5f9] truncate" title={screenshot.fileName}>
                            {screenshot.fileName}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]" title={formatDate(screenshot.timestamp)}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(screenshot.timestamp)}</span>
                        </div>

                        <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs ${
                                categoryColors[screenshot.category] || categoryColors.other
                            }`}
                        >
                            <Tag className="w-3 h-3" />
                            <span className="capitalize">{screenshot.category}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
