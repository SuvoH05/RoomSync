# RoomSync Frontend

Responsive React + Vite + JSX prototype for campus room discovery and booking.

## Requirements
- Node.js 18+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the Vite local URL (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Included functionality
- Login and registration screens with Student / Administrator role selection.
- Quick demo access for student and administrator.
- Student room search by date, start time, duration, group size, purpose and facilities.
- Search filters for capacity, allowed purpose, facilities, timetable blocks and existing bookings.
- Room recommendations sorted by capacity fit.
- Booking creation with a second availability/conflict check.
- My Bookings page.
- Admin overview, reservations, approve/reject actions, room directory and add-room form.
- Booking detail modal, settings page, notification feedback, responsive navigation.
- Browser localStorage persistence for demo accounts, rooms and bookings.

## Demo accounts
- Student: student@roomsync.demo / demo123
- Admin: admin@roomsync.demo / demo123

You can also register a new student or administrator account from the registration screen. This is a local hackathon prototype; role selection is for demonstration only and is not secure authorization.

## Important limitations
This version uses browser localStorage and sample campus data. It is not yet connected to FastAPI or PostgreSQL. For production, move authentication, authorization, availability checks and booking transactions to the backend. Never trust frontend checks as the final booking authority.
