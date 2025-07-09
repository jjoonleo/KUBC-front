# KUBC Event Management System

Korea University Badminton Club Event Management System built with React, Redux, React Router, and react-hook-form.

## Features

### 🔐 Authentication

- Naver Login integration (simulated)
- Protected routes - redirects unauthenticated users to login
- Auto-redirect after successful login

### 📅 Event Management

- **Multi-step Event Creation Form**

  - Page 1: Basic information (dateTime, menuId, place, maxParticipants)
  - Page 2: Content creation (subject, content)
  - Form validation with react-hook-form
  - Responsive design with module CSS

- **Event List View**

  - Grid layout showing all events
  - Event cards with preview information
  - Empty state with call-to-action
  - Responsive design for mobile

- **Event Detail View**
  - Full event information display
  - Beautifully formatted date/time
  - Placeholder edit/delete functionality
  - Back navigation to list

## Tech Stack

- **Framework**: React 19.1.0 with TypeScript
- **State Management**: Redux Toolkit with React-Redux
- **Routing**: React Router v7.6.3
- **Forms**: react-hook-form
- **Styling**: CSS Modules
- **Development**: Create React App

## Project Structure

```
src/
├── components/
│   ├── EventCreation/
│   │   ├── EventCreationForm.tsx
│   │   └── EventCreationForm.module.css
│   ├── EventDetail/
│   │   ├── EventDetail.tsx
│   │   └── EventDetail.module.css
│   ├── EventList/
│   │   ├── EventList.tsx
│   │   └── EventList.module.css
│   ├── Login/
│   │   ├── Login.tsx
│   │   └── Login.module.css
│   └── PrivateRoute/
│       └── PrivateRoute.tsx
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       └── eventsSlice.ts
├── App.tsx
└── index.tsx
```

## Event Data Structure

```typescript
interface Event {
  id: string;
  dateTime: string; // ISO format: "2025-07-15T14:30:00"
  menuId: number; // Menu identifier
  place: string; // e.g., "KUBC Meeting Room A"
  maxParticipants: number; // Maximum number of participants
  content: string; // Detailed event description
  subject: string; // Event title
  uploadAt: string; // Creation timestamp
  createdBy?: string; // Optional: creator identifier
}
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Usage

1. **Login**: Click "네이버로 로그인" on the login page (simulated login)
2. **Create Event**: Click "새 이벤트 만들기" → Fill form → Submit
3. **View Events**: Browse events in the main list
4. **Event Details**: Click any event card to view full details

## Authentication Flow

- All routes except `/login` are protected
- Unauthenticated users are redirected to login
- Login simulation creates a mock user session
- Redux manages authentication state

## Form Validation

- All fields are required with appropriate validation
- Date/time input ensures future events
- Numeric fields have minimum value constraints
- Multi-step form preserves data between steps

## Responsive Design

- Mobile-first approach with CSS modules
- Responsive grid layouts
- Touch-friendly button sizes
- Optimized for tablets and mobile devices

## Future Enhancements

- Real Naver Login API integration
- Event edit/delete functionality
- User management and roles
- Event participant management
- Image upload for events
- Calendar view integration
