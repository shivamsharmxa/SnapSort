SnapSort

A smart desktop app that automatically detects and processes screenshots — built with NestJS & Tauri.

SnapSort is a desktop application that monitors your system for new screenshots and prepares them for intelligent processing like text extraction, categorization, and future AI-based organization — all locally and offline.

🚀 Why SnapSort?

Screenshots pile up quickly.
They become messy, unsearchable, and forgotten.

SnapSort solves this by:

Automatically detecting new screenshots

Processing them locally

Preparing them for OCR & AI analysis

Keeping everything private (no cloud)

This project focuses on real system-level engineering, not just UI.

🧠 What This Project Demonstrates

✔ Desktop app architecture
✔ NestJS backend design
✔ System-level file monitoring
✔ macOS filesystem behavior
✔ Polling-based detection (production-safe)
✔ Clean code structure
✔ Ready for OCR & AI integration

🧩 Tech Stack
Layer	Tech
Desktop Runtime	Tauri
Backend	NestJS (Node.js)
Language	TypeScript
File Monitoring	Node FS (Polling-based)
OCR (Next Phase)	Tesseract.js
Platform	macOS (cross-platform ready)

⚙️ How It Works
1️⃣ Screenshot Detection

Instead of unreliable file system events, SnapSort uses a polling-based approach to reliably detect screenshots across macOS.

2️⃣ Smart Filtering

Only real screenshots are processed:

Image files only

Timestamp-based detection

Avoids duplicates

Avoids system folders

3️⃣ Fully Local

No cloud

No uploads

No APIs

Privacy-first
