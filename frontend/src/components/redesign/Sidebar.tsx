/**
 * Sidebar - macOS Finder-style navigation
 * Fixed width, soft gray background, simple icons
 */

import { 
  FileText, 
  Code2, 
  AlertCircle, 
  MessageSquare, 
  Layout, 
  FileStack,
  Folder 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
}

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function Sidebar({ categories, activeCategory, onCategoryChange }: SidebarProps) {
  const categoryIcons: Record<string, any> = {
    all: FileStack,
    code: Code2,
    error: AlertCircle,
    chat: MessageSquare,
    ui: Layout,
    document: FileText,
    other: Folder,
  };

  const categoryColors: Record<string, string> = {
    all: 'text-slate-600',
    code: 'text-blue-600',
    error: 'text-red-600',
    chat: 'text-green-600',
    ui: 'text-purple-600',
    document: 'text-amber-600',
    other: 'text-slate-500',
  };

  return (
    <aside className="w-56 bg-[#F5F5F5] border-r border-[#E5E5E5] flex flex-col">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-[#E5E5E5]">
        <h2 className="text-[13px] font-semibold text-[#1F1F1F] tracking-tight">
          Categories
        </h2>
      </div>

      {/* Category List */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || Folder;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-md
                text-[13px] font-medium
                transition-all duration-150 ease-in-out
                ${
                  isActive
                    ? 'bg-[#E3F2FD] text-[#0071E3]'
                    : 'text-[#1F1F1F] hover:bg-[#EBEBEB]'
                }
              `}
            >
              <Icon 
                className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : categoryColors[category.id]}`}
                strokeWidth={2}
              />
              <span className="flex-1 text-left truncate">
                {category.name}
              </span>
              {category.count > 0 && (
                <span 
                  className={`
                    text-[11px] font-medium px-1.5 py-0.5 rounded
                    ${isActive ? 'text-[#0071E3]/70' : 'text-[#6B6B6B]'}
                  `}
                >
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Privacy Badge (Bottom) */}
      <div className="px-4 py-3 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[11px] font-medium text-green-700">
            100% Offline
          </span>
        </div>
      </div>
    </aside>
  );
}
