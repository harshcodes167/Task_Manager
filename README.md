# TaskFlow — Scalable REST API with Auth & RBAC

A full-stack Task Manager with JWT authentication, role-based access control, and a React frontend.

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs  
**Frontend:** React.js (Vite), React Router, Axios, react-hot-toast  
**Docs:** Swagger UI (OpenAPI 3.0)  

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

---

## Setup & Run

### 1. Clone / extract the project

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — update MONGODB_URI and JWT_SECRET
npm run dev
```

Backend runs at: `http://localhost:5000`  
Swagger docs at: `http://localhost:5000/api-docs`

### 3. Frontend Setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints (v1)

### Auth — `/api/v1/auth`
| Method | Endpoint    | Auth | Description        |
|--------|-------------|------|--------------------|
| POST   | /register   | No   | Register user      |
| POST   | /login      | No   | Login, get JWT     |
| GET    | /me         | JWT  | Get current user   |

### Tasks — `/api/v1/tasks`
| Method | Endpoint | Auth | Description           |
|--------|----------|------|-----------------------|
| GET    | /        | JWT  | Get tasks (filtered)  |
| GET    | /:id     | JWT  | Get single task       |
| POST   | /        | JWT  | Create task           |
| PUT    | /:id     | JWT  | Update task           |
| DELETE | /:id     | JWT  | Delete task           |

### Admin — `/api/v1/admin` (Admin only)
| Method | Endpoint     | Auth       | Description       |
|--------|--------------|------------|-------------------|
| GET    | /stats       | JWT+Admin  | Platform stats    |
| GET    | /users       | JWT+Admin  | All users         |
| DELETE | /users/:id   | JWT+Admin  | Delete a user     |

---

## Database Schema

### User
- `name` String, required
- `email` String, unique, required
- `password` String, hashed (bcrypt, salt 12)
- `role` Enum [user, admin]
- `isActive` Boolean

### Task
- `title` String, required
- `description` String
- `status` Enum [todo, in-progress, done]
- `priority` Enum [low, medium, high]
- `dueDate` Date
- `user` ObjectId (ref: User)

---

## Security
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens with configurable expiry
- Helmet.js for HTTP headers
- CORS restricted to localhost:3000 and 5173
- Rate limiting (100 req/15min per IP)
- Input validation with express-validator
- Role-based middleware on all admin routes
