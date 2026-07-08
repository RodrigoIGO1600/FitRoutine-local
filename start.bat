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

:: Instalar dependencias de la raiz
if not exist "node_modules" (
    echo  Instalando dependencias del proyecto...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ADVERTENCIA] Error al instalar dependencias de la raiz
    )
)

:: Verificar si las dependencias del frontend estan instaladas
if not exist "front\node_modules" (
    echo  Instalando dependencias del frontend...
    pushd front
    call npm install
    if %errorlevel% neq 0 (
        echo  [ADVERTENCIA] Error al instalar dependencias del frontend
    )
    popd
)

:: Verificar si las dependencias del backend estan instaladas
if not exist "backend\node_modules" (
    echo  Instalando dependencias del backend...
    pushd backend
    call npm install
    if %errorlevel% neq 0 (
        echo  [ADVERTENCIA] Error al instalar dependencias del backend
    )
    popd
)

:: Crear archivo .env si no existe
if not exist "backend\.env" (
    echo  Creando archivo .env en backend...
    copy backend\.env.example backend\.env >nul
    if %errorlevel% neq 0 (
        echo  [ADVERTENCIA] No se pudo crear .env
    )
)

:: Ejecutar migraciones de Prisma
echo  Ejecutando migraciones de la base de datos...
pushd backend
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo  [ADVERTENCIA] Error en migraciones de Prisma
)
popd

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

echo.

pause
