# Index Motors — Commercial Dealership & Workshop Management System (v3.0.0)

[![Build Android APK](https://github.com/cmshakir/index-motors-manager/actions/workflows/build-android-apk.yml/badge.svg)](https://github.com/cmshakir/index-motors-manager/actions/workflows/build-android-apk.yml)

A high-performance management platform designed for commercial vehicle dealerships and heavy-duty repair workshops (specialized for **Swaraj Mazda** and **Tata** trucks, lorries, tippers, and buses).

---

## 📖 Complete Documentation

Detailed technical and operational manual is available at:
👉 **[Read the Full System Documentation (DOCUMENTATION.md)](DOCUMENTATION.md)**

---

## 🚀 Key Highlights & Platforms

* **💻 Windows PC Desktop App (`.exe`)**:
  - Offline-first JSON storage in `%APPDATA%`.
  - Native Windows Shell integration for WhatsApp Desktop.
  - Setup Installer: `release/Index Motors-Setup-3.0.0.exe`
  - Portable Binary: `release/Index Motors-Portable-3.0.0.exe`

* **📱 Android Mobile App (`.apk`)**:
  - Built with Capacitor 8 and Java 21 on Android Platform 36.
  - Custom native `WhatsAppLauncherPlugin.java` bypassing Android 11+ package restrictions.
  - Direct download via [GitHub Actions CI](https://github.com/cmshakir/index-motors-manager/actions).

* **💬 Native WhatsApp Dispatch Engine**:
  - 1-Click invoice and job card dispatch with customer phone auto-formatting (+91 Indian standard).
  - Dual-tier routing: launches native WhatsApp Desktop / Mobile App with automated fallback to WhatsApp Web.

* **🚛 Commercial Dealership CRM & Workshop**:
  - Swaraj Mazda & Tata vehicle sales pipeline with commercial loan EMI calculator.
  - Workshop Job Cards with Kanban board, inspection checklists, and technician bay allocation.
  - Commercial billing with GST tax computation, partial payment settlements, and print engine.

* **☁️ Cloud & Local Hybrid Storage**:
  - Offline persistence with Supabase Realtime synchronization.

---

## 🛠 Quick Start

### Web Development
```bash
npm install
npm run dev
```

### Windows Desktop Package
```bash
npm run electron:build
```

### Android Synchronization
```bash
npm run build
npx cap sync android
```
