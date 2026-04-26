# 🅿️ ParkSmart AI — Enterprise-Grade Smart Parking & Visitor Management

ParkSmart AI is a production-ready, SaaS-level platform for residential societies, corporate campuses, and smart cities. It combines **real-time WebSocket automation**, **Firebase authentication**, **AI-powered parking allocation**, and **advanced analytics** into a single, premium dashboard experience.

![Status](https://img.shields.io/badge/Status-Production--Ready-success)
![Stack](https://img.shields.io/badge/Stack-React%20+%20Express%20+%20MongoDB%20+%20Firebase-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

### 🔐 Authentication & Role-Based Access
- **Firebase Auth** — Secure email/password login with persistent sessions.
- **Role System** — `admin` and `guard` roles with filtered navigation & access controls.
- **JWT Tokens** — Backend-issued JWTs for API route protection via `authMiddleware`.

### 📡 Real-Time Security Engine
- **Socket.IO** — Live WebSocket connections for instant entry/exit alerts.
- **Overstay Detection** — Background cron (30 s interval) monitors visitors exceeding time limits.
- **Dynamic Toasts** — Interactive real-time notifications for security personnel.

### 📊 Intelligent Analytics Center
- **Data Aggregation** — MongoDB aggregation pipelines for daily visitor trends.
- **Visual KPIs** — Recharts-powered charts for occupancy rates, peak hours, and security alerts.
- **Audit Logging** — Full history of visitor movements and parking usage.

### 🛂 Smart Visitor Entry (QR-Based)
- **Instant Pass Generation** — QR-based entry tokens via `qrcode` library.
- **Unified Scan Flow** — Single `/scan-qr` endpoint handles both entry (`coming → inside`) and exit (`inside → exited`).
- **Expiry & Reuse Prevention** — Strict validation on QR expiry and scan-state transitions.
- **Priority (VIP) System** — Tiered slot allocation for VIP guests.

### 🏗️ Fail-Safe Architecture
- **Intelligent Mock Mode** — Auto-switches to in-memory data store if MongoDB is offline, ensuring 100 % uptime for dev/testing.
- **Clean MVC Structure** — Controllers → Routes → Models separation for enterprise scalability.

### 🎨 Premium SaaS UI
- **Glassmorphism** — Frosted-glass cards, backdrop-blur panels, and translucent sidebars.
- **Mouse Glow Effect** — Cursor-following radial gradient for a high-end feel.
- **Framer Motion** — Page transitions, tab switching animations, and micro-interactions.
- **Collapsible Sidebar** — Responsive navigation with smooth width transitions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express 5, Socket.IO 4, Morgan |
| **Database** | MongoDB (Mongoose 9) — with built-in mock fallback |
| **Auth** | Firebase Auth (client) + Firebase Admin SDK (server) + JWT |
| **QR Engine** | `qrcode` (generation) + `html5-qrcode` (camera scanning) |
| **Realtime** | Socket.IO (bi-directional WebSockets) |

---

## 📂 Project Structure

```text
parkQR/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection with mock-mode fallback
│   │   └── firebaseAdmin.js       # Firebase Admin SDK initialization
│   ├── controllers/
│   │   ├── analyticsController.js # Aggregation pipelines for KPI data
│   │   ├── notificationController.js # Overstay checks & alert engine
│   │   ├── parkingController.js   # Slot CRUD & availability logic
│   │   ├── qrController.js        # QR generation & scan verification
│   │   ├── userController.js      # User registration & login
│   │   └── visitorController.js   # Visitor lifecycle (create → entry → exit)
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT + Firebase token verification
│   ├── models/
│   │   ├── Notification.js        # Alert schema
│   │   ├── ParkingSlot.js         # Slot schema (type, status, floor)
│   │   ├── QRPass.js              # QR pass schema (token, expiry)
│   │   ├── User.js                # User schema (name, email, role)
│   │   └── Visitor.js             # Visitor schema (status lifecycle)
│   ├── routes/
│   │   ├── analyticsRoutes.js     # GET /api/analytics/*
│   │   ├── notificationRoutes.js  # GET/POST /api/notifications/*
│   │   ├── parkingRoutes.js       # GET/POST /api/parking/*
│   │   ├── qrRoutes.js           # POST /api/qr/*
│   │   ├── userRoutes.js          # POST /api/users/*
│   │   └── visitorRoutes.js       # GET/POST /api/visitors/*
│   ├── scripts/
│   │   ├── seedFirestore.js       # Seed Firestore with initial data
│   │   └── seedParkingSlots.js    # Seed MongoDB parking slots
│   ├── utils/
│   │   ├── firebaseSync.js        # Firebase ↔ MongoDB sync helpers
│   │   ├── generateToken.js       # JWT token generation utility
│   │   ├── mockData.js            # In-memory data store (mock mode)
│   │   └── qrService.js           # QR code generation logic
│   ├── seedParking.js             # Quick-seed script for parking slots
│   ├── server.js                  # Express + Socket.IO HTTP server entry point
│   ├── package.json
│   └── .env                       # PORT, MONGODB_URI, JWT_SECRET, NODE_ENV
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.jsx  # Charts & KPI cards (Recharts)
│   │   │   ├── NotificationBell.jsx    # Header notification icon
│   │   │   ├── NotificationList.jsx    # Alert feed panel
│   │   │   ├── ParkingGrid.jsx         # Visual parking slot grid
│   │   │   ├── QRModal.jsx             # QR code display modal
│   │   │   └── VisitorForm.jsx         # Visitor registration form
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Firebase Auth provider + role state
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx          # Admin overview dashboard
│   │   │   ├── BookingPage.jsx         # Slot booking interface
│   │   │   ├── Dashboard.jsx           # General dashboard view
│   │   │   ├── GuardScanner.jsx        # QR camera scanner terminal
│   │   │   ├── LoginPage.jsx           # Firebase login/signup page
│   │   │   ├── ParkingHome.jsx         # Parking landing page
│   │   │   ├── SpotListing.jsx         # Available spots list
│   │   │   ├── UserDashboard.jsx       # User-specific dashboard
│   │   │   └── VisitorEntry.jsx        # Visitor registration page
│   │   ├── services/
│   │   │   ├── bookingService.js       # Booking API calls
│   │   │   └── parkingService.js       # Parking API calls
│   │   ├── utils/
│   │   │   ├── seedSlots.js            # Client-side slot seeding
│   │   │   └── socket.js              # Socket.IO client instance
│   │   ├── App.jsx                     # Root app — routing, SaaS layout, mouse glow
│   │   ├── firebase.js                 # Firebase client SDK config
│   │   ├── index.css                   # Global styles
│   │   └── main.jsx                    # React DOM entry point
│   ├── .env                            # VITE_FIREBASE_* config keys
│   ├── postcss.config.js
│   └── package.json
│
├── docs/                               # Project documentation
└── README.md                           # ← You are here
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v16+
- **MongoDB** (optional — system auto-switches to Mock Mode if unavailable)

### 2. Installation

```bash
# Clone the repository
git clone <repo-url>
cd parkQR

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_parking
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Running the System

```bash
# Terminal 1 — Start Backend (Port 5000)
cd backend
node server.js

# Terminal 2 — Start Frontend (Port 5173)
cd frontend
npm run dev
```

### 5. Seed Data (Optional)

```bash
# Populate parking slots in MongoDB
node backend/seedParking.js

# Seed Firestore data
node backend/scripts/seedFirestore.js

# Seed parking slots via script
node backend/scripts/seedParkingSlots.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login` | Authenticate & get JWT |
| `GET` | `/api/parking/slots` | List all parking slots |
| `POST` | `/api/parking/book` | Book a parking slot |
| `POST` | `/api/visitors/add` | Register a new visitor |
| `GET` | `/api/visitors/list` | Get all visitors |
| `POST` | `/api/qr/scan-qr` | Unified QR scan (entry/exit) |
| `POST` | `/api/qr/generate` | Generate a QR pass |
| `GET` | `/api/analytics/dashboard` | Get analytics KPIs |
| `GET` | `/api/notifications` | Fetch notifications |
| `POST` | `/api/notifications/read` | Mark notifications as read |

---

## 🖥️ App Navigation

| Tab | Page Component | Description |
|-----|---------------|-------------|
| **Overview** | `AdminPanel` | Dashboard with analytics, KPIs, and charts |
| **Book Slot** | `BookingPage` | Interactive parking slot booking interface |
| **Visitors** | `VisitorEntry` | Visitor registration form with QR generation |
| **Terminal** | `GuardScanner` | QR camera scanner for guard entry/exit processing |

---

## 📜 License

This project is licensed under the **MIT License**.
