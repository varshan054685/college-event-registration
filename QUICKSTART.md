# ⚡ Quick Start — 5 Minutes to Running Locally

## Prerequisites
- Node.js v16+ ([download](https://nodejs.org))
- MongoDB Atlas account ([free signup](https://mongodb.com/atlas))
- Git

## Step 1: Get MongoDB Connection String (2 min)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up or log in
3. Create a new **Free M0 cluster**
4. Go to **Database** → **Connect**
5. Choose **Drivers** → **Node.js**
6. Copy your connection string: `mongodb+srv://username:password@cluster.mongodb.net/college-events`

## Step 2: Clone & Install (1 min)

```bash
# Clone repository
git clone <your-repo-url>
cd college-events

# Install all dependencies
npm run install:all
```

## Step 3: Configure Environment (30 sec)

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and update:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/college-events
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Step 4: Seed Sample Data (1 min)

```bash
cd .. # back to root
npm run seed
```

Creates 8 sample events + admin account:
- **Admin:** admin@college.edu / admin123
- **Student:** student@college.edu / student123

## Step 5: Start Development Servers (30 sec)

```bash
npm run dev
```

Wait for both to start:
```
✓ Frontend: http://localhost:5173
✓ Backend: http://localhost:5000
```

## You're Done! 🎉

### What to Try First

1. **Homepage** — See hero + featured events
2. **Login** — Use `admin@college.edu` / `admin123`
3. **Create Event** — Go to `/admin`, create a new event
4. **Register** — Visit `/events`, find event, click "Register Now"
5. **Dashboard** — View your registrations at `/dashboard`

---

## Common Commands

```bash
# From project root:

# Start both servers
npm run dev

# Only start backend
npm run server

# Only start frontend
npm run client

# Seed fresh sample data
npm run seed

# Build frontend for production
cd frontend && npm run build

# Install new dependencies
npm install <package-name>
```

---

## File Structure Quick Reference

```
college-events/
├── backend/        ← API server (Express)
├── frontend/       ← React app (Vite)
├── README.md       ← Full documentation
└── DEPLOYMENT.md   ← How to deploy
```

---

## Troubleshooting

**"Cannot connect to MongoDB"**
→ Check MONGO_URI in `.env` is correct. Verify IP whitelist in MongoDB Atlas.

**"Port 5000 already in use"**
→ Change PORT in `.env` to 5001, or kill existing process.

**"Styles don't load"**
→ Restart Vite server (`Ctrl+C`, then `npm run dev` again)

**"Module not found"**
→ Run `npm run install:all` again, then restart.

---

## Next: Deploy to Production

Once happy with local version, follow [DEPLOYMENT.md](./DEPLOYMENT.md) to go live!

---

**Happy building! 🚀**
