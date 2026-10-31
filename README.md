# RoomSync Frontend

A responsive React + Vite frontend prototype for the RoomSync campus room-discovery and booking platform.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Included screens
- Student: Discover rooms, search filters, recommendations, booking confirmation, My Bookings
- Admin: Overview, room management, reservations, utilization charts
- Responsive sidebar and mobile navigation
- Interactive sample-data booking flow and conflict check

## Important
This is a frontend prototype using local sample data. Booking changes are held in React state and reset on refresh. It is not yet connected to FastAPI or PostgreSQL. Replace the demo handlers in `src/App.jsx` with API calls when the backend is ready.

## Install note
The toast notifications use `sonner`. Install it with:
```bash
npm install sonner
```
