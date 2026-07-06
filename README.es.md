<div align="center">

[![English](https://img.shields.io/badge/🇬🇧-English-003580)](README.md)

# 🏋️ FitRoutine

### Tu gestor de rutinas de entrenamiento personal

Una aplicación web mobile-first para crear, gestionar y seguir tus rutinas de entrenamiento.

Desarrollada con **React**, **Express**, **TypeScript** y **SQLite**.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org)

</div>

---

## ✨ Características

- 📋 **Crear y gestionar rutinas** — Construye rutinas de entrenamiento personalizadas con facilidad
- 🏋️ **Biblioteca de ejercicios** — Ejercicios categorizados por grupo muscular y equipamiento
- ⚙️ **Personalización completa** — Series, repeticiones, peso, tiempo de descanso y notas por ejercicio
- 📱 **Diseño mobile-first** — Funciona perfecto en tu teléfono
- 📊 **Historial de entrenamientos** — Sigue tu progreso con el tiempo
- 🎨 **Múltiples temas** — Oscuro, Claro y Sunset
- 🌐 **Multi-idioma** — Soporte para inglés y español
- 📲 **Acceso por código QR** — Escanea para abrir en tu celular al instante
- 💾 **Local-first** — Todos los datos se quedan en tu máquina, sin nube necesaria

---

## 🚀 Inicio rápido

### Requisitos previos

Solo necesitas **Node.js** instalado en tu computadora.

| Requisito | Versión |
|-----------|---------|
| [Node.js](https://nodejs.org) | 18+ (LTS recomendado) |

> 💡 Para verificar si tienes Node.js instalado, abre una terminal y ejecuta:
> ```bash
> node --version
> ```

### Instalación

**1. Clona el repositorio**

```bash
git clone https://github.com/RodrigoIGO1600/FitRoutine-local.git
cd FitRoutine-local
```

**2. Ejecuta el script de inicio para tu sistema operativo**

<details>
<summary><strong>🪟 Windows</strong></summary>

Haz doble clic en el archivo `start.bat`, o ejecuta en la terminal:

```bash
.\start.bat
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

Haz doble clic en el archivo `start.command`, o ejecuta en la terminal:

```bash
./start.command
```

</details>

<details>
<summary><strong>🐧 Linux</strong></summary>

```bash
./start.sh
```

</details>

¡Listo! El script automáticamente:
- ✅ Verifica que Node.js esté instalado
- ✅ Instala todas las dependencias (solo la primera vez)
- ✅ Configura la base de datos con migraciones de Prisma
- ✅ Inicia el backend en el puerto `3000`
- ✅ Inicia el frontend en el puerto `5173`
- ✅ Abre la aplicación en tu navegador
- ✅ Muestra un código QR para acceder desde tu celular

### Configuración manual

Si prefieres ejecutar cada paso tú mismo:

```bash
# Instalar dependencias del backend
cd backend
npm install

# Configurar la base de datos
npx prisma migrate dev

# Volver al directorio raíz
cd ..

# Instalar dependencias del frontend
cd front
npm install

# Volver al directorio raíz
cd ..

# Iniciar ambos servidores
npm run dev
```

Luego abre **http://localhost:5173** en tu navegador.

---

## 📱 Usa desde tu celular

Cuando la aplicación esté en marcha, el script de inicio muestra un **código QR** en la terminal.

1. Asegúrate de que tu celular esté conectado a la **misma WiFi** que tu computadora
2. Escanea el código QR con la cámara de tu celular
3. La aplicación se abre en el navegador de tu celular — ¡lista para usar en el gimnasio!

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19, Vite, TypeScript, React Router |
| **Backend** | Node.js, Express 5, TypeScript |
| **Base de datos** | SQLite con Prisma ORM |
| **Estilos** | CSS Modules, diseño mobile-first |
| **Iconos** | Iconify |

---

## 📁 Estructura del proyecto

```
FitRoutine-local/
├── backend/
│   ├── prisma/          # Esquema de base de datos y migraciones
│   ├── src/
│   │   ├── routes/      # Endpoints de la API
│   │   ├── controllers/ # Manejadores de peticiones
│   │   ├── services/    # Lógica de negocio
│   │   └── db/          # Cliente de base de datos
│   └── package.json
├── front/
│   ├── src/
│   │   ├── api/         # Funciones cliente HTTP
│   │   ├── components/  # Componentes UI reutilizables
│   │   ├── pages/       # Vistas de páginas
│   │   ├── context/     # Proveedores de tema e idioma
│   │   ├── i18n/        # Traducciones
│   │   └── types/       # Tipos TypeScript
│   └── package.json
├── start.bat            # Inicio rápido para Windows
├── start.command        # Inicio rápido para macOS
├── start.sh             # Inicio rápido para Linux
└── package.json         # Scripts raíz
```

---

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `start.bat` / `start.command` / `start.sh` | Inicia todo con un solo clic |
| `npm run dev` | Inicia frontend y backend |
| `npm run dev:back` | Inicia solo el backend |
| `npm run dev:front` | Inicia solo el frontend |

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para que cualquiera lo use y aprenda de él.

---

<div align="center">

**Creado como proyecto de aprendizaje para practicar desarrollo fullstack**

¡Dale una estrella si te fue útil!

</div>
