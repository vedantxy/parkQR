# 🅿️ ParkSmart: Enterprise-Grade AI Parking & Visitor Management

ParkSmart is a production-ready, SaaS-level solution for modern residential societies, corporate campuses, and smart cities. It leverages real-time automation, AI-driven parking allocation, and advanced analytics to streamline facility management.

![Project Status](https://img.shields.io/badge/Status-Production--Ready-success)
![Technology](https://img.shields.io/badge/Stack-MERN%20+%20Socket.IO-blue)

## 🌟 Key Features

### 📡 Real-Time Security Engine
*   **Instant Notifications**: Powered by Socket.IO for real-time entry/exit alerts.
*   **Overstay Detection**: Automated background monitoring to identify vehicles exceeding their time limits.
*   **Dynamic Toasts**: Interactive real-time alerts for security personnel.

### 📊 Intelligent Analytics Center
*   **Data Aggregation**: MongoDB-powered pipelines for daily visitor trends.
*   **Visual KPIs**: Responsive charts (Recharts) showing occupancy rates, peak hours, and security alerts.
*   **Audit Logging**: Full history of visitor movements and parking usage.

### 🛂 Smart Visitor Entry (QR-Based)
*   **Instant Pass Generation**: QR-based entry tokens for contactless check-ins.
*   **Priority (VIP) System**: Tiered slot allocation for VIP guests.
*   **Multi-Gate Support**: Unified control for facilities with multiple entrance/exit points.

### 🏗️ Fail-Safe Architecture
*   **Intelligent Mock Mode**: The system automatically switches to an in-memory data store if the database is offline, ensuring 100% uptime for testing.
*   **Clean MVC Structure**: Scalable backend designed for enterprise growth.

## 🛠️ Tech Stack

- **Frontend**: React.js, Recharts, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (Mongoose)
- **Styling**: Modern CSS3 (Glassmorphism & SaaS Aesthetics)

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB (Optional, system has a built-in Mock Mode)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Running the System
```bash
# Start Backend (Port 5000)
cd backend
node server.js

# Start Frontend (Port 5173)
cd frontend
npm run dev
```

### 4. Seed Data (Optional)
To populate the parking slots:
```bash
node backend/seedParking.js
```

## 📂 Project Structure

```text
├── backend/
│   ├── controllers/    # Business Logic (Analytics, Visitors, etc.)
│   ├── models/         # Database Schemas
│   ├── routes/         # API Endpoints
│   ├── utils/          # Real-time & Mock Data Helpers
│   └── server.js       # Socket.IO & HTTP Server
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable SaaS components (Charts, Alerts)
│   │   ├── pages/      # Command Center, Scanner, Registration
│   │   └── utils/      # Socket.IO client config
```

## 📜 License
This project is licensed under the MIT License.
