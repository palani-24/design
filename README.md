# Easy Pattern — Professional Garment Pattern Grading CAD Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

**Easy Pattern** is a full-stack apparel CAD web application engineered for industrial garment pattern grading. Built around the core architectural invariant:

> ### **ONE GARMENT = ONE GRADING OBJECT**
> In Easy Pattern, Front, Back, and Sleeve pattern components are constrained child sub-nodes of a single garment entity. The user **never** grades individual components independently. When grading is executed (e.g. Size S → M), all connected pieces, armhole scyes, sleeve caps, side seams, and hem drops resize and morph **together in one synchronized proportional vector pass**.

---

## 📐 Key Capabilities

- **1-Object Parametric Grading**: Sizing alterations modify Front, Back, and Sleeve simultaneously to maintain precision seam mating and balance.
- **Strict Grading Sequence**: Proportional adjustments follow industry standards:
  $$\text{Neck} \longrightarrow \text{Shoulder} \longrightarrow \text{Bust/Chest} \longrightarrow \text{Waist} \longrightarrow \text{Hip} \longrightarrow \text{Hem}$$
- **Pure SVG Vector Geometry**: High-precision vector coordinates (millimeter/centimeter accuracy) with zero raster degradation.
- **Full Size Run Support**: Out-of-the-box support for sizes `XS`, `S`, `M`, `L`, `XL`, and `XXL`.
- **Configurable MongoDB Size Tables**: Fully customizable dimensions for Bust, Waist, Hip, Length, Width, Height, Sleeve, Shoulder, and Neck opening.
- **Professional Desktop CAD Interface**:
  - **Top Toolbar**: New, Open, Save, Undo, Redo, Select, Pan, Zoom In/Out, Fit, Measure, and SVG Export.
  - **Left Garment Panel**: Garment department library, 1-Object tree hierarchy with Front, Back, and Sleeve nodes, and prominent "Select Entire Garment" safety enforcement.
  - **Center Workspace**: Metric horizontal & vertical rulers, snap grid, vertex control points, alignment notches, grainline indicators, level guides, and unified bounding box with multi-piece movement.
  - **Right Grading Panel**: Live base & target size selector, dimensional metrics comparison ($old \rightarrow new$ with deltas), visual 6-node proportional stepper, and size run matrix.
- **Real Undo / Redo**: Multi-step history stack powered by Zustand.
- **Measure Tool**: Interactive on-canvas caliper measuring Euclidean distances between any two points in mm and cm.
- **Real SVG Export**: Standalone production-ready SVG files containing vector groups for Front, Back, Sleeve, grainlines, notches, and CAD annotations.
- **JSON Project Import & Export**: File upload, local download, and MongoDB cloud persistence with Zod schema validation.

---

## 🏗️ Project Architecture

```
easy-pattern/
├── client/                     # Frontend Application (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopToolbar.tsx           # CAD main navigation and actions
│   │   │   ├── LeftPanel.tsx            # Garment library and 1-Object hierarchy
│   │   │   ├── RightGradingPanel.tsx    # Live grading controls, metrics & stepper
│   │   │   ├── PatternWorkspace.tsx     # Center viewport with rulers & HUD
│   │   │   ├── Rulers.tsx               # Metric cm rulers with cursor tracking
│   │   │   ├── GarmentVectorSVG.tsx     # Vector SVG pattern rendering & bounds
│   │   │   ├── MeasureOverlay.tsx       # Distance measurement caliper
│   │   │   └── modals/
│   │   │       ├── NewProjectModal.tsx
│   │   │       ├── OpenProjectModal.tsx  # MongoDB list + JSON file upload
│   │   │       ├── SaveProjectModal.tsx  # MongoDB persistence + JSON download
│   │   │       ├── ExportSvgModal.tsx   # Standalone vector SVG generator
│   │   │       ├── GradeTablesModal.tsx # Configurable MongoDB size tables
│   │   │       └── JsonInspectorModal.tsx
│   │   ├── store/
│   │   │   └── useCADStore.ts           # Zustand store with Undo/Redo history
│   │   ├── App.tsx                      # Main app shell & keyboard shortcuts
│   │   ├── main.tsx
│   │   └── index.css                    # Tailwind + CAD styling utilities
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                     # Backend API Service (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── db/
│   │   │   └── connection.ts            # Resilient MongoDB connection with fallback
│   │   ├── models/
│   │   │   ├── ProjectModel.ts          # Mongoose schema for Project & Garment
│   │   │   └── store.ts                 # Hybrid repository (MongoDB + In-Memory)
│   │   ├── routes/
│   │   │   ├── projects.ts              # REST API: CRUD /api/projects
│   │   │   ├── garments.ts              # REST API: Templates /api/garments
│   │   │   ├── sizes.ts                 # REST API: Size table /api/sizes
│   │   │   ├── grade.ts                 # REST API: Grading /api/grade
│   │   │   └── export.ts                # REST API: SVG Export /api/export/svg
│   │   └── index.ts                     # Express entrypoint with CORS & routes
│   └── tsconfig.json
│
├── shared/                     # Shared TypeScript Modules
│   ├── types.ts                # Domain interfaces (Garment, Component, Point2D)
│   ├── constants.ts            # Basic T-Shirt geometry & standard size tables
│   ├── gradingEngine.ts        # Proportional vector grading algorithm & math
│   ├── svgExport.ts            # Clean SVG vector markup builder
│   └── validation.ts           # Zod validation schemas
│
├── tests/                      # Unit & End-to-End Test Suites (Vitest)
│   ├── gradingEngine.test.ts   # Sequence & delta verification
│   ├── measurements.test.ts    # Euclidean distance & seam length tests
│   ├── svgTransform.test.ts    # Bounds calculation & SVG generation
│   ├── validation.test.ts      # Zod schema checks
│   ├── undoRedo.test.ts        # Zustand history stack verification
│   └── e2eGrading.test.ts      # Full S -> M workflow & 1-object synchrony
│
├── .env.example
├── LICENSE                     # MIT License
├── package.json
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB** *(optional)*: Local daemon (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI. If MongoDB is not running locally, the server automatically activates a resilient in-memory hybrid store so development and testing proceed without interruption.

### 1. Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/easy-pattern/easy-pattern.git
cd easy-pattern

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Environment Configuration

Copy `.env.example` to `server/.env`:

```bash
cp .env.example server/.env
```

Default configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/easypattern
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Running Locally in Development

Start both the backend server and frontend development server concurrently from the root directory:

```bash
npm run dev
```

Or start them individually in separate terminals:

```bash
# Terminal 1: Backend Express Server (http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend Vite CAD App (http://localhost:5173)
npm run dev:client
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Testing

