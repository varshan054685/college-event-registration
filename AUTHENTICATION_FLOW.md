# Authentication Flow Documentation

## Overview
The application implements a secure authentication flow where:
- **Only the Login page is accessible** without authentication
- All other pages require login
- Students must complete their profile before accessing events
- Users are redirected based on their role and profile status

## Flow Diagram

```
App Start
    ↓
Login Page (ONLY accessible page)
    ↓
User Logs In
    ↓
    ├─→ Admin → /admin/dashboard
    ├─→ Staff → /staff/dashboard
    └─→ Student
            ├─→ Profile NOT completed → /complete-profile
            └─→ Profile completed → /student/events
```

## Route Protection

### 1. ProtectedRoute Component
- **Location**: `frontend/src/components/ProtectedRoute.jsx`
- **Purpose**: Checks if user has a valid token
- **Behavior**: 
  - If no token → Redirects to `/login`
  - If token exists → Allows access to protected route

### 2. ProfileRoute Component
- **Location**: `frontend/src/components/ProfileRoute.jsx`
- **Purpose**: Ensures students complete profile before accessing events
- **Behavior**:
  - Only checks students (admin/staff bypass)
  - If student profile not completed → Redirects to `/complete-profile`
  - If profile completed → Allows access

## Pages & Access

### Public Pages (No Auth Required)
- `/login` - Login page
- `/register` - Registration page
- `/` - Redirects to `/login`

### Protected Pages (Auth Required)

#### Student Routes
- `/complete-profile` - Profile completion (mandatory for students)
- `/student/events` - View available events (requires profile completion)
- `/student/events/:eventId/register` - Register for event (requires profile completion)

#### Staff Routes
- `/staff/dashboard` - Staff dashboard

#### Admin Routes
- `/admin/dashboard` - Admin dashboard

#### General Routes (Backward Compatibility)
- `/events` - General events page
- `/events/:id/register` - Event registration

## Login Page Features

### Design
- Beautiful, modern UI matching the provided design
- Centered card layout with rounded corners
- Clean input fields with proper styling
- Error message display
- Loading state during authentication

### Functionality
- Email and password validation
- Automatic redirect if already logged in
- Role-based redirection after login
- Profile completion check for students

## Profile Completion Flow

### For Students
1. After registration/login, if `profileCompleted = false`:
   - User is redirected to `/complete-profile`
   - Cannot access any event pages
   - Must fill:
     - Roll Number
     - Registration Number
     - Contact Number
     - Department
     - Class Teacher ID

2. After profile completion:
   - `profileCompleted` is set to `true` in localStorage
   - User is redirected to `/student/events`
   - Can now view and register for events

## Security Features

1. **Token-based Authentication**
   - JWT token stored in localStorage
   - Token sent with every API request
   - Token validated on backend

2. **Route Protection**
   - All routes except login/register are protected
   - Direct URL access blocked without token
   - Automatic redirect to login if token missing

3. **Role-based Access**
   - Different dashboards for different roles
   - Students have additional profile requirement
   - Admin/Staff bypass profile check

4. **Profile Completion Enforcement**
   - Students cannot access events without profile
   - ProfileRoute middleware enforces this
   - Automatic redirect to profile page

## Implementation Details

### Login Component
```javascript
// Checks if already logged in on mount
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    redirectUser(user);
  }
}, []);

// Redirects based on role and profile status
const redirectUser = (user) => {
  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } else if (user.role === "staff") {
    navigate("/staff/dashboard");
  } else if (user.role === "student") {
    if (!user.profileCompleted) {
      navigate("/complete-profile");
    } else {
      navigate("/student/events");
    }
  }
};
```

### ProtectedRoute Component
```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

### ProfileRoute Component
```javascript
const ProfileRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Only check profile for students
  if (user && user.role === "student" && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }
  
  return children;
};
```

## Testing the Flow

1. **First Time User (Student)**
   ```
   Open app → Login page
   Register → Redirected to /complete-profile
   Fill profile → Redirected to /student/events
   ```

2. **Returning Student (Profile Complete)**
   ```
   Open app → Login page
   Login → Redirected to /student/events
   ```

3. **Staff User**
   ```
   Open app → Login page
   Login → Redirected to /staff/dashboard
   ```

4. **Admin User**
   ```
   Open app → Login page
   Login → Redirected to /admin/dashboard
   ```

5. **Unauthorized Access**
   ```
   Try to access /student/events without login
   → Automatically redirected to /login
   ```

## Notes

- All routes are protected except `/login` and `/register`
- Root path (`/`) redirects to `/login`
- Any unknown route (`*`) redirects to `/login`
- Profile completion is mandatory only for students
- Admin and Staff can access their dashboards immediately after login





