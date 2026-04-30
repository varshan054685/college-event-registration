# 🚀 Deployment Guide

Complete step-by-step guide to deploy **EduFest** to production.

## Option 1: Render + Vercel (Recommended for Beginners)

### Step 1: Prepare GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: EduFest college events platform"
git branch -M main
git remote add origin https://github.com/yourusername/college-events.git
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `college-events-api`
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
5. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-events
   JWT_SECRET=your-super-secret-key-min-32-characters
   JWT_EXPIRES_IN=7d
   PORT=5000
   CLIENT_URL=https://yourfrontend.vercel.app
   NODE_ENV=production
   ```
6. Click **Create Web Service**
7. Wait for deployment (5-10 mins)
8. Get your backend URL: `https://college-events-api.onrender.com`

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://college-events-api.onrender.com
   ```
6. Click **Deploy**
7. Wait for deployment (2-3 mins)
8. Your live URL: `https://yourapp.vercel.app`

### Step 4: Update Backend Client URL

1. Go back to Render dashboard
2. Select your backend service
3. Go to **Environment** → Edit `CLIENT_URL`
4. Change to your Vercel URL
5. Redeploy

---

## Option 2: Railway (All-in-One)

Railway makes it super easy to deploy both frontend and backend together.

### Step 1: Prepare Project

Add this to root `package.json`:
```json
{
  "scripts": {
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects Node.js project
5. Add variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`
6. Railway handles build & deployment automatically
7. Get your live URL from Railway dashboard

---

## Option 3: DigitalOcean App Platform

### Step 1: Create App

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Apps → Create App → GitHub
3. Select repository
4. DigitalOcean auto-detects Node.js

### Step 2: Configure Services

- **Backend Service:**
  - HTTP Port: 5000
  - Build: `cd backend && npm install`
  - Run: `cd backend && npm start`

- **Frontend Service:**
  - Build: `cd frontend && npm run build`
  - Run: serve `frontend/dist` directory

### Step 3: Add Database

1. Create managed MongoDB instance
2. Add connection string to backend env variables
3. Deploy

---

## Monitoring & Maintenance

### Check Logs

**Render:**
```bash
# View logs in Render dashboard
Settings → Logs
```

**Vercel:**
```bash
# View logs in Vercel dashboard
Deployments → select deployment → Logs
```

### Auto-Updates

Both Render and Vercel auto-redeploy when you push to GitHub (on main branch).

### Database Backups

MongoDB Atlas provides automatic backups. Configure:
1. MongoDB Atlas → Clusters → Backup
2. Enable automated backups (default: daily)

---

## Performance Optimization

### Frontend Build

```bash
cd frontend
npm run build
```

Check bundle size:
```bash
npm install -g vite-plugin-visualizer
npm run build
```

### Backend Optimization

1. Add caching headers
2. Compress responses (gzip)
3. Rate limiting
4. Database indexing

```javascript
// server.js
const compression = require('compression');
app.use(compression());
```

### Database Indexing

```javascript
// models/Event.js
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ title: 'text', description: 'text' });
```

---

## Security Checklist

- [ ] Environment variables not in Git (use `.env.example`)
- [ ] HTTPS enabled (auto on Render/Vercel)
- [ ] CORS configured properly
- [ ] JWT secret is strong (32+ characters)
- [ ] Password hashing with bcrypt (10+ rounds)
- [ ] Input validation on all routes
- [ ] No sensitive logs in production
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Rate limiting on auth routes
- [ ] Admin routes protected (role check)

---

## Troubleshooting Deployment

### Backend won't start
```
Check:
1. MONGO_URI is correct
2. Database exists in MongoDB Atlas
3. Port 5000 is available
4. All environment variables set
```

### Frontend shows blank page
```
Check:
1. VITE_API_URL is correct
2. Frontend build completed
3. Backend is running
4. CORS is enabled
```

### CORS errors
```
Update backend server.js:
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Database connection timeout
```
MongoDB Atlas → Network Access:
- Add 0.0.0.0/0 to allow all IPs
- Or add specific server IP
- Check connection string spelling
```

---

## Cost Estimates (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render | 750 free dyno hours | ~$7-15/month after |
| Vercel | Unlimited static | Free for most cases |
| MongoDB Atlas | 512MB free | Free for small apps |
| **Total** | | **~$15-25/month** |

---

## Domain Setup

### Add Custom Domain

**On Vercel:**
1. Settings → Domains
2. Add your domain
3. Update DNS records (show at Vercel dashboard)

**On Render:**
1. Settings → Custom Domain
2. Add domain name
3. Render provides DNS records

**DNS:** Usually updates in 24-48 hours

---

## Continuous Deployment

### Auto-redeploy on GitHub Push

Both Render and Vercel auto-redeploy when you push to `main` branch:

```bash
# Make changes
git add .
git commit -m "Feature: add new animation"
git push origin main

# Render and Vercel automatically redeploy
```

### Manual Redeployment

If auto-deploy fails, manually redeploy:

**Render:** Dashboard → Redeployments → Redeploy latest
**Vercel:** Deployments → select deployment → Redeploy

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor database size
- Verify backups running

**Monthly:**
- Update dependencies
- Review security advisories
- Check analytics/usage

**Quarterly:**
- Optimize slow queries
- Audit user access
- Plan new features

---

## Scaling

As your platform grows:

1. **Database:** Upgrade MongoDB tier (10GB, 100GB+)
2. **API:** Scale Render instance (Professional tier)
3. **Frontend:** Already auto-scales on Vercel
4. **Caching:** Add Redis for sessions
5. **CDN:** Vercel includes CDN globally
6. **Background Jobs:** Add Bull/Agenda for async tasks

---

## Support

- **Render Support:** [docs.render.com](https://docs.render.com)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **MongoDB Support:** [docs.mongodb.com](https://docs.mongodb.com)

---

**Your EduFest platform is now live! 🎉**
