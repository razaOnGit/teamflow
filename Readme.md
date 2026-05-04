# 🗂️ TeamFlow — Team Task Manager

> A full-stack project & task management web app with role-based access, built for teams that ship fast.

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live App | _Coming soon (Railway)_ |
| 📁 GitHub Repo | _your-repo-link-here_ |

---

## 📐 MVP Plan

### What We're Building

A lightweight but complete task management system where:
- Users **sign up / log in** securely
- Admins **create projects** and assign members
- Members **create & track tasks** inside projects
- Everyone sees a **live dashboard** with project/task status at a glance

---

## 🗂️ App Structure

```
teamflow/
├── frontend/          # React + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   │   ├── ProjectList.jsx     # Project status tabs
│   │   │   │   └── ProjectCard.jsx
│   │   │   ├── Project/
│   │   │   │   ├── ProjectDetail.jsx   # Tasks inside a project
│   │   │   │   └── CreateProject.jsx
│   │   │   └── Task/
│   │   │       ├── TaskDetail.jsx
│   │   │       └── CreateTask.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── api/
│   │       └── axios.js               # Axios instance with auth headers
│
├── backend/           # Node.js + Express + PostgreSQL (or MongoDB)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   └── task.controller.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT verify
│   │   │   └── role.middleware.js      # Admin/Member guard
│   │   └── app.js
│   └── .env
│
└── README.md
```

---

## 🎨 Frontend

### 1. Authentication Pages

**Signup (`/signup`)**
- Fields: Name, Email, Password, Confirm Password
- Role selection: Admin / Member
- Form validation (client + server)
- Redirect to Dashboard on success

**Login (`/login`)**
- Fields: Email, Password
- JWT stored in `localStorage` or `httpOnly cookie`
- Redirect to Dashboard on success

**Logout**
- Clear token
- Redirect to `/login`

---

### 2. Dashboard (`/dashboard`)

The main screen after login. Shows:

#### 📊 Top Stats Bar
| Stat | Description |
|------|-------------|
| Total Projects | Count of all user's projects |
| Open | Projects with status `open` |
| In Progress | Projects with status `in_progress` |
| On Hold | Projects with status `on_hold` |
| Resolved | Projects with status `resolved` |
| Cancelled | Projects with status `cancelled` |

#### 🔘 Status Filter Tabs
Horizontal tab bar to filter project list:
```
[ All ] [ Open ] [ In Progress ] [ On Hold ] [ Resolved ] [ Cancelled ]
```
- Active tab highlighted
- Count badge next to each tab (e.g., "Open (4)")
- Project cards update below on tab click

#### ➕ Create Project Button
- Top-right of dashboard
- Opens a modal or navigates to `/projects/create`
- **Admin only** (hidden from Members)

#### 📋 Project Cards Grid
Each card shows:
- Project name & description
- Status badge (color-coded)
- Deadline
- Assigned member count
- Task progress bar (e.g., 3/8 tasks done)
- Click → goes to Project Detail page

---

### 3. Project Detail Page (`/projects/:id`)

- Project name, description, status, deadline
- Member list
- **Task List** with filters: `To Do | In Progress | Done | Overdue`
- **Create Task** button (Admin or assigned Member)
- Each task shows: title, assignee, priority, due date, status

---

### 4. Task Detail / Edit (`/tasks/:id`)

- Title, description, status, priority, assignee, due date
- Edit form (Admin can change assignee; Member can update status)
- Delete task (Admin only)

---

## ⚙️ Backend

### Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (via Prisma ORM) or MongoDB (via Mongoose) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | express-validator or Zod |
| Hosting | Railway |

---

### Database Schema

#### Users
```
id, name, email, password (hashed), role (admin|member), created_at
```

#### Projects
```
id, name, description, status (open|in_progress|on_hold|resolved|cancelled),
deadline, created_by (→ User), created_at
```

#### ProjectMembers _(join table)_
```
project_id (→ Project), user_id (→ User), joined_at
```

#### Tasks
```
id, title, description, status (todo|in_progress|done),
priority (low|medium|high), due_date, project_id (→ Project),
assigned_to (→ User), created_by (→ User), created_at
```

