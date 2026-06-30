@echo off
title FitRoutine
color 0A
echo.
echo  ========================================
echo   FitRoutine - Inicio Rapido
echo  ========================================
echo.

:: Detectar IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=*" %%b in ("%%a") do set LOCAL_IP=%%b
)
set LOCAL_IP=%LOCAL_IP: =%

echo  IP detectada: %LOCAL_IP%
echo.

:: Verificar Node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js no encontrado. Instala desde https://nodejs.org
    pause
    exit /b 1
)

:: Verificar si las dependencias estan instaladas
if not exist "front\node_modules" (
    echo  Instalando dependencias del frontend...
    cd front && npm install && cd ..
)
if not exist "backend\node_modules" (
    echo  Instalando dependencias del backend...
    cd backend && npm install && cd ..
)

echo.
echo  Iniciando backend en puerto 3000...
start "FitRoutine Backend" cmd /c "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo  Iniciando frontend en puerto 5173...
start "FitRoutine Frontend" cmd /c "cd front && npm run dev"

timeout /t 3 /nobreak >nul

:: Abrir navegador
echo  Abriendo navegador...
start http://localhost:5173

:: Mostrar QR
node show-url.js

echo.

pause
