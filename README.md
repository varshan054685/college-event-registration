# College Event Registration System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing college event registrations.

## Project Structure

```
college-event-registration/
├── backend/          # Node.js + Express + MongoDB backend
├── frontend/         # React frontend
└── README.md
```

## Features

- **3-Role System**: Admin, Staff, and Student with role-based access control
- **User Authentication**: JWT-based authentication with role-based registration
- **Student Profile**: Mandatory profile completion for students
- **Event Management**: Admin can create events with department/class restrictions
- **Event Registration**: Students can register for eligible events
- **Staff Dashboard**: Staff can view their class students' registrations
- **Admin Dashboard**: Admin can manage events, staff, and view statistics
- **SMS Notifications**: Staff receive SMS on event day with their class students list

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT, bcryptjs
- **SMS**: Twilio / Fast2SMS (optional)

## Role-Based System

This system implements three roles:

1. **Admin**: Create events, manage staff, view statistics
2. **Staff**: View events, see class registrations, receive SMS
3. **Student**: Complete profile, view events, register for events

For detailed documentation, see [ROLE_SYSTEM.md](./ROLE_SYSTEM.md)

