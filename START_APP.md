# SnapSort - Quick Start Guide

## 🚀 Starting the Application

### Terminal 1: Backend
```bash
cd backend
npm run start:dev
```

**Expected output:**
```
🚀 Backend running on http://localhost:3000
✅ CORS enabled for frontend
🚀 Watcher Service Initialized
👀 Polling folder: /Users/[you]/Desktop
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in 200ms
Local: http://localhost:5173/  (or 5174 if 5173 is busy)
```

### Terminal 3: Ollama (Optional - for AI classification)
```bash
ollama serve
```

Then pull the model if you haven't:
```bash
ollama pull mistral
```

---

## 🧪 Testing

1. **Open the app:** http://localhost:5173 (or 5174)
2. **Take a screenshot** (Cmd+Shift+4 on Mac)
3. **Wait 2-3 seconds**
4. **Check the UI** - should appear with smart filename

### Controls to Test:
- **Monitoring button** (green/pulsing) - Click to pause/resume
- **Test Mode button** - Enable dry-run (files won't move)
- **Undo button** - Reverse last action

### Check These Work:
- Category filtering (click Code, Errors, etc. in sidebar)
- Real filenames (not generic timestamps)
- Hover over card to see file paths

---

## ⚠️ Troubleshooting

### "Backend Not Running" error in UI
```bash
# Check if backend is running
curl http://localhost:3000/config/status

# If not running, restart:
cd backend
npm run start:dev
```

### CORS errors in browser console
Already fixed! If you still see them:
```bash
# Kill old backend
pkill -f "nest start"

# Restart
cd backend
npm run start:dev
```

### Screenshots not detected
- File must contain "Screenshot" or "Screen Shot" in name
- File must be on Desktop
- Monitoring must be ON (green button)

### AI returns "other" for everything
```bash
# Check if Ollama is running
ollama list

# If not, start it:
ollama serve

# Pull model if needed:
ollama pull mistral
```

---

## 📸 Ready for Product Hunt?

Follow **LAUNCH_GUIDE.md** for:
- 6 specific screenshot examples
- Demo video script (30-45s)
- Product Hunt copy templates
- Common objections & responses

---

## 🛑 Stopping the Application

```bash
# Stop backend
pkill -f "nest start"

# Stop frontend
pkill -f "vite"

# Stop Ollama (if running)
pkill ollama
```

---

## 🎯 Current Status

✅ Backend fully integrated  
✅ Frontend connected to real APIs  
✅ CORS enabled  
✅ Smart filename generation working  
✅ Monitoring toggle working  
✅ Dry-run mode working  
✅ Undo functionality working  
✅ Category filtering working  

**You're ship-ready!** 🚀
