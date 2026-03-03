import { motion, AnimatePresence } from 'framer-motion';
import ScreenshotCard from './ScreenshotCard';
import EmptyState from './EmptyState';

interface Screenshot {
    id: string;
    fileName: string;
    category: string;
    timestamp: number;
    originalPath: string;
    newPath: string;
}

interface ScreenshotGalleryProps {
    screenshots: Screenshot[];
    isMonitoring?: boolean;
}

export default function ScreenshotGallery({ screenshots, isMonitoring = true }: ScreenshotGalleryProps) {
    if (screenshots.length === 0) {
        return <EmptyState isMonitoring={isMonitoring} />;
    }

    return (
        <div className="flex-1 p-6 overflow-auto">
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {screenshots.map((screenshot) => (
                        <ScreenshotCard key={screenshot.id} screenshot={screenshot} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
