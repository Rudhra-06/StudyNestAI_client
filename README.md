# StudyNestAI Frontend Client

AI-Powered Student Life Management System - React Frontend

## 🚀 Features

- **Role-Based Dashboards**: Student, Faculty, Warden, Admin
- **Study Bot Module**: Track study sessions, streaks, and credits
- **Hostel Companion**: Submit complaints, track expenses, view notices
- **Emergency Alerts**: Real-time emergency notifications
- **Authentication**: JWT-based login/register system

## 📦 Tech Stack

- React (Vite)
- React Router DOM
- Axios
- Socket.io Client
- Context API

## 🛠️ Installation

```bash
npm install
```

## ⚙️ Configuration

Update backend API URL in `src/utils/api.js`:

```javascript
const API = axios.create({
  baseURL: 'http://localhost:5001/api'
});
```

## 🚀 Run Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── StudentDashboard.jsx
│   │   ├── FacultyDashboard.jsx
│   │   ├── WardenDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 👥 User Roles

### Student Dashboard
- Start/End study sessions
- View study streak and credits
- Submit complaints
- Track expenses
- View notices
- Trigger emergency alerts

### Warden Dashboard
- View all complaints
- Update complaint status
- Receive emergency alerts
- Monitor hostel activities

### Faculty Dashboard
- View student analytics
- Monitor productivity

### Admin Dashboard
- Full system access
- System analytics

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically sent with all API requests
4. Protected routes check authentication

## 🌐 Backend Repository

Connect with backend server:
https://github.com/Rudhra-06/StudyNestAI_server.git

## 🎯 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Make sure backend is running on port 5001
4. Start frontend: `npm run dev`
5. Open browser: `http://localhost:5173`

## 📝 Environment

- Backend API: `http://localhost:5001`
- Frontend: `http://localhost:5173`
- Socket.io: `http://localhost:5001`

## 🚨 Features Demo

### Student Features:
- Study session tracking with timer
- Complaint submission system
- Emergency alert button
- Notice board
- Expense tracking

### Warden Features:
- Real-time emergency alerts
- Complaint management
- Status updates

## 📝 License

MIT
