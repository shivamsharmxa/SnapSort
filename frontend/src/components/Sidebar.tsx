import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface SidebarProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export default function Sidebar({
    categories,
    activeCategory,
    onCategoryChange,
}: SidebarProps) {
    return (
        <aside className="w-64 glass border-r border-slate p-4 h-screen sticky top-16">
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">
                Smart Folders
            </h2>

            <nav className="space-y-1">
                {categories.map((category) => {
                    const IconComponent = (Icons as any)[category.icon];
                    const isActive = activeCategory === category.id;

                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${isActive
                                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                                : 'border-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]'
                                }`}
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <div className="flex items-center gap-3">
                                <IconComponent className="w-4 h-4" />
                                <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                    ? 'bg-[#10b981]/20 text-[#10b981]'
                                    : 'bg-[#334155] text-[#94a3b8]'
                                    }`}
                            >
                                {category.count}
                            </span>
                        </motion.button>
                    );
                })}
            </nav>
        </aside>
    );
}
