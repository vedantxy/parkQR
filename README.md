#  ParkQR — Smart QR-Based Parking & Visitor Management

> Real-time, paperless parking and visitor management powered by dynamic QR codes, automated billing, and live analytics.

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

### 🔗 Figma Link
👉 **[View Full Figma Design](https://www.figma.com/proto/KxdacndljNmlOhHl1HTTVM/Untitled?page-id=392%3A2&node-id=398-1773&p=f&viewport=604%2C289%2C0.1&t=HXsAZWVVL4Ppeoch-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=398%3A1773)**

---

## 🚨 The Problem

Manual parking systems are slow, error-prone, and costly. Key pain points:

- **Long wait times** — 8–15 min average entry/exit per vehicle
- **No real-time visibility** — drivers waste fuel searching for open slots
- **Paper-based logs** — easy to forge, impossible to audit
- **Revenue leakage** — unbilled overstays and ghost entries
- **Zero analytics** — admins fly blind with no usage data

> A typical 500-slot facility loses ₹3–8 lakh annually from manual mismanagement alone.

---

## 💡 The Solution

ParkQR replaces paper tickets and manual logbooks with **dynamic, encrypted, time-bound QR codes** — one per vehicle or visitor. Every scan-in/scan-out is logged instantly, slots update in real time, and billing is fully automated.

```
Arrive → QR Generated → Scan Entry → Slot Auto-Assigned
   ↓
Live Dashboard Updates → Overstay Alerts
   ↓
Scan Exit → Bill Calculated → Payment → QR Invalidated
```

No app install required. Works on any mobile browser via a Progressive Web App.

---

## 📄 Pages

| Page | Description |
|---|---|
| **Login** | Role-based auth for Admin, Gate Operator, and Visitor |
| **Dashboard** | Live occupancy stats, revenue summary, gate throughput |
| **Slot Map** | Real-time visual grid — color-coded by availability and zone |
| **Visitor Management** | Pre-register visitors, issue digital passes, manage blacklist/whitelist |
| **Billing & Invoices** | Auto-calculated charges, grace periods, downloadable invoices |
| **Analytics & Reports** | Heatmaps, peak-hour trends, revenue charts, CSV/PDF export |
| **Gate Operator Interface** | Offline-capable PWA for scan-in/scan-out at entry/exit gates |
| **Settings / Profile** | Facility config, pricing rules, user management |

---

## 📞 Contact

**Vedant Patel** — Lead Developer  
📧 vedantpatelxy12@gmail.com · [GitHub Discussions](#)

---

<div align="center">
  Built with ❤️ to solve real parking chaos &nbsp;|&nbsp; MIT License
</div>
