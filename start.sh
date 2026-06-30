#!/bin/bash
echo ""
echo "  ========================================"
echo "   FitRoutine - Inicio Rapido"
echo "  ========================================"
echo ""

# Detectar IP local
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$LOCAL_IP" ]; then
    echo "  [ERROR] No se pudo detectar la IP. Conectate a una red WiFi."
    exit 1
fi

echo "  IP detectada: $LOCAL_IP"
echo ""

# Verificar Node
if ! command -v node &> /dev/null; then
    echo "  [ERROR] Node.js no encontrado. Instala desde https://nodejs.org"
    exit 1
fi

# Verificar dependencias
if [ ! -d "front/node_modules" ]; then
    echo "  Instalando dependencias del frontend..."
    cd front && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "  Instalando dependencias del backend..."
    cd backend && npm install && cd ..
fi

echo ""
echo "  Iniciando backend en puerto 3000..."
cd backend && npm run dev &
BACK_PID=$!

sleep 2

echo "  Iniciando frontend en puerto 5173..."
cd ../front && npm run dev &
FRONT_PID=$!

sleep 3

# Abrir navegador
echo "  Abriendo navegador..."
open http://localhost:5173

# Mostrar QR
node show-url.js

echo ""

# Esperar y cerrar procesos al Ctrl+C
trap "kill $BACK_PID $FRONT_PID 2>/dev/null; exit" INT TERM
wait
