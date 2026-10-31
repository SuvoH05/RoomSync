import { useState } from "react";
import { toast, Toaster } from "sonner";
import { CalendarDays, Sparkles } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import { initialRooms, initialBookings } from "./data/mockData.jsx";

export default function App() {
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("discover");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);

  const switchRole = (next) => { setRole(next); setPage(next === "admin" ? "overview" : "discover"); };
  const createBooking = (room, filters) => {
    const start = filters.start;
    const end = filters.end;
    const conflict = bookings.some(b => b.roomId === room.id && b.date === filters.date && b.status === "Confirmed" && start < b.end && end > b.start);
    if (conflict) { toast.error("This room has just been booked for that time."); return; }
    const booking = {
      id: `RS-${1050 + bookings.length}`, roomId: room.id, room: room.name, code: room.code,
      date: filters.date, start, end, purpose: filters.purpose, group: Number(filters.group),
      status: "Confirmed", student: "Aarav Sharma"
    };
    setBookings(old => [booking, ...old]);
    toast.success("Room booked successfully!", { description: `${room.name} · ${start}–${end}` });
  };
  const updateStatus = (id, status) => {
    setBookings(old => old.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Reservation ${status.toLowerCase()}.`);
  };
  const bookFromRooms = (room) => {
    if (!room.available) { toast.error("This room is currently unavailable."); return; }
    createBooking(room, { date: "2026-10-31", start: "14:00", end: "16:00", group: "8", purpose: "Project work" });
  };

  let content;
  if (role === "student" && page === "discover") content = <StudentDashboard rooms={rooms} bookings={bookings} onBook={createBooking}/>;
  else if (role === "admin" && page === "overview") content = <AdminDashboard rooms={rooms} bookings={bookings} onStatusChange={updateStatus} setPage={setPage}/>;
  else if (page === "rooms") content = <RoomsPage rooms={rooms} onBook={bookFromRooms}/>;
  else content = <BookingsPage bookings={bookings} onStatusChange={updateStatus} role={role}/>;

  return (
    <div className="app-shell">
      <Sidebar role={role} page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setRole={switchRole}/>
      <main className="main-area">
        <Topbar role={role} setMobileOpen={setMobileOpen}/>
        <div className="demo-strip"><Sparkles size={14}/><span>You're viewing a live interactive demo with sample campus data.</span><button onClick={() => switchRole(role === "admin" ? "student" : "admin")}>Switch to {role === "admin" ? "student" : "admin"} view ↗</button></div>
        {content}
        <footer className="app-footer"><span>© 2026 RoomSync. Built for better campus collaboration.</span><span><i/> All systems operational</span></footer>
      </main>
      <Toaster position="top-right" richColors closeButton/>
    </div>
  );
}