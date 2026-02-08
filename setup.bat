@echo off
REM Quick Start Script - Setting up Cosmic Compass for Development (Windows)

echo.
echo 🚀 Setting up Cosmic Compass for Database Development...
echo.

REM Copy environment template
if not exist ".env.local" (
  echo 📝 Creating .env.local from template...
  copy .env.example .env.local
  echo ✅ .env.local created. Please update VITE_API_BASE_URL with your backend URL
) else (
  echo ✅ .env.local already exists
)

REM Check if node_modules exists
if not exist "node_modules\" (
  echo.
  echo 📦 Installing dependencies...
  echo.
  
  REM Try bun first, then npm
  where bun >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    echo 📦 Using Bun package manager...
    call bun install
  ) else (
    echo 📦 Using NPM package manager...
    call npm install
  )
  echo ✅ Dependencies installed
) else (
  echo ✅ Dependencies already installed
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Setup Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Next Steps:
echo.
echo 1️⃣  Edit .env.local and set your backend URL:
echo    VITE_API_BASE_URL=http://localhost:5000/api
echo.
echo 2️⃣  Start the development server:
echo    npm run dev    (if using npm)
echo    bun run dev    (if using bun)
echo.
echo 3️⃣  Open in browser: http://localhost:8080
echo.
echo 📚 Documentation:
echo    • SETUP_DATABASE.md       - Complete setup guide
echo    • DATABASE_READY_README.md - Quick reference
echo    • CHANGES_SUMMARY.md      - What was changed
echo    • .env.example            - Environment variables
echo.
echo 💡 Example Components:
echo    • src/components/examples/WatchlistExample.jsx
echo    • src/components/examples/AlertsExample.jsx
echo    • src/components/examples/AsteroidsListExample.jsx
echo.
echo 🎣 Database Hooks:
echo    • src/hooks/useDatabaseHook.js (20+ hooks)
echo.
echo 🔌 Database Services:
echo    • src/services/database.js (Main API client)
echo    • src/services/auth.js (Authentication)
echo    • src/services/dataSyncManager.js (Auto-sync)
echo.
echo 📋 Backend Requirements:
echo    See SETUP_DATABASE.md for complete endpoint list
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