The test suite covers grading math, measurements, SVG bounding box transforms, Zod schema validation, Undo/Redo history, and a complete end-to-end workflow test.

Run all tests via Vitest:

```bash
npm test
```

Watch mode for active development:

```bash
npm run test:watch
```

---

## 📦 Production Build

To compile both the TypeScript server and Vite frontend production bundles:

```bash
npm run build
```

The compiled bundles will be output to:
- `client/dist/` (static SPA assets)
- `dist/server/` (compiled Node.js application)

To start the production server:

```bash
npm --prefix server start
```

---

## 📐 Grading Invariant & Mathematics

### The 1-Object Parametric Nest
Garment patterns are defined in high-precision millimeters ($1\text{cm} = 10\text{ SVG units}$).

When moving from **Size S (Base: 92cm Bust)** to **Size M (Target: 96cm Bust)**:

| Grading Zone | Sequence Order | Delta Calculation | Applied Components |
|---|---|---|---|
| **Neck** | 1 | $\Delta_{\text{neck}} = +1.5\text{ cm}$ ($\text{HPS shift} = +1.8\text{ mm}$) | Front, Back |
| **Shoulder** | 2 | $\Delta_{\text{shoulder}} = +0.6\text{ cm}$ ($\text{Tip shift} = +4.8\text{ mm}$) | Front, Back |
| **Bust / Chest** | 3 | $\Delta_{\text{bust}} = +4.0\text{ cm} \implies \text{Fold } \frac{1}{4} = +10.0\text{ mm}$ | Front, Back, Sleeve |
| **Waist** | 4 | $\Delta_{\text{waist}} = +4.0\text{ cm} \implies \text{Fold } \frac{1}{4} = +10.0\text{ mm}$ | Front, Back |
| **Hip** | 5 | $\Delta_{\text{hip}} = +4.0\text{ cm} \implies \text{Fold } \frac{1}{4} = +10.0\text{ mm}$ | Front, Back |
| **Hem / Length** | 6 | $\Delta_{\text{length}} = +2.0\text{ cm} \implies \text{Drop } = +20.0\text{ mm}$ | Front, Back, Sleeve |

### Synchronized Sleeve Interpolation
When the Front and Back armhole scyes expand, the Sleeve component's bicep width expands proportionally:
$$\Delta W_{\text{sleeve}} = \frac{\Delta_{\text{bust}}}{4} \times 10 = +10.0\text{ mm}$$
The sleeve crown height rises to match the shoulder slope, and the sleeve length drops by $+10.0\text{ mm}$ ($+1.0\text{ cm}$), maintaining precision sleeve-cap insertion tolerances.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` / `Cmd + Z` | Undo last operation |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo operation |
| `Ctrl + S` | Open Save Project dialog |
| `Ctrl + O` | Open Project dialog (Cloud / JSON) |
| `V` | Switch to Select tool |
| `H` | Switch to Pan tool |
| `M` | Switch to Measure tool |
| `Ctrl + Wheel` | Zoom in / Zoom out |
| `Middle Click + Drag` | Pan workspace |
| `Escape` | Close active dialog / Deselect |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
