#!/bin/bash
# Quick Start Script for Chakin Farm Backend

echo "🚀 Chakin Farm Backend - Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the backend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if database exists
if [ ! -f "database.db" ]; then
    echo "🌱 Initializing database..."
    npm run seed
    echo "✅ Database initialized and seeded"
else
    echo "✅ Database already exists"
fi

echo ""
echo "🎯 Starting Chakin Farm Backend Server..."
echo ""
echo "📍 Server running on: http://localhost:3001"
echo "📚 API Docs: Check API_DOCUMENTATION.md"
echo "🏠 Dashboard: http://localhost:3000 (frontend)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