---

### REST API Endpoints

#### Auth
```
POST   /api/auth/signup       → Register user
POST   /api/auth/login        → Login, return JWT
POST   /api/auth/logout       → Clear session (client-side)
GET    /api/auth/me           → Get current user (protected)
```

#### Projects
```
GET    /api/projects          → All projects (filtered by role)
GET    /api/projects/:id      → Single project
POST   /api/projects          → Create project (Admin only)
PUT    /api/projects/:id      → Update project (Admin only)
DELETE /api/projects/:id      → Delete project (Admin only)
POST   /api/projects/:id/members   → Add member (Admin only)
DELETE /api/projects/:id/members/:userId  → Remove member
```

#### Tasks
```
GET    /api/projects/:id/tasks     → All tasks in project
GET    /api/tasks/:id              → Task detail
POST   /api/projects/:id/tasks     → Create task
PUT    /api/tasks/:id              → Update task
DELETE /api/tasks/:id              → Delete task (Admin only)
```

#### Users
```
GET    /api/users             → List all users (Admin only)
```

---

### Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| Create / Delete Project | ✅ | ❌ |
| Add / Remove Members | ✅ | ❌ |
| Create Task | ✅ | ✅ (own projects) |
| Update Task Status | ✅ | ✅ (assigned only) |
| Delete Task | ✅ | ❌ |
| View Dashboard | ✅ | ✅ |

---

## 🚦 Project Status Flow

```
         ┌─────────┐
         │  Open   │ ← newly created
         └────┬────┘
              │
         ┌────▼────────┐
         │ In Progress │ ← work started
         └────┬────────┘
              │
     ┌────────┴─────────┐
     │                  │
┌────▼────┐        ┌────▼─────┐
│On Hold  │        │ Resolved │ ← completed
└─────────┘        └──────────┘
     │
┌────▼─────┐
│Cancelled │ ← abandoned
└──────────┘
```

---

## 🚀 Deployment (Railway)

### Backend
1. Push code to GitHub
2. Create new Railway project → connect repo
3. Set environment variables:
   ```
   DATABASE_URL=...
   JWT_SECRET=...
   PORT=5000
   NODE_ENV=production
   ```
4. Railway auto-detects Node.js and runs `npm start`

### Frontend
1. Build: `npm run build`
2. Deploy to Railway (or Vercel/Netlify as static site)
3. Set env: `VITE_API_URL=https://your-backend.railway.app`

### Database
- Provision PostgreSQL directly in Railway dashboard
- Copy `DATABASE_URL` to backend env variables
- Run migrations: `npx prisma migrate deploy`

---

## ⏱️ 8–12 Hour Build Timeline

| Hour | Task |
|------|------|
| 0–1 | Project setup, folder structure, DB schema |
| 1–2 | Auth backend (signup/login/JWT) |
| 2–3 | Auth frontend (Login/Signup pages) |
| 3–4 | Projects API (CRUD + role guards) |
| 4–5 | Dashboard UI (status tabs, project cards) |
| 5–6 | Tasks API (CRUD + assignment) |
| 6–7 | Project Detail + Task list UI |
| 7–8 | RBAC wiring, protected routes |
| 8–9 | Railway deployment + env setup |
| 9–10 | End-to-end testing, bug fixes |
| 10–11 | Polish UI, loading states, error handling |

---

## 🌱 Environment Variables

**Backend `.env`**
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/teamflow
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Validations

- Email format check on signup
- Password minimum 8 characters
- Project deadline must be a future date
- Task cannot be assigned to a non-member
- Status transitions validated server-side
- All protected routes return `401` if no/invalid JWT
- Role-restricted routes return `403` if unauthorized

---

## 📦 Tech Summary

| Part | Stack |
|------|-------|
| Frontend | React, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| Deployment | Railway (backend + DB), Vercel (frontend) |
| Version Control | Git + GitHub |

---

---

_Built as part of a full-stack engineering assessment. Focus: clean architecture, role-based access, and real-world deployment._