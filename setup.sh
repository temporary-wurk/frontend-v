#!/bin/bash
# Quick Start Script - Settings up Cosmic Compass for Development

echo "🚀 Setting up Cosmic Compass for Database Development..."
echo ""

# Copy environment template
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  cp .env.example .env.local
  echo "✅ .env.local created. Please update VITE_API_BASE_URL with your backend URL"
else
  echo "✅ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo ""
  echo "📦 Installing dependencies..."
  echo ""
  
  # Check for bun first, then npm
  if command -v bun &> /dev/null; then
    echo "📦 Using Bun package manager..."
    bun install
  elif command -v npm &> /dev/null; then
    echo "📦 Using NPM package manager..."
    npm install
  else
    echo "❌ Neither bun nor npm found. Please install Node.js or Bun."
    exit 1
  fi
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Edit .env.local and set your backend URL:"
echo "   VITE_API_BASE_URL=http://localhost:5000/api"
echo ""
echo "2️⃣  Start the development server:"
echo "   npm run dev    (if using npm)"
echo "   bun run dev    (if using bun)"
echo ""
echo "3️⃣  Open in browser: http://localhost:8080"
echo ""
echo "📚 Documentation:"
echo "   • SETUP_DATABASE.md       - Complete setup guide"
echo "   • DATABASE_READY_README.md - Quick reference"
echo "   • CHANGES_SUMMARY.md      - What was changed"
echo "   • .env.example            - Environment variables"
echo ""
echo "💡 Example Components:"
echo "   • src/components/examples/WatchlistExample.jsx"
echo "   • src/components/examples/AlertsExample.jsx"
echo "   • src/components/examples/AsteroidsListExample.jsx"
echo ""
echo "🎣 Database Hooks Locations:"
echo "   • src/hooks/useDatabaseHook.js (20+ hooks)"
echo ""
echo "🔌 Database Services:"
echo "   • src/services/database.js (Main API client)"
echo "   • src/services/auth.js (Authentication)"
echo "   • src/services/dataSyncManager.js (Auto-sync)"
echo ""
echo "📋 Backend Required Endpoints:"
echo "   See SETUP_DATABASE.md for complete endpoint list"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
