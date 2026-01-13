#!/bin/bash

echo "========================================="
echo "  TRUSTAUTO KENYA - RESTART ALL"
echo "========================================="
echo ""

# Stop all services
echo "🛑 Stopping services..."
pkill -f "ts-node.*server.ts" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Start database
echo "🗄 Starting PostgreSQL..."
cd /workspaces/demo-car-yard
docker-compose up -d
sleep 3

# Start backend
echo "🔧 Starting Backend API..."
cd /workspaces/demo-car-yard/backend
npm run dev > /tmp/backend.log 2>&1 &
sleep 4

# Check backend health
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend failed to start"
    tail -20 /tmp/backend.log
fi

# Start frontend
echo "🎨 Starting Frontend..."
cd /workspaces/demo-car-yard/frontend
npm run dev > /tmp/frontend.log 2>&1 &
sleep 5

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend failed to start"
    tail -20 /tmp/frontend.log
fi

echo ""
echo "========================================="
echo "  SERVICES READY"
echo "========================================="
echo ""
echo "🌐 Access URLs:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5000"
echo "  Admin:     http://localhost:3000/auth/login"
echo ""
echo "🔐 Admin Credentials:"
echo "  Email:    admin@trustauto.co.ke"
echo "  Password: Admin123!"
echo ""
echo "📊 Database Info:"
VEHICLES=$(curl -s http://localhost:5000/api/vehicles 2>/dev/null | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null)
echo "  Total vehicles: $VEHICLES"
echo ""
echo "📝 View logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo "  Docker:   docker-compose logs -f postgres"
echo ""
echo "========================================="
echo "  ALL SERVICES RUNNING"
echo "========================================="
