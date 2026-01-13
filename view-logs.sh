#!/bin/bash

echo "========================================="
echo "  VIEW LOGS MENU"
echo "========================================="
echo ""
echo "Choose what to view:"
echo ""
echo "1) Backend logs     → tail -f /tmp/backend.log"
echo "2) Frontend logs    → tail -f /tmp/frontend.log"
echo "3) Database logs    → docker-compose logs -f postgres"
echo "4) All logs (menu)  → Show recent entries"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "Viewing backend logs (Ctrl+C to exit)..."
    echo ""
    tail -f /tmp/backend.log
    ;;
  2)
    echo ""
    echo "Viewing frontend logs (Ctrl+C to exit)..."
    echo ""
    tail -f /tmp/frontend.log
    ;;
  3)
    echo ""
    echo "Viewing database logs (Ctrl+C to exit)..."
    echo ""
    docker-compose logs -f postgres
    ;;
  4)
    echo ""
    echo "========================================="
    echo "  BACKEND LOGS (last 20 lines)"
    echo "========================================="
    tail -20 /tmp/backend.log
    echo ""
    echo "========================================="
    echo "  FRONTEND LOGS (last 20 lines)"
    echo "========================================="
    tail -20 /tmp/frontend.log
    echo ""
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
