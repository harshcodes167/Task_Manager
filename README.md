# TaskFlow — Scalable REST API with Auth & RBAC

A full-stack Task Manager application built with Node.js, Express, MongoDB, and React. Features JWT authentication, role-based access control (user/admin), full CRUD operations, Swagger API documentation, and a clean dark-themed frontend.

---

## 🔗 Repository

> GitHub: [your-github-link-here]

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Security | Helmet.js, CORS, Rate Limiting |
| API Docs | Swagger UI (OpenAPI 3.0) |
| Frontend | React.js (Vite), React Router v6 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## ✅ Features Implemented

### Backend
- User registration & login with bcrypt password hashing (salt rounds: 12)
- JWT-based authentication with configurable expiry
- Role-based access control — `user` and `admin` roles
- Full CRUD REST API for Tasks (with filtering & pagination)
- Admin-only endpoints for user management and platform stats
- API versioning (`/api/v1/`)
- Global error handling middleware
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes per IP)
- HTTP security headers via Helmet
- Swagger/OpenAPI documentation

### Frontend
- Register & Login pages with form validation
- Protected routes (JWT required to access dashboard)
- Task dashboard: create, edit, delete, update status
- Filter tasks by status and priority
- Admin panel: view all users, delete users, view stats
- Success/error toast notifications
- Responsive dark UI

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── swagger.js         # Swagger config
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, Login, Me
│   │   │   ├── taskController.js  # Task CRUD
│   │   │   └── adminController.js # Admin routes
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT protect + authorize
│   │   │   ├── validate.js        # Validation result handler
│   │   │   └── errorHandler.js    # Global error handler
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── response.js
│   │   ├── validators/
│   │   │   └── index.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
├── README.md
└── SCALABILITY.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB (local installation or MongoDB Atlas free tier)
- npm

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
```

> If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

Start the backend server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`  
Swagger docs at: `http://localhost:5000/api-docs`

---

### Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication — `/api/v1/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /register | No | Register a new user |
| POST | /login | No | Login and receive JWT token |
| GET | /me | JWT | Get current logged-in user |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | / | JWT | Get all tasks (admin sees all, user sees own) |
| GET | /:id | JWT | Get a single task by ID |
| POST | / | JWT | Create a new task |
| PUT | /:id | JWT | Update an existing task |
| DELETE | /:id | JWT | Delete a task |

Query params for GET /tasks: `?status=todo&priority=high&page=1&limit=10`

### Admin — `/api/v1/admin` *(Admin role required)*

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /stats | JWT + Admin | Platform statistics |
| GET | /users | JWT + Admin | List all users |
| DELETE | /users/:id | JWT + Admin | Delete a user and their tasks |

---

## 🗄️ Database Schema

### User Collection
```
name        String   required, 2-50 chars
email       String   required, unique
password    String   hashed with bcrypt (salt: 12)
role        Enum     ['user', 'admin']  default: 'user'
isActive    Boolean  default: true
createdAt   Date     auto
updatedAt   Date     auto
```

### Task Collection
```
title       String   required, 3-100 chars
description String   optional, max 500 chars
status      Enum     ['todo', 'in-progress', 'done']  default: 'todo'
priority    Enum     ['low', 'medium', 'high']  default: 'medium'
dueDate     Date     optional
user        ObjectId ref: User (required)
createdAt   Date     auto
updatedAt   Date     auto
```

Indexes applied on `{ user, status }` and `{ user, createdAt }` for query performance.

---

## 🔒 Security Practices

- Passwords hashed using **bcrypt** with salt rounds of 12
- **JWT tokens** signed with a secret key, verified on every protected request
- **Helmet.js** sets secure HTTP response headers
- **CORS** restricted to trusted origins only (`localhost:3000`, `localhost:5173`)
- **Rate limiting** — 100 requests per 15 minutes per IP address
- **Input validation** on all POST/PUT endpoints via express-validator
- **Role-based middleware** protects all admin routes
- JWT payload contains only `id` and `role` (no sensitive data)
- Passwords excluded from all API responses via `select: false`

---

## 📊 API Documentation

Swagger UI is available once the backend is running:

```
http://localhost:5000/api-docs
```

Click **Authorize** and enter your JWT token as `Bearer <your_token>` to test protected routes.

---

## 🚀 Scalability

See [SCALABILITY.md](./SCALABILITY.md) for a detailed note on scaling this system.

Key scalability decisions already built in:
- Stateless JWT auth — horizontally scalable from day one
- Modular controller/route structure — easy microservice extraction
- MongoDB indexes for performant queries at scale
- Environment-based config (12-factor app ready)
- Docker-ready structure

---

## 👤 Author

**[Your Name]**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your@email.com

---

*Built as part of the Primetrade.ai Backend Developer Intern Assignment*
