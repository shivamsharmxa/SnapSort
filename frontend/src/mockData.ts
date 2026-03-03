export interface Screenshot {
    id: string;
    thumbnail: string;
    category: string;
    ocrText: string;
    timestamp: number;
    fileName: string;
}

export const mockScreenshots: Screenshot[] = [
    {
        id: '1',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'code',
        ocrText: 'const handleSubmit = async (e) => {\n  e.preventDefault();\n  const response = await fetch("/api/users");\n}',
        timestamp: Date.now() - 1000 * 60 * 5,
        fileName: 'screenshot_2026-02-03_14-12.png'
    },
    {
        id: '2',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
        category: 'receipts',
        ocrText: 'RECEIPT\nStarbucks Coffee\nTotal: $12.45\nDate: 02/03/2026',
        timestamp: Date.now() - 1000 * 60 * 15,
        fileName: 'receipt_starbucks.png'
    },
    {
        id: '3',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
        category: 'design',
        ocrText: 'Color Palette\n#0f172a - Deep Charcoal\n#10b981 - Emerald',
        timestamp: Date.now() - 1000 * 60 * 30,
        fileName: 'design_inspiration_01.png'
    },
    {
        id: '4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
        category: 'social',
        ocrText: 'Twitter Thread:\n"Just shipped a new feature! 🚀"\nLikes: 234 | Retweets: 45',
        timestamp: Date.now() - 1000 * 60 * 45,
        fileName: 'twitter_thread.png'
    },
    {
        id: '5',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop',
        category: 'code',
        ocrText: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}',
        timestamp: Date.now() - 1000 * 60 * 60,
        fileName: 'code_snippet_fibonacci.png'
    },
    {
        id: '6',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        category: 'receipts',
        ocrText: 'Amazon Order\nOrder #: 123-4567890\nTotal: $89.99',
        timestamp: Date.now() - 1000 * 60 * 90,
        fileName: 'amazon_receipt.png'
    },
    {
        id: '7',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        category: 'design',
        ocrText: 'UI Mockup - Dashboard\nSidebar Navigation\nCard Grid Layout',
        timestamp: Date.now() - 1000 * 60 * 120,
        fileName: 'ui_mockup_dashboard.png'
    },
    {
        id: '8',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        category: 'social',
        ocrText: 'LinkedIn Post:\n"Excited to announce my new role as Senior Engineer!"',
        timestamp: Date.now() - 1000 * 60 * 150,
        fileName: 'linkedin_post.png'
    }
];

export const categories = [
    { id: 'all', name: 'All Screenshots', icon: 'Grid3x3', count: 8 },
    { id: 'receipts', name: 'Receipts', icon: 'Receipt', count: 2 },
    { id: 'code', name: 'Code', icon: 'Code2', count: 2 },
    { id: 'design', name: 'Design Inspiration', icon: 'Palette', count: 2 },
    { id: 'social', name: 'Social', icon: 'MessageSquare', count: 2 }
];
