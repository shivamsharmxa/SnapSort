# SnapSort - Product Hunt Launch Strategy

## 🎯 1. V1 MUST-HAVES for Product Hunt Launch

### ✅ **Include (Core Value Props)**
1. ✓ Auto-detection - Working
2. ✓ Smart classification - Working (needs tuning)
3. ✓ Auto-rename + organize - **JUST IMPLEMENTED** 
4. ✓ Undo last action - Working
5. ⚠️ Live monitoring toggle - Add this (on/off switch)
6. ⚠️ Real-time toast notifications - Mock exists, needs backend integration
7. ⚠️ Category filtering - Mock exists, needs backend integration
8. ⚠️ Settings panel - Add: dry-run toggle, Ollama connection status
9. ⚠️ About/Help section - Quick start guide
10. ⚠️ Error handling UI - Show when Ollama is offline

### ❌ **Exclude (Future versions)**
- Bulk operations
- Custom categories
- Search functionality
- Export features
- Cloud sync
- Mobile companion
- Advanced AI model selection
- Batch undo
- Custom naming templates
- Statistics/analytics dashboard

**Bottom line:** Ship a focused tool that does ONE thing exceptionally well: "Take a screenshot, it organizes itself."

---

## 📝 2. Smart Filename Generation ✅ IMPLEMENTED

### **What We Built**
A hybrid AI + rule-based filename generator that creates descriptive, filesystem-safe names.

### **Examples from Test Run**

| Category | OCR Text | Generated Filename |
|----------|----------|-------------------|
| Code | `const handleSubmit = async () => {` | `code_handle_submit_1347.png` |
| Code | `function calculateTotal(items)` | `code_calculate_total_1347.png` |
| Error | `TypeError: Cannot read properties` | `error_typeerror_cannot_read_1347.png` |
| Error | `RuntimeException: Database failed` | `error_exception_runtime_database_1347.png` |
| Chat | `Hey are we deploying today?` | `chat_hey_are_deploying_today_1347.png` |
| UI | `Login page with username fields` | `ui_login_page_with_username_1347.png` |
| Document | `Ethereum gas fees explained` | `doc_ethereum_gas_fees_are_required_1347.png` |
| Unknown | `!!!@#$%^&*()` | `other_screenshot_1347.png` |

### **Key Features**
- **AI-First:** Tries Ollama (Mistral) for intelligent naming
- **Smart Fallback:** Falls back to rule-based if AI is unavailable
- **Always Works:** Never fails, always generates a valid filename
- **Filesystem-Safe:** Lowercase, underscores only, max 50 chars
- **Time-Stamped:** HHMM suffix for uniqueness
- **Category-Aware:** Different extraction strategies per category

### **Architecture**
```
FilenameService
├── generateFilename() - Main entry point
├── generateWithAI() - Calls Ollama with timeout
├── generateWithRules() - Fallback logic
├── extractCodeKeywords() - Code-specific extraction
├── extractErrorKeywords() - Error-specific extraction
├── extractChatKeywords() - Chat-specific extraction
└── sanitize() - Ensures filesystem safety
```

---

## 🧠 3. Improved Classification System

### **Current State**
- Rule-based classifier: Basic keyword matching
- AI classifier: Calls Ollama Mistral
- Decision service: Combines both with confidence scores

### **Proposed Improvements**

#### **A. Enhanced Rule-Based Classifier**
Add confidence scores to rules:

```typescript
classify(text: string): { category: string; confidence: number } {
  const lower = text.toLowerCase();

  // High confidence rules (>0.85)
  if (this.isCodeStrong(lower)) return { category: 'code', confidence: 0.9 };
  if (this.isErrorStrong(lower)) return { category: 'error', confidence: 0.9 };

  // Medium confidence rules (0.6-0.85)
  if (this.isCode(lower)) return { category: 'code', confidence: 0.7 };
  if (this.isError(lower)) return { category: 'error', confidence: 0.75 };
  if (this.isChat(lower)) return { category: 'chat', confidence: 0.65 };

  // Low confidence
  if (this.isText(lower)) return { category: 'document', confidence: 0.5 };

  return { category: 'unknown', confidence: 0.1 };
}

private isCodeStrong(text: string): boolean {
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /const\s+\w+\s*=/,
    /class\s+\w+/,
    /import\s+.*from/,
    /export\s+(default|const)/
  ];
  return codePatterns.some(p => p.test(text));
}

private isErrorStrong(text: string): boolean {
  return /Error:|Exception:|Traceback|at\s+.*:\d+:\d+/.test(text);
}
```

