<div align="center">
  <img src="https://i.pinimg.com/originals/71/65/88/71658839bb2fea95bdbc036076e9324b.gif" width="120" alt="TriggerPulse Pulse" />
  <h1>TriggerPulse ⚡</h1>
  <p><strong>Eliminate cold starts. Keep your backends awake — automatically.</strong></p>
</div>

---

## 🚀 What is TriggerPulse?

**TriggerPulse** is a self-hosted backend trigger system that prevents your services from going idle.

Free-tier platforms like Render or similar providers often put apps to sleep after inactivity. TriggerPulse solves that by **automatically pinging your backend at controlled intervals**, ensuring it's always ready when users hit it.

---

## 🌐 Live Application
- **App**: https://auto-trigger-your-backend.vercel.app

---

## ⚡ Core Capabilities

- **Auto Wake-Up Engine**  
  Keeps services alive with scheduled background triggers.

- **Smart Retry Logic**  
  Handles cold starts intelligently — timeouts don’t break the system.

- **Controlled Concurrency**  
  Prevents overload using batched request execution.

- **Self-Keep-Alive System**  
  Built-in self-ping ensures the trigger service itself never sleeps.

- **Approval-Based Filtering**  
  Only verified URLs are activated — no spam, no garbage requests.

- **Secure Email Verification**  
  Built with Resend to ensure only valid users can submit URLs and access the dashboard.

---

## 🧠 How It Works

1. Users submit backend URLs  
2. Admin approves valid services  
3. TriggerPulse:
   - Pings each service at intervals  
   - Detects failures vs wake-ups  
   - Maintains uptime stability automatically  

---

## 👥 Usage

### Standard Users
- Submit up to **3 backend URLs**
- Monitor:
  - Last Trigger Time  
  - Status (Alive / Unstable)  
  - Failure count  
- Delete submissions anytime to manage quota  

---

### Admin
- Full control over all submissions  
- Approve / Reject / Remove URLs  
- Monitor global system health and stats  

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Framer Motion
- Axios

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Node-Cron (scheduler)
- Bcrypt (security)

---

## 🎯 Why This Exists

Cold starts kill user experience.

TriggerPulse exists to:
- eliminate startup delays  
- maintain backend responsiveness  
- give developers control over uptime — without paid plans  

---

## 👨‍💻 Author

Built by **[owsam22](https://github.com/owsam22)**  

If this project helps you, ⭐ the repo — or better, fork it and improve it.