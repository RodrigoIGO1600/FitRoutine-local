<div align="center">

[![English](https://img.shields.io/badge/🇬🇧-English-003580)](README.md)

<img src="front/public/app-logo.png" alt="FitRoutine Logo" width="120" />

# 🏋️ FitRoutine

### Aplicación full-stack mobile-first para gestión de entrenamientos

Crea, organiza y sigue rutinas de entrenamiento de forma local.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org)

</div>

---

## ✨ Descripción general

FitRoutine es una aplicación full-stack mobile-first para crear, organizar y seguir rutinas de entrenamiento. Está diseñada para ejecutarse localmente permitiendo que dispositivos en la misma red interactúen con la aplicación.

La aplicación permite a los usuarios construir una biblioteca personal de ejercicios, combinar ejercicios en rutinas y ejecutar sesiones de entrenamiento guiadas. Cada ejercicio en una rutina se puede configurar con series, repeticiones o duración, intervalos de descanso y notas. Los entrenamientos iniciados se guardan en un historial local para que los usuarios puedan revisar sesiones anteriores.

FitRoutine se construyó como un proyecto personal full-stack para explorar e implementar comportamiento de aplicación local, desarrollo moderno con React y TypeScript, diseño de API REST, UI responsive mobile-first, persistencia y diseño de base de datos, y uso multi-dispositivo en red local. Es intencionalmente solo-local: la base de datos SQLite vive en el backend, y un teléfono en la misma red WiFi actúa solo como cliente.

---

## 🚀 Características principales

- 📋 **Creación y gestión de rutinas** — crea, actualiza y elimina rutinas de entrenamiento
- 🏋️ **Biblioteca de ejercicios** — define ejercicios con grupo muscular, categoría, equipamiento, descripción, URL de video y tipo basado en tiempo/repeticiones
- ⚙️ **Constructor de rutinas** — agrega ejercicios a las rutinas, configura series/repeticiones/duración/descanso y reordena ejercicios
- ▶️ **Seguimiento de entrenamiento activo** — inicia una rutina, marca series como completadas, ejecuta temporizadores de descanso y ejercicio, y registra el tiempo transcurrido
- 📊 **Historial de entrenamientos** — guarda sesiones completadas y revisa tiempo total, series y repeticiones
- 📱 **UI responsive/mobile-first** — optimizada para teléfono con un diseño que también funciona en escritorio
- 🎨 **Múltiples temas** — temas oscuro, claro y sunset, persistidos en local storage
- 🌐 **Localización inglés/español** — cambia el idioma de la interfaz, persistido en local storage
- 🌐 **Acceso por red local** — ejecuta el backend en `0.0.0.0` y abre el frontend desde otros dispositivos en la misma red
- 📲 **Acceso por código QR** — la vista de escritorio muestra un código QR que enlaza a la URL del frontend en la red local

---

## 🛠️ Stack tecnológico

### Frontend

- React 19
- TypeScript
- Vite
- React Router 7
- CSS Modules
- Iconify React
- qrcode.react

### Backend

- Node.js
- Express 5
- TypeScript
- tsx

### Base de datos

- SQLite
- Prisma 7 ORM

---

## 🏗️ Arquitectura

El proyecto se organiza en tres carpetas principales:

```txt
FitRoutine-local/
├── backend/          # API Express, esquema Prisma, migraciones
├── front/            # Frontend React
└── docs/             # Contrato de API y notas de arquitectura
```

El frontend y el backend se ejecutan como procesos locales separados durante el desarrollo. El frontend no accede directamente a la base de datos; se comunica con el backend a través de peticiones HTTP. El backend posee toda la lógica de persistencia y almacena los datos en un archivo SQLite local.

```txt
Navegador (escritorio o móvil)
  → Frontend React
  → cliente API del frontend (front/src/api/)
  → endpoints REST (backend/src/routes/)
  → controladores (backend/src/controllers/)
  → servicios (backend/src/services/)
  → Prisma (backend/src/db/)
  → SQLite
```

El estado en el frontend se maneja con hooks y contextos de React. Un `ThemeProvider` y un `LanguageProvider` proveen el estado de tema e idioma al árbol de componentes. El progreso del entrenamiento también se persiste en `localStorage` durante una sesión activa para que sobreviva a recargas de página.

---

## 🔌 API / Flujo de datos

El frontend lee la URL base de la API desde `VITE_API_URL` y usa `/api` como respaldo:

```ts
export const API_URL = import.meta.env.VITE_API_URL ?? "/api";
```

Los módulos de endpoints viven en `front/src/api/` y envuelven llamadas `fetch`. El backend expone rutas bajo `/api`:

- `GET /api/health` — verificación de salud
- `GET /api/network/ip` — devuelve la dirección IPv4 local de la laptop
- `/api/exercises` — CRUD de ejercicios
- `/api/routines` — CRUD de rutinas
- `/api/workout-sessions` — historial de sesiones de entrenamiento
- `/api/routines/:id/exercises` y `/api/routine-exercises/:id` — gestión de ejercicios en rutinas

Las respuestas usan una forma JSON consistente: `{ data: ... }` para éxito y `{ error: "..." }` para errores.

---

## 💻 Ejecución local

### Requisitos previos

- Node.js 18+ (se recomienda LTS)
- npm

### Inicio rápido

<details>
<summary><strong>🪟 Windows</strong></summary>

```bash
.\start.bat
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

```bash
./start.command
```

</details>

El script de inicio instalará las dependencias, aplicará las migraciones de Prisma, iniciará el backend en el puerto `3000`, iniciará el frontend en el puerto `5173` y abrirá la aplicación en tu navegador.

### Configuración manual

```bash
# Dependencias raíz
npm install

# Dependencias del backend y base de datos
cd backend
npm install
npx prisma migrate deploy

# Dependencias del frontend
cd ../front
npm install

# Ejecutar ambos servidores desde la raíz del proyecto
cd ..
npm run dev
```

Luego abre [http://localhost:5173](http://localhost:5173).

### Puertos y entorno

| Servicio | URL por defecto              |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:3000        |
| API base | http://localhost:3000/api    |

Variables de entorno del backend (ver `backend/.env.example`):

```txt
PORT=3000
DATABASE_URL="file:./dev.db"
```

Variables de entorno del frontend (ver `front/.env.example`):

```txt
VITE_API_URL=http://localhost:3000/api
```

Para pruebas en red local, configura `VITE_API_URL` con la IP local de la laptop, por ejemplo `http://192.168.1.75:3000/api`, y abre el frontend usando la misma IP.

---

## 📝 Notas de desarrollo

- **Diseño responsive mobile-first** — los componentes se estilan principalmente para pantallas de teléfono y se adaptan a escritorio mediante CSS Modules.
- **Separación de responsabilidades** — la lógica del backend se divide en rutas, controladores y servicios; el acceso a datos del frontend se centraliza en `front/src/api/`.
- **Acceso a API centralizado** — la URL base de la API se configura una vez en `front/src/api/client.ts` y se reutiliza por todos los módulos de endpoints.
- **TypeScript en todo el proyecto** — tanto el frontend como el backend usan TypeScript con formas tipadas de datos de API.
- **Migraciones de Prisma** — los cambios de esquema se rastrean en `backend/prisma/migrations/` y se aplican con `npx prisma migrate deploy`.
- **Internacionalización personalizada** — las traducciones se almacenan en `front/src/i18n/` y se consumen a través de un hook de contexto de React.
- **Acceso por red local** — el backend se vincula a `0.0.0.0` y expone `/api/network/ip` para que el frontend pueda mostrar la URL correcta del código QR.

---

## 🤖 Desarrollo asistido por IA

Se utilizaron herramientas de desarrollo asistido por IA durante partes del proceso de implementación e iteración. Los requisitos del proyecto, la arquitectura, las decisiones de integración, la revisión de código, la depuración y las decisiones finales de implementación permanecieron bajo supervisión del desarrollador.

---

## 📊 Estado del proyecto

FitRoutine es un proyecto personal full-stack en desarrollo activo. No es un producto comercial ni un servicio de nivel producción; está destinado al uso local y como ejemplo de portafolio.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para que cualquiera lo use y modifique.

---

<div align="center">

**Creado como proyecto personal full-stack de aprendizaje**

¡Dale una estrella si te fue útil!

</div>
