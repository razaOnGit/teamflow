# TeamFlow Installation Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd teamflow
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start the frontend development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/teamflow"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database: `createdb teamflow`
3. Update the `DATABASE_URL` in backend/.env
4. Run migrations: `npm run migrate`

### Option 2: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name teamflow-postgres \
  -e POSTGRES_DB=teamflow \
  -e POSTGRES_USER=teamflow \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://teamflow:password@localhost:5432/teamflow"
```

### Option 3: Cloud Database (Railway/Supabase/etc.)
1. Create a PostgreSQL database on your preferred cloud provider
2. Copy the connection string to `DATABASE_URL` in backend/.env
3. Run migrations: `npm run migrate`

## Production Deployment

### Backend (Railway)
1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Railway will automatically deploy on push

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set `VITE_API_URL` to your production backend URL

## Development Commands

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
npm run studio       # Open Prisma Studio (database GUI)
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Default Admin User

After running migrations, you can create an admin user by signing up with role "ADMIN" through the frontend, or by directly inserting into the database.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env
   - Check frontend is running on correct port

3. **JWT Errors**
   - Ensure JWT_SECRET is set in backend .env
   - Clear localStorage if tokens are invalid

4. **Port Already in Use**
   - Change PORT in backend .env
   - Change port in frontend vite.config.js

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run migrate
```

### View Database
```bash
cd backend
npm run studio
```

## API Documentation

Once the backend is running, you can test the API endpoints:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Tasks
- `GET /api/projects/:id/tasks` - List project tasks
- `POST /api/projects/:id/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

## Support

If you encounter any issues during installation, please check:
1. Node.js and PostgreSQL versions
2. Environment variable configuration
3. Database connectivity
4. Port availability

For additional help, refer to the main README.md or create an issue in the repository.