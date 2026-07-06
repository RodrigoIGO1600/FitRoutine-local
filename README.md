<div align="center">

[![Español](https://img.shields.io/badge/🇪🇸-Español-FF4444)](README.es.md)

# 🏋️ FitRoutine

### Your personal workout routine manager

A mobile-first web app for creating, managing, and tracking your workout routines.

Built with **React**, **Express**, **TypeScript**, and **SQLite**.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org)

</div>

---

## ✨ Features

- 📋 **Create & manage routines** — Build custom workout routines with ease
- 🏋️ **Exercise library** — Categorized exercises with muscle groups and equipment
- ⚙️ **Full customization** — Sets, reps, weight, rest time, and notes per exercise
- 📱 **Mobile-first design** — Works great on your phone at the gym
- 📊 **Workout history** — Track your progress over time
- 🎨 **Multiple themes** — Dark, Light, and Sunset
- 🌐 **Multi-language** — English and Spanish support
- 📲 **QR code access** — Scan to open on your phone instantly
- 💾 **Local-first** — All data stays on your machine, no cloud required

---

## 🚀 Quick Start

### Prerequisites

You only need **Node.js** installed on your computer.

| Required | Version |
|----------|---------|
| [Node.js](https://nodejs.org) | 18+ (LTS recommended) |

> 💡 To check if you have Node.js installed, open a terminal and run:
> ```bash
> node --version
> ```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/RodrigoIGO1600/FitRoutine-local.git
cd FitRoutine-local
```

**2. Run the start script for your OS**

<details>
<summary><strong>🪟 Windows</strong></summary>

Double-click the `start.bat` file, or run in terminal:

```bash
.\start.bat
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

Double-click the `start.command` file, or run in terminal:

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

That's it! The script will automatically:
- ✅ Check that Node.js is installed
- ✅ Install all dependencies (first time only)
- ✅ Set up the database with Prisma migrations
- ✅ Start the backend on port `3000`
- ✅ Start the frontend on port `5173`
- ✅ Open the app in your browser
- ✅ Show a QR code to access from your phone

### Manual Setup

If you prefer to run each step yourself:

```bash
# Install backend dependencies
cd backend
npm install

# Set up the database
npx prisma migrate dev

# Go back to root
cd ..

# Install frontend dependencies
cd front
npm install

# Go back to root
cd ..

# Start both servers
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📱 Use from your phone

When the app is running, the start script displays a **QR code** in the terminal.

1. Make sure your phone is connected to the **same WiFi** as your computer
2. Scan the QR code with your phone's camera
3. The app opens in your mobile browser — ready to use at the gym!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, React Router |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | SQLite via Prisma ORM |
| **Styling** | CSS Modules, mobile-first design |
| **Icons** | Iconify |

---

## 📁 Project Structure

```
FitRoutine-local/
├── backend/
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   └── db/          # Database client
│   └── package.json
├── front/
│   ├── src/
│   │   ├── api/         # HTTP client functions
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── context/     # Theme & language providers
│   │   ├── i18n/        # Translations
│   │   └── types/       # TypeScript types
│   └── package.json
├── start.bat            # Quick start for Windows
├── start.command        # Quick start for macOS
├── start.sh             # Quick start for Linux
└── package.json         # Root scripts
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `start.bat` / `start.command` / `start.sh` | Start everything with one click |
| `npm run dev` | Start both frontend and backend |
| `npm run dev:back` | Start only the backend |
| `npm run dev:front` | Start only the frontend |

---

## 📄 License

This project is open source and available for anyone to use and learn from.

---

<div align="center">

**Built as a learning project to practice fullstack development**

⭐ Star this repo if you find it useful!

</div>
