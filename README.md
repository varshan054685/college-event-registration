# 🎓 EduFest — College Events Platform

A **premium, production-ready** college event registration platform built with MERN Stack + Framer Motion. Discover events, register instantly, and manage your college calendar—all in one beautiful, fast, responsive experience.

**🎯 Live Features:**
- ✨ Premium dark theme with glassmorphism UI
- 🎬 Smooth animations with Framer Motion
- 📱 Fully responsive (mobile-first design)
- 🔐 JWT authentication + role-based access
- 🎫 Real-time event registration with capacity management
- 📊 Admin dashboard with CRUD event management
- 🎨 Beautiful hero section with scroll animations
- 🔍 Search, filter, and pagination
- 📧 Toast notifications for all actions

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Configuration](#configuration)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Frontend Architecture](#frontend-architecture)
8. [Animation System](#animation-system)
9. [Deployment](#deployment)
10. [Feature Deep Dives](#feature-deep-dives)

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18, Vite, Redux Toolkit, Framer Motion, React Router v6, Tailwind CSS |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB Atlas (Cloud) |
| **Styling** | Tailwind CSS + Custom CSS variables (dark theme) |
| **Animations** | Framer Motion + CSS animations |
| **State** | Redux Toolkit (auth, events) + React hooks |
| **HTTP** | Axios with JWT interceptors |

---

## 📁 Project Structure

```
college-events/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema + methods
│   │   ├── Event.js             # Event schema + virtuals
│   │   └── Registration.js      # Registration schema + auto ticket ID
│   ├── routes/
│   │   ├── authRoutes.js        # Register, login, profile
│   │   ├── eventRoutes.js       # Event CRUD + search
│   │   └── registrationRoutes.js # Register, cancel, check status
│   ├── middleware/
│   │   └── authMiddleware.js    # protect, adminOnly
│   ├── seed.js                  # Populate 8 sample events
│   ├── server.js                # Express app + routes
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx       # Responsive nav with auth
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── AdminRoute.jsx
│   │   │   ├── events/
│   │   │   │   └── EventCard.jsx    # Animated card with hover effects
│   │   │   └── ui/
│   │   │       └── EventSkeleton.jsx # Shimmer loader
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero + featured + stats + CTA
│   │   │   ├── EventsPage.jsx       # Grid with search/filters
│   │   │   ├── EventDetailPage.jsx  # Full details + registration
│   │   │   ├── LoginPage.jsx        # Auth with demo credentials
│   │   │   ├── RegisterPage.jsx     # Signup with validation
│   │   │   ├── DashboardPage.jsx    # User's registrations
│   │   │   ├── AdminPage.jsx        # Event CRUD table
│   │   │   └── NotFoundPage.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js     # Login, register, logout
│   │   │       └── eventsSlice.js   # Events CRUD, search
│   │   ├── animations/
│   │   │   └── variants.js          # Reusable Framer Motion configs
│   │   ├── utils/
│   │   │   └── api.js               # Axios with JWT interceptor
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # Entry point with Redux
│   │   └── index.css                # Global styles + Tailwind
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
├── package.json                 # Root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ & npm
- MongoDB Atlas account (free tier works!)
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd college-events
npm run install:all  # Installs all dependencies for root, backend, frontend
```

### 2. Database Setup

1. Create free MongoDB Atlas cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and get connection string
3. Copy `.env.example` to `.env` in backend folder:

```bash
cd backend
cp .env.example .env
```

4. Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college-events
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Sample Data

```bash
npm run seed
```

This creates:
- 8 sample events with real images
- Admin user: `admin@college.edu` / `admin123`
- Student user: `student@college.edu` / `student123`

### 4. Run Everything

```bash
# From project root
npm run dev
```

Both servers start automatically:
- 🎨 Frontend: http://localhost:5173
- ⚙️ Backend API: http://localhost:5000

---

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=min32charsecretkeyfortokensigning
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** uses `/api` proxy via Vite config (automatic local requests to backend)

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String ('student' | 'admin'),
  college: String,
  year: String ('1st' | '2nd' | '3rd' | '4th' | 'Faculty'),
  avatar: String (URL),
  registeredEvents: [EventId],
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  shortDescription: String (max 200),
  category: String ('Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Hackathon'),
  date: Date (required),
  endDate: Date,
  venue: String (required),
  capacity: Number,
  registeredCount: Number (auto increment on registration),
  price: Number (0 = free),
  image: String (URL),
  tags: [String],
  organizer: String,
  highlights: [String],
  status: String ('upcoming' | 'ongoing' | 'completed' | 'cancelled'),
  isFeatured: Boolean,
  createdBy: UserId (admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Model
```javascript
{
  _id: ObjectId,
  user: UserId (required),
  event: EventId (required),
  status: String ('confirmed' | 'waitlisted' | 'cancelled'),
  paymentStatus: String ('free' | 'pending' | 'paid'),
  ticketId: String (auto-generated unique),
  additionalInfo: {
    teamName: String,
    teammates: [String],
    dietaryPreference: String,
    tShirtSize: String,
    notes: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Routes

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login (returns JWT) |
| GET | `/api/auth/me` | ✅ | Current user profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### Events
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/events` | - | List events (search, filter, paginate) |
| GET | `/api/events/featured` | - | Featured events (home hero) |
| GET | `/api/events/:id` | - | Single event detail |
| POST | `/api/events` | 🔐 Admin | Create event |
| PUT | `/api/events/:id` | 🔐 Admin | Update event |
| DELETE | `/api/events/:id` | 🔐 Admin | Delete event |
| GET | `/api/events/:id/registrations` | 🔐 Admin | Event registrations |

### Registrations
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/registrations` | ✅ | Register for event |
| DELETE | `/api/registrations/:id` | ✅ | Cancel registration |
| GET | `/api/registrations/my` | ✅ | User's registrations |
| GET | `/api/registrations/check/:eventId` | ✅ | Check if registered |
| GET | `/api/registrations` | 🔐 Admin | All registrations |

**Auth Levels:**
- `-` Public
- `✅` Authenticated user
- `🔐` Admin only

---

## 🎨 Frontend Architecture

### State Management (Redux)

**Auth Slice** (`authSlice.js`)
- `state.user` — Current user object
- `state.token` — JWT token (persisted in localStorage)
- `state.loading` — API call status
- Actions: `login()`, `register()`, `logout()`, `fetchMe()`

**Events Slice** (`eventsSlice.js`)
- `state.items` — Array of events
- `state.current` — Single event being viewed
- `state.featured` — Featured events for homepage
- `state.page`, `state.pages` — Pagination
- Actions: `fetchEvents()`, `fetchEvent()`, `createEvent()`, `updateEvent()`, `deleteEvent()`

### Routing

```
/ — HomePage (hero, stats, featured)
/events — EventsPage (grid, search, filters)
/events/:id — EventDetailPage (detail, registration)
/login — LoginPage (auth form)
/register — RegisterPage (signup form)
/dashboard — DashboardPage (my registrations) [Protected]
/admin — AdminPage (CRUD events) [Admin only]
*/* — NotFoundPage
```

### Component Hierarchy

```
<App> (Router + Redux + Toaster)
├── <Navbar /> (responsive, auth aware)
├── <Routes /> (page transitions with AnimatePresence)
│   ├── <HomePage />
│   │   ├── Hero section
│   │   ├── Stats grid
│   │   ├── Featured events (EventCard x4)
│   │   ├── Categories
│   │   └── CTA banner
│   ├── <EventsPage />
│   │   ├── Search form
│   │   ├── Category filters
│   │   └── EventCard grid (with pagination)
│   ├── <EventDetailPage />
│   │   ├── Hero image
│   │   ├── Title + meta
│   │   ├── Description + highlights
│   │   └── Registration sidebar
│   ├── <LoginPage />
│   ├── <RegisterPage />
│   ├── <DashboardPage />
│   ├── <AdminPage />
│   └── <NotFoundPage />
└── <Footer />
```

---

## 🎬 Animation System

### Framer Motion Variants (`animations/variants.js`)

All animations are **reusable, declarative configs:**

```javascript
// Fade + slide up
fadeUp: { hidden: { opacity: 0, y: 30 }, visible: { ... } }

// Container for staggered children
staggerContainer: { visible: { transition: { staggerChildren: 0.1 } } }

// Card hover scale
cardHover: { rest: { scale: 1 }, hover: { scale: 1.02 } }

// Glow pulse (for featured badges)
glowPulse: { animate: { boxShadow: [...] } }

// Page transitions
pageTransition: { initial: {...}, animate: {...}, exit: {...} }
```

### Usage Examples

**Scroll-triggered fade-in:**
```jsx
<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-50px' }}
  custom={0.1}  // delay = 0.1s
>
  Content
</motion.div>
```

**Hover scale on card:**
```jsx
<motion.div whileHover={{ y: -4, scale: 1.02 }}>
  Card
</motion.div>
```

**Staggered list:**
```jsx
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={fadeUp} custom={i * 0.1}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### CSS Animations

- **Pulse**: Hero title pulsing effect
- **Float**: Subtle vertical float movement
- **Shimmer**: Skeleton loader effect

---

## 🌐 Deployment

### Option 1: Render (Backend) + Vercel (Frontend)

**Backend on Render:**
1. Push to GitHub
2. Connect repo at [render.com](https://render.com)
3. Environment variables: MONGO_URI, JWT_SECRET, etc.
4. Get production URL: `https://yourapp.onrender.com`

**Frontend on Vercel:**
1. Update `CLIENT_URL` in backend to Vercel URL
2. Push to GitHub
3. Connect repo at [vercel.com](https://vercel.com)
4. Set environment: `VITE_API_URL=https://yourapp.onrender.com`
5. Deploy automatically on push

**Update frontend API:**
```javascript
// utils/api.js
const baseURL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL });
```

### Option 2: Docker + Any Cloud

```dockerfile
# Dockerfile (root)
FROM node:18
WORKDIR /app
COPY . .
RUN npm run install:all
RUN cd frontend && npm run build
EXPOSE 5000
CMD ["npm", "run", "server"]
```

```bash
docker build -t college-events .
docker run -e MONGO_URI=... -p 5000:5000 college-events
```

---

## 💡 Feature Deep Dives

### Event Registration Flow

```
1. User clicks "Register Now" on event card
2. If not logged in → redirect to login
3. If logged in:
   - Check if already registered (prevent doubles)
   - Check if event has capacity
   - Create Registration doc
   - Auto-increment event.registeredCount
   - Add event to user.registeredEvents
   - Generate unique ticket ID
   - Show success toast
4. Registration appears in Dashboard
```

### Admin Event Creation

```
1. Admin navigates to /admin
2. Clicks "Create Event" button
3. Modal opens with form:
   - Title, description, category, date, venue, capacity
   - Price, image URL, tags, highlights
   - Featured toggle
4. Submit → POST /api/events
5. New event appears in table
6. Can edit or delete anytime
```

### Search & Filter

```
GET /api/events?search=hackathon&category=Technical&page=2

Filters:
- search: regex match on title
- category: exact match
- featured: true/false
- status: upcoming/ongoing/completed/cancelled
- page: pagination (default 12 items/page)
```

### Mobile Responsiveness

**Breakpoints:**
- **sm**: 640px — Tablet layout changes
- **lg**: 1024px — 3-col grid to full width
- **Mobile-first:** All styles mobile by default, expanded for larger screens

**Mobile-specific:**
- Hamburger menu on nav
- Larger touch targets (44x44px minimum)
- Single-column layouts
- Full-width modals

---

## 🎓 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- [AnimatePresence Tutorial](https://www.framer.com/motion/animate-presence/)

### Redux Toolkit
- [Getting Started](https://redux-toolkit.js.org/tutorials/quick-start)
- [Async Thunks](https://redux-toolkit.js.org/usage/usage-guide#async-requests-with-createasyncthunk)

### Tailwind CSS
- [Customization Docs](https://tailwindcss.com/docs/configuration)
- [Component Patterns](https://tailwindcss.com/docs/plugins)

### MongoDB Mongoose
- [Schema Documentation](https://mongoosejs.com/docs/guide.html)
- [Virtuals](https://mongoosejs.com/docs/api/schema.html#Schema.prototype.virtual())

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure IP whitelist includes your IP (MongoDB Atlas → Network Access)
- Check connection string in `.env`
- Verify database name in URI

### "JWT token invalid/expired"
- Clear localStorage and login again
- Token expires after 7 days (JWT_EXPIRES_IN)
- Check JWT_SECRET is same on backend

### "CORS errors"
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS origin in server.js

### "Styles not loading"
- Run `npm install` in frontend folder
- Restart Vite dev server
- Clear browser cache

### "Build fails"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Support & Contact

For issues or questions:
1. Check GitHub issues
2. Review API error messages in browser console
3. Check backend logs in terminal

---

## 📄 License

MIT — Feel free to use for your college!

---

## 🚀 Next Steps

### Suggested Enhancements

1. **Payment Integration**
   - Stripe/Razorpay for paid events
   - Payment status tracking

2. **Email Notifications**
   - Event reminders
   - Registration confirmation
   - Email receipts

3. **QR Code Tickets**
   - Generate QR per ticket
   - Scan at event entrance

4. **Analytics Dashboard**
   - Event attendance charts
   - Popular categories
   - Time-based trends

5. **Social Features**
   - User comments on events
   - Sharing to social media
   - Event team formation

6. **Calendar Integration**
   - Sync with Google Calendar
   - .ics file download

7. **Mobile App**
   - React Native version
   - Push notifications

---

**Built with ❤️ using MERN + Framer Motion. Ready to go live!**
