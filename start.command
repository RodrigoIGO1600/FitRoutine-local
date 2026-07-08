#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "  ========================================"
echo "   FitRoutine - Inicio Rapido"
echo "  ========================================"
echo ""

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$LOCAL_IP" ]; then
    echo "  [ERROR] No se pudo detectar la IP. Conectate a una red WiFi."
    exit 1
fi

echo "  IP detectada: $LOCAL_IP"
echo ""

if ! command -v node &> /dev/null; then
    echo "  [ERROR] Node.js no encontrado. Instala desde https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "  Instalando dependencias del proyecto..."
    npm install
fi

if [ ! -d "front/node_modules" ]; then
    echo "  Instalando dependencias del frontend..."
    (cd front && npm install) || echo "  [ADVERTENCIA] Error al instalar dependencias del frontend"
fi

if [ ! -d "backend/node_modules" ]; then
    echo "  Instalando dependencias del backend..."
    (cd backend && npm install) || echo "  [ADVERTENCIA] Error al instalar dependencias del backend"
fi

if [ ! -f "backend/.env" ]; then
    echo "  Creando archivo .env en backend..."
    cp backend/.env.example backend/.env || echo "  [ADVERTENCIA] No se pudo crear .env"
fi

echo ""
echo "  Ejecutando migraciones de la base de datos..."
(cd backend && npx prisma migrate deploy) || echo "  [ADVERTENCIA] Error en migraciones de Prisma"

echo ""
echo "  Iniciando backend en puerto 3000..."
(cd backend && npm run dev) &
BACK_PID=$!

sleep 2

echo "  Iniciando frontend en puerto 5173..."
(cd front && npm run dev) &
FRONT_PID=$!

echo ""
echo "  Esperando a que el frontend este listo..."

for i in $(seq 1 30); do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        break
    fi
    sleep 1
done

echo "  Abriendo navegador..."
open http://localhost:5173

node show-url.js

echo ""

trap "kill $BACK_PID $FRONT_PID 2>/dev/null; exit" INT TERM
wait
