import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProcessingToastProps {
    fileName: string;
    onComplete?: () => void;
}

export default function ProcessingToast({ fileName, onComplete }: ProcessingToastProps) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    setTimeout(() => {
                        onComplete?.();
                    }, 1500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 w-80 bg-[#1e293b] border-slate rounded-lg p-4 shadow-2xl"
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : (
                        <Loader2 className="w-5 h-5 text-[#10b981] animate-spin" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#f1f5f9] mb-1">
                        {isComplete ? 'Processing Complete' : 'Processing Screenshot'}
                    </h4>
                    <p className="text-xs text-[#94a3b8] truncate mb-3">{fileName}</p>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        />
                    </div>

                    {!isComplete && (
                        <p className="text-xs text-[#94a3b8] mt-2">
                            Running OCR & AI classification...
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

interface ProcessingToastContainerProps {
    toasts: Array<{ id: string; fileName: string }>;
    onRemove: (id: string) => void;
}

export function ProcessingToastContainer({
    toasts,
    onRemove,
}: ProcessingToastContainerProps) {
    return (
        <AnimatePresence>
            {toasts.map((toast, index) => (
                <motion.div
                    key={toast.id}
                    style={{ bottom: `${24 + index * 120}px` }}
                    className="fixed right-6"
                >
                    <ProcessingToast
                        fileName={toast.fileName}
                        onComplete={() => onRemove(toast.id)}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    );
}