#### **B. Improved Decision Logic**
Use confidence thresholds:

```typescript
decide(ruleResult, aiResult): Decision {
  // Rule-based has high confidence → trust it
  if (ruleResult.confidence >= 0.85) {
    return {
      category: ruleResult.category,
      confidence: ruleResult.confidence,
      source: 'rules'
    };
  }

  // AI is available and confident → use it
  if (aiResult && aiResult.confidence >= 0.7) {
    return {
      category: aiResult.category,
      confidence: aiResult.confidence,
      source: 'ai'
    };
  }

  // Both agree → boost confidence
  if (ruleResult.category === aiResult?.category) {
    return {
      category: ruleResult.category,
      confidence: Math.max(ruleResult.confidence, 0.8),
      source: 'hybrid'
    };
  }

  // Use whichever is more confident
  const winner = ruleResult.confidence >= (aiResult?.confidence || 0)
    ? ruleResult
    : aiResult;

  return {
    category: winner.category,
    confidence: winner.confidence,
    source: winner === ruleResult ? 'rules' : 'ai'
  };
}
```

#### **C. Reduce "Unknown" Results**
Add more categories or use broader matching:

```typescript
// Instead of returning 'unknown', try to guess intelligently
private smartFallback(text: string): string {
  if (text.length < 10) return 'ui'; // Short text → probably UI label
  if (text.split('\n').length > 3) return 'document'; // Multi-line → document
  if (/\d{1,2}:\d{2}/.test(text)) return 'chat'; // Has time → chat
  if (/https?:\/\//.test(text)) return 'ui'; // Has URL → UI screenshot
  
  return 'document'; // Default to document instead of unknown
}
```

---

## 🔌 4. Frontend-Backend Integration (Minimal for PH)

### **Priority 1: Connect Real Data**
Replace mock data with actual API calls:

```typescript
// frontend/src/api/screenshots.ts
const API_BASE = 'http://localhost:3000';

export async function fetchScreenshots(): Promise<Screenshot[]> {
  const response = await fetch(`${API_BASE}/screenshots`);
  return response.json();
}

export async function toggleMonitoring(enabled: boolean): Promise<void> {
  await fetch(`${API_BASE}/config/monitoring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
}

export async function undoLast(): Promise<void> {
  await fetch(`${API_BASE}/history/undo`, { method: 'POST' });
}
```

### **Priority 2: WebSocket for Real-Time Updates**
Add simple WebSocket for live notifications:

```typescript
// backend: Add WebSocket gateway
@WebSocketGateway()
export class ScreenshotGateway {
  @WebSocketServer()
  server: Server;

  notifyNewScreenshot(screenshot: Screenshot) {
    this.server.emit('screenshot:new', screenshot);
  }

  notifyProcessing(filename: string) {
    this.server.emit('screenshot:processing', { filename });
  }
}

// frontend: Connect to WebSocket
const socket = io('http://localhost:3000');

socket.on('screenshot:processing', (data) => {
  showToast(data.filename);
});

socket.on('screenshot:new', (screenshot) => {
  addToGallery(screenshot);
});
```

### **Priority 3: Add Missing Backend Endpoints**

```typescript
// GET /screenshots - List all organized screenshots
@Get('screenshots')
async getScreenshots(@Query('category') category?: string) {
  return this.screenshotService.findAll(category);
}

// POST /config/monitoring - Toggle monitoring
@Post('config/monitoring')
async setMonitoring(@Body() body: { enabled: boolean }) {
  return this.configService.setMonitoring(body.enabled);
}

// GET /config/status - Get Ollama status
@Get('config/status')
async getStatus() {
  const ollamaOnline = await this.aiService.checkHealth();
  return {
    monitoring: this.configService.isMonitoring(),
    ollamaOnline,
    dryRun: this.configService.isDryRun()
  };
}

