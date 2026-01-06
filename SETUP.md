# Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-events
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-events
   ```

4. Run the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the frontend folder if you want to change the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Collections

The application will automatically create these MongoDB collections:
- `users` - User accounts
- `events` - Event information
- `registrations` - Event registrations

## Testing the Application

1. Start MongoDB (if using local MongoDB)
2. Start the backend server (`npm run dev` in backend folder)
3. Start the frontend server (`npm start` in frontend folder)
4. Open `http://localhost:3000` in your browser
5. Register a new account
6. Browse and register for events





