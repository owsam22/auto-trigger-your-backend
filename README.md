<div align="center">
  <img src="https://i.pinimg.com/originals/71/65/88/71658839bb2fea95bdbc036076e9324b.gif" width="120" alt="TriggerPulse Pulse" />
  <h1>TriggerPulse ⚡</h1>
  <p><strong>Keep your sleeping backends awake and responsive, automatically.</strong></p>
</div>

---

**TriggerPulse** is a professional backend monitoring and wake-up service designed to prevent cold starts on services like Render, Heroku, or any free-tier hosting that sleeps after inactivity.

### 🌐 Live Application
- **App**: [https://auto-trigger-your-backend.vercel.app](https://auto-trigger-your-backend.vercel.app) 

---

## 🔥 Key Features

- **Instant Activation**: Your first trigger happens immediately upon admin approval.
- **Optimized 10-Min Cycle**: Staggered auto-triggering ensures your backends stay awake without overloading our servers.
- **Smart 5-Min Self-Ping**: Background workers keep our own service alive continuously.
- **Unified "One Box" UI**: Beautiful, fully-centered Universal Modals powered by *Framer Motion* for submissions, alerts, and deletion flows.
- **Self-Service Deletion**: Users can permanently remove their submissions via a secure, irreversible deletion workflow to reclaim their quota.

## 👥 Usage & Quotas

### Free Plan (Standard User)
- Submit and monitor up to **3 active backend URLs**.
- Delete URLs directly from your customized dashboard to free up slots.
- Clean, minimal dashboard tracking the 'Last Triggered' timestamp, consecutive failures, and "Alive/Unstable" status.

### Admin Plan
- Unlimited URL monitoring.
- Powerful Admin Panel to **Approve, Reject, or Force-Delete** any global submission.
- Real-time global stats (Total, Pending, Approved, Rejected, Unstable).

---

## 🛠 Tech Stack

### Frontend
- **React + Vite**: Lightning-fast build and HMR.
- **Framer Motion**: Spring-based animations for modals, dashboards, and page transitions.
- **Lucide React**: Clean, modern iconography perfectly aligned with our glassmorphic aesthetic.
- **Axios**: Network requests with JWT interceptors.

### Backend
- **Node.js + Express**: Robust REST API router logic.
- **MongoDB + Mongoose**: Persistent schema-based storage for Users and Submissions.
- **JSON Web Tokens (JWT)**: Secure, stateless authentication with `HttpOnly` cookie-like security (via headers).
- **Node-Cron**: Powering the core 10-minute automated trigger engine.
- **Bcrypt.js**: Industry-standard password hashing.

---

## 👨‍💻 Built By
Created with ❤️ by **[owsam22](https://github.com/owsam22)**. 

If this project saved you from cold-start latency headaches, feel free to give it a ⭐ on GitHub!
