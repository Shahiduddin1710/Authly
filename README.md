# SafeAuth – Secure 2FA Authenticator App

## 🔐 Overview

SafeAuth is a modern, secure, and minimal 2-Factor Authentication (2FA) mobile application built using React Native (Expo) and Node.js.

It allows users to securely store their 2FA accounts, generate real-time OTP codes, scan QR codes, and sync data with Firebase Firestore.

---

## ✨ Features

### 🔑 Authentication

- Email + Password Signup/Login
- OTP verification via email (Nodemailer)
- Forgot Password & Reset flow

### 🔐 2FA Vault

- Add accounts via QR code scanning
- Manual secret key entry
- Real-time TOTP generation (30s refresh)
- Copy OTP instantly
- Edit and delete accounts

### ☁️ Cloud Sync

- Firebase Firestore integration
- Secure per-user storage

### 🎨 UI/UX

- Clean fintech-style design
- Smooth animations
- Minimal modern layout

---

## 🏗️ Tech Stack

### Frontend

- React Native (Expo)
- TypeScript
- Expo Router
- AsyncStorage
- Axios

### Backend

- Node.js
- Express.js
- Firebase Admin SDK
- Firestore Database

### Security & Utilities

- otplib (TOTP)
- bcryptjs (password hashing)
- nodemailer (OTP email)
- jsQR (QR scanning)
- sharp (image processing)

---

## ⚙️ Environment Variables

Create a `.env` file inside backend:

PORT=5000

FIREBASE_PROJECT_ID=your_project_id  
FIREBASE_CLIENT_EMAIL=your_client_email  
FIREBASE_PRIVATE_KEY=your_private_key

EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_app_password

---

## 🚀 Getting Started

### 1. Clone Repository

git clone https://github.com/Shahiduddin1710/Safe-Auth.git  
cd safeauth

---

### 2. Backend Setup

cd backend  
npm install  
npm run dev

---

### 3. Frontend Setup

cd frontend  
npm install  
npx expo start

---

### 4. Run on Android

npx expo run:android

---

## 🔌 API Endpoints

### Auth

POST /api/auth/signup  
POST /api/auth/verify-otp  
POST /api/auth/login  
POST /api/auth/forgot-password  
POST /api/auth/reset-password

### Accounts

POST /api/accounts/add  
POST /api/accounts/scan-qr  
POST /api/accounts/generate-totp  
GET /api/accounts/:uid  
DELETE /api/accounts/:uid/:accountId  
PUT /api/accounts/:uid/:accountId

---

## 🔒 Security Features

- Password hashing using bcrypt
- OTP expiry system (10 minutes)
- TOTP time-based generation
- Firebase secure storage
- No plaintext password storage

---

## 📦 Build APK

eas build -p android --profile preview

---

## 📱 App Screenshots

<p align="center">
  <img src="./snapshots/login.png" width="200"/>
  <img src="./snapshots/signup.png" width="200"/>
  <img src="./snapshots/Dashboard.png" width="200"/>
</p>

<p align="center">
  <img src="./snapshots/add-account.png" width="200"/>
  <img src="./snapshots/Cloud-Sync.png" width="200"/>
  <img src="./snapshots/Profile.png" width="200"/>
</p>

---

## 👨‍💻 Author

Shahiduddin (Shaho) – VCET Vasai