// POST /history/undo - Undo last action
@Post('history/undo')
async undo() {
  return this.historyService.undoLast();
}
```

### **What NOT to Build**
- Complex state management (Redux/Zustand) - Use React Query instead
- Advanced routing - Single page is fine
- User authentication - Not needed for v1
- Database - JSON files are sufficient
- API versioning - Premature optimization

---

## 🎨 5. Product Hunt Copy

### **Tagline** (60 chars max)
> "Your screenshots, organized automatically. 100% offline."

**Alternatives:**
- "Smart screenshot organizer that never touches the cloud"
- "Auto-organize screenshots with local AI. No cloud needed."
- "Screenshot chaos? Solved. Privacy intact."

### **Short Description** (~160 chars)
> "SnapSort detects, reads, and organizes your screenshots automatically using local AI. Works offline, respects your privacy, and never uploads anything."

### **Long Description** (3–4 paragraphs)

**Paragraph 1: The Problem**
Screenshots are essential for modern work, but they pile up fast. You take 247 screenshots a month, each named "Screenshot 2024-03-02 at 14.23.45.png", scattered across folders, impossible to find when you need them. Sound familiar?

**Paragraph 2: The Solution**
SnapSort solves this automatically. The moment you take a screenshot, it reads the content with OCR, classifies it using local AI (Ollama + Mistral), gives it a descriptive name, and files it into the right folder. Code snippets go to `/Code`, error messages to `/Errors`, chat screenshots to `/Chat`. All in under 2 seconds.

**Paragraph 3: Privacy-First**
Unlike cloud-based tools, SnapSort runs 100% offline. Your screenshots never leave your laptop. No uploads, no APIs, no tracking. It uses Tesseract for OCR and Ollama (open-source local LLM) for classification. Your data stays yours.

**Paragraph 4: How It Works**
Install SnapSort, install Ollama, and you're done. Take a screenshot → it appears in your gallery → gets auto-organized. Made a mistake? Hit "Undo" and it moves back. Want to test it first? Enable "Dry Run" mode. It's that simple.

### **"Why We Built This" Story**

**Title:** "I was drowning in 3,000 screenshots"

As a developer, I take screenshots constantly. Code snippets. Error messages. Slack conversations. Design mockups. But finding them later? Impossible.

I'd spend 10 minutes scrolling through "Screenshot 2024-01-15 at..." trying to find that one API error from last week. Generic names. No context. Total chaos.

Cloud tools like Dropbox could organize files, but I didn't want my error messages and private conversations uploaded to someone's server. I needed something local, fast, and smart.

So I built SnapSort.

It watches for new screenshots, reads them with OCR, and uses a local AI model (Mistral via Ollama) to classify them. Then it renames them with *actual descriptions* and moves them to category folders.

Instead of `Screenshot 2024-03-02 at 14.23.45.png`, I get `error_typeerror_undefined_1423.png` in my `/Errors` folder.

The best part? **Everything happens offline.** No cloud uploads. No API keys. No tracking. SnapSort uses Ollama (local LLM) + Tesseract OCR, so nothing ever leaves my laptop.

If you're drowning in screenshot chaos like I was, give SnapSort a try. It's like having a personal archivist who never sleeps.

— *[Your Name], Indie Maker*

---

## 📸 6. Screenshot Ideas for PH Gallery

### **Screenshot 1: Hero Shot** ⭐ First Impression
- Main UI with organized screenshot grid (dark theme)
- Left sidebar: Categories with counts (Code: 47, Errors: 12, Chat: 23)
- Top right: "Monitoring: ON" badge
- Bottom right: Processing toast notification appearing
- Clean, professional, shows value immediately

### **Screenshot 2: Before/After Split** ⭐ Problem → Solution
- **LEFT:** Messy Desktop folder with filenames like:
  - `Screenshot 2024-03-02 at 14.23.45.png`
  - `Screenshot 2024-03-02 at 14.45.12.png`
  - `Screenshot 2024-03-02 at 15.01.33.png`
- **RIGHT:** Organized folders with smart names:
  - `Code/code_handle_submit_1423.png`
  - `Errors/error_typeerror_undefined_1445.png`
  - `Chat/chat_deployment_question_1501.png`
- Giant arrow: "SnapSort" with sparkle emoji

### **Screenshot 3: Live Classification** ⭐ Show the Magic
- Screenshot being processed in real-time
- OCR text overlay: "const handleSubmit = async () => {"
- Classification badge: "Code - 92% confidence"
- Destination preview: "→ /Code/code_handle_submit_1430.png"
- "100% Offline" badge in corner

### **Screenshot 4: Settings Panel** ⭐ Trust & Control
- Clean settings UI:
  - Toggle: "Monitoring" (ON)
  - Toggle: "Dry Run Mode" (OFF)
  - Status: "Ollama Connected ✓"
  - Button: "Undo Last Action"
- Privacy badge: "No Cloud · No Tracking · No Uploads"

### **Screenshot 5: Real Filenames** ⭐ Show Value
- Finder/Explorer window showing organized folders:
  - `/Code` folder with 47 files
  - `/Errors` folder with 12 files
  - `/Chat` folder with 23 files
- Zoom in on actual filenames:
  - `code_fetch_user_data_0945.png`
  - `error_cannot_connect_database_1122.png`
  - `chat_meeting_notes_discussion_1534.png`
- Text overlay: "Descriptive names, not timestamps"

### **Screenshot 6: Quick Stats** (Optional)
- Simple dashboard showing:
  - "247 screenshots organized this month"
  - Category breakdown (pie chart or bars)
  - "~4 hours saved searching"
- Minimal, not overdesigned

---

## 🎥 7. Demo Video Script (30–45 seconds)

### **Scene-by-Scene Breakdown**

**[0:00-0:05] Opening - The Problem**
- Screen recording: Desktop with messy screenshot folder
- Voiceover: *"Sound familiar? Screenshots everywhere, impossible to find anything."*
- Visual: Quick scroll through generic filenames

**[0:06-0:10] Problem Amplified**
- Quick montage: 
  - Take screenshot of code → disappears into folder
  - Take screenshot of error → lost immediately
  - Try to search → can't find it
- Text overlay: *"247 screenshots. 247 generic names."*

**[0:11-0:15] Solution Introduction**
- SnapSort app opens (smooth fade-in)
- Clean UI, dark theme, professional
- Text overlay: *"Meet SnapSort"*
- Subtitle: *"Your screenshots, organized automatically"*

**[0:16-0:25] The Magic Demo**
- Take screenshot of code (`const fetchUser...`)
- Toast notification appears: "Processing..."
- Show OCR overlay extracting text (highlight effect)
- Classification: "Code - 92%" (green badge)
- File appears in gallery with name: `code_fetch_user_0945.png`
- Auto-moves to `/Code` folder
- Voiceover: *"OCR reads it. AI classifies it. Smart renaming. All in 2 seconds."*

**[0:26-0:32] More Examples (Fast Cuts)**
- Error screenshot → classified → `error_typeerror_1430.png`
- Chat screenshot → classified → `chat_deployment_question_1445.png`
- UI screenshot → classified → `ui_login_page_1502.png`
- Text overlays for each: "Error" / "Chat" / "UI Design"

**[0:33-0:37] Key Differentiator**
- Settings panel appears
- Highlight "Ollama Connected ✓"
- Visual: Laptop with lock icon
- Text overlays (stagger): 
  - "100% Offline"
  - "No Cloud Uploads"
  - "Privacy-First"
- Voiceover: *"Everything happens locally. Your data never leaves your laptop."*

**[0:38-0:42] Before/After Comparison**
- Split screen:
  - LEFT: Messy folder (faded, red tint)
  - RIGHT: Organized folders (bright, green checkmarks)
- Voiceover: *"Stop searching. Start organizing."*

**[0:43-0:45] Call to Action**
- SnapSort logo center screen
- Text: **"Available Now for Mac & Windows"**
- Text: **"Try it free → snapsort.app"**
- Product Hunt logo appears

### **Production Tips**
- **Recording:** Use ScreenFlow, Camtasia, or OBS Studio
- **Music:** Upbeat productivity music (check Epidemic Sound or Artlist)
- **Text:** Use clean sans-serif font (Inter, SF Pro, or Montserrat)
- **Pace:** Keep cuts tight, max 2-3 seconds per scene
- **Authenticity:** Use REAL screenshots being processed (not fake)
- **Voice:** Professional but friendly (consider hiring on Fiverr if needed)
- **Export:** 1080p MP4, max 10MB for PH upload

---

## ✅ Final Launch Checklist

### **Week 1: Core Features (5-7 days)**
- [x] Improve filename generation (AI + rules) ✅ **DONE**
- [ ] Add confidence scores to classifier
- [ ] Improve decision logic (threshold-based)
- [ ] Add AI timeout + graceful degradation
- [ ] Connect frontend to backend (replace mock data)
- [ ] Add WebSocket for real-time updates
- [ ] Add settings panel (monitoring toggle, dry-run, Ollama status)
- [ ] Add "Undo" button to UI
- [ ] Test end-to-end with 50+ real screenshots

### **Week 2: Polish + Launch Prep (5-7 days)**
- [ ] Create demo video (30-45s)
- [ ] Take 6 high-quality screenshots
- [ ] Write PH description (use template above)
- [ ] Test on both Mac and Windows
- [ ] Create simple landing page (optional but recommended)
- [ ] Add "About" section in app with quick start guide
- [ ] Add error handling UI (show when Ollama is offline)
- [ ] Final bug testing
- [ ] Submit to Product Hunt (Tuesday-Thursday launch recommended)

### **Pre-Launch Day**
- [ ] Set up Product Hunt account (if not already)
- [ ] Prepare social media posts
- [ ] Notify email list (if you have one)
- [ ] Reach out to micro-influencers in dev/productivity space
- [ ] Schedule launch for 12:01 AM PST (Product Hunt resets daily)

### **Launch Day**
- [ ] Post to Twitter, LinkedIn, Reddit (r/SideProject, r/productivity)
- [ ] Respond to ALL comments on PH within 1 hour
- [ ] Share updates throughout the day
- [ ] Thank supporters personally

---

## 🎯 Key Messaging for Product Hunt

### **What Makes SnapSort Different**
1. **100% Offline** - No cloud uploads, ever. Your data stays on your laptop.
2. **Zero Configuration** - Install → Works (just needs Ollama for AI)
3. **Smart Renaming** - Not just folders, but descriptive filenames
4. **Hybrid Intelligence** - Fast rules + smart AI fallback
5. **Instant Undo** - Made a mistake? One click fixes it

### **Who Is This For**
✅ **Perfect for:**
- Developers (code snippets, error messages, API docs)
- Designers (UI inspiration, mockups, design systems)
- Remote workers (meeting notes, Slack/Teams screenshots)
- Privacy-conscious users (journalists, researchers, security professionals)
- Power users who take 10+ screenshots/day

❌ **NOT for:**
- People who take <5 screenshots per week (overkill)
- Teams needing cloud collaboration (it's offline-only)
- Users unwilling to install Ollama (required for AI features)

### **Common Objections & Responses**

**Q: "Why not just use Dropbox/Google Photos?"**
A: They upload everything to the cloud. SnapSort is 100% offline and privacy-first.

**Q: "Isn't installing Ollama complicated?"**
A: It's one command: `brew install ollama` on Mac or download from ollama.ai. Takes 2 minutes.

**Q: "What if I don't want AI?"**
A: SnapSort has rule-based classification as fallback. It works without AI, just less accurate.

**Q: "Can I customize categories?"**
A: Not in v1 (we're avoiding scope creep), but it's on the roadmap for v2.

**Q: "Does it work on Windows/Linux?"**
A: Yes! Tauri is cross-platform. Currently tested on Mac and Windows.

---

## 📊 Success Metrics for PH Launch

### **Good Launch:**
- 100+ upvotes
- Top 10 product of the day
- 50+ comments
- 500+ website visits

### **Great Launch:**
- 300+ upvotes
- Top 5 product of the day
- 100+ comments
- 1,000+ website visits
- Featured in PH newsletter

### **Epic Launch:**
- 500+ upvotes
- #1 product of the day
- 200+ comments
- 5,000+ website visits
- Press coverage (TechCrunch, The Verge, Hacker News front page)

---

## 🚀 Next Steps (Priority Order)

1. **Implement confidence-based classification** (2-3 hours)
2. **Connect frontend to backend** (4-6 hours)
3. **Add WebSocket for real-time updates** (2-3 hours)
4. **Build settings panel UI** (3-4 hours)
5. **Create demo video** (4-6 hours)
6. **Take marketing screenshots** (2 hours)
7. **Write PH submission** (1 hour)
8. **Final testing** (4 hours)
9. **Launch! 🎉**

---

**Total estimated time: 1-2 weeks**

Good luck with your launch! 🚀
