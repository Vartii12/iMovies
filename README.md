# iMovies - Movie Ticket Booking System

A scalable full-stack movie reservation platform built following the **Client–Server** and **Model-View-Controller (MVC)** architectural patterns.

## 🚀 Key Features
- **Browse Movies & Shows**: Dynamic movie catalog with genre filters, full-text search, and showtime schedules.
- **Real-Time Seat Booking**: Dynamic tiered seating layouts (Balcony, Middle, Lower) with interactive status updates (Available, Selected, Booked).
- **Authentication & Security**: Role-based access control (Admin & User) using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Admin Dashboard**: Manage movie catalogs, register multiplex theatres, schedule screenings, and view customer booking reports.
- **Watchlist & History**: Track personal reservation history and maintain movie favorites.

---

## 🛠️ Tech Stack
- **Frontend**: React.js 18, Vite, React Router v6, Axios, SCSS, Bootstrap, React Icons, React Toastify, Day.js
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, Node-cron, Nodemailer
- **Database**: MongoDB (with automated embedded fallback engine for zero-setup local development)

---

## 💻 Getting Started

### 1. Backend Server Setup
```bash
cd server
npm install
npm start # or node server.js
```
The server will start on `http://localhost:8000`.

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
The client application will start on `http://localhost:5173`.
