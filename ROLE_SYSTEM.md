# Role-Based System Documentation

## Overview
This system implements a 3-role access control system: **Admin**, **Staff**, and **Student**.

## User Roles & Responsibilities

### 🔴 ADMIN
**Capabilities:**
- Login
- Create events
- Select eligible departments for events
- Select eligible classes/years for events
- View total registrations (count only)
- Manage staff accounts (create staff)
- Trigger SMS notifications for event day

**Restrictions:**
- Cannot register students
- Cannot receive SMS

### 🔵 STAFF (Class Teacher / Faculty)
**Mapping:**
- Each staff is mapped to:
  - Department (e.g., CSE, ECE)
  - Class/Year/Section (e.g., CSE-2A)

**Capabilities:**
- Login
- View events allowed for their department
- See registrations for their class only:
  - Number of students registered
  - Names & roll numbers
- Register themselves for events
- Register their students (if needed)
- Receive SMS on event day (shows only their class students)

**Restrictions:**
- Cannot see other classes' students
- Cannot create events

### 🟢 STUDENT
**Mandatory Profile Completion:**
After first login, student must complete profile with:
- Name
- Roll Number
- Registration Number
- Contact Number
- Department
- Class Teacher (Staff ID)

**Capabilities (after profile completion):**
- View events available for their department/class
- Register for events
- View their registrations

**Restrictions:**
- Cannot see events until profile is complete
- Cannot register until profile is complete

## User Flow

### Student Flow
```
Login → Profile Mandatory → View Events → Register
```

### Staff Flow
```
Login → View Events → View Registrations → Register Students → Receive SMS
```

### Admin Flow
```
Login → Create Event → Select Departments → Monitor → Trigger SMS
```

## Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  role: "admin" | "staff" | "student",
  name: String,
  email: String,
  password: String (hashed),
  
  // Student specific
  rollNumber: String,
  registrationNumber: String,
  contactNumber: String,
  department: String,
  classTeacherId: ObjectId (ref: User),
  profileCompleted: Boolean,
  
  // Staff specific
  staffId: String (unique),
  staffDepartment: String,
  className: String, // e.g. "CSE-2A"
  phone: String
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  maxParticipants: Number,
  currentParticipants: Number,
  category: String,
  status: "upcoming" | "ongoing" | "completed" | "cancelled",
  allowedDepartments: [String], // e.g. ["CSE", "ECE"]
  allowedClasses: [String], // e.g. ["CSE-2A", "CSE-2B"]
  createdBy: ObjectId (ref: User)
}
```

### Registrations Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  staffId: ObjectId (ref: User), // Optional: if staff registered student
  registeredAt: Date,
  status: "registered" | "cancelled"
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register (student/staff)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Student Routes
- `PUT /api/student/profile` - Complete profile
- `GET /api/student/events` - Get available events
- `POST /api/student/register-event/:eventId` - Register for event
- `GET /api/student/my-registrations` - Get my registrations

### Staff Routes
- `GET /api/staff/events` - Get events for staff's department
- `GET /api/staff/event/:eventId/registrations` - Get registrations (class students only)
- `POST /api/staff/register-student` - Register a student
- `GET /api/staff/my-students` - Get all students in staff's class

### Admin Routes
- `POST /api/admin/create-event` - Create event
- `GET /api/admin/event-stats/:eventId` - Get event statistics
- `GET /api/admin/events` - Get all events
- `POST /api/admin/create-staff` - Create staff account
- `GET /api/admin/staff` - Get all staff

### SMS Routes
- `POST /api/sms/send-event-sms/:eventId` - Trigger SMS for event day (Admin only)

## SMS Feature

### Setup
1. **Twilio** (International):
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_phone_number
   ```

2. **Fast2SMS** (India):
   ```env
   SMS_PROVIDER=fast2sms
   FAST2SMS_API_KEY=your_api_key
   ```

### SMS Content
On event day, staff receive SMS with:
```
Event: Tech Symposium
Date: 2024-01-15
Venue: Main Auditorium

Students attending:
1. Ravi (CSE201)
2. Anjali (CSE205)
```

## Frontend Pages

- `/login` - Login page
- `/register` - Registration page
- `/complete-profile` - Student profile completion (mandatory)
- `/student/events` - Student events view
- `/student/events/:eventId/register` - Event registration
- `/staff/dashboard` - Staff dashboard
- `/admin/dashboard` - Admin dashboard

## Middleware

### Authentication Middleware
- `authMiddleware` - Verifies JWT token

### Role Middleware
- `checkRole("admin")` - Admin only
- `checkRole("staff")` - Staff only
- `checkRole("student")` - Student only
- `checkRole("admin", "staff")` - Multiple roles

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-events
JWT_SECRET=your_secret_key

# SMS Configuration (Optional)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```

## Testing the System

1. **Create Admin** (manually in database or via script)
2. **Admin creates Staff** accounts
3. **Students register** and complete profile
4. **Admin creates Events** with department/class restrictions
5. **Students register** for events
6. **Staff views** their class registrations
7. **Admin triggers SMS** on event day





