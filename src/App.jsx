
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { LogOut, ShieldCheck } from "lucide-react";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import AssistantWidget from "./components/AssistantWidget.jsx";
import { api } from "./services/api.js";

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  // State
  const [user, setUser] = useState(() =>
    readStore("roomsync_user", null)
  );

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [users, setUsers] = useState(() =>
    readStore("roomsync_users", [
      {
        name: "Aarav Sharma",
        email: "student@roomsync.demo",
        password: "demo123",
        role: "student",
      },
      {
        name: "Campus Admin",
        email: "admin@roomsync.demo",
        password: "demo123",
        role: "admin",
      },
    ])
  );

  const [page, setPage] = useState(
    user?.role === "admin" ? "overview" : "discover"
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Load rooms and bookings from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [roomData, bookingData] = await Promise.all([
          api.getRooms(),
          api.getBookings(),
        ]);

        setRooms(roomData);
        setBookings(bookingData);
      } catch (error) {
        toast.error("Could not load campus data", {
          description: error.message,
        });
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, []);

  // Load feedback belonging to the logged-in student
// Load feedback based on account role
useEffect(() => {
    if (!user) {
      setFeedback([]);
      return;
    }
  
    async function loadFeedback() {
      try {
        const data =
          user.role === "admin"
            ? await api.getAllFeedback()
            : await api.getMyFeedback(user.name);
  
        setFeedback(data);
      } catch (error) {
        toast.error("Could not load feedback", {
          description: error.message,
        });
      }
    }
  
    loadFeedback();
  }, [user]);
  // Save user data locally
  useEffect(() => {
    localStorage.setItem("roomsync_users", JSON.stringify(users));
  }, [users]);

  // Authentication
  const login = ({ email, password, role }) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!found) {
      return {
        error: "We couldn't find an account with those details and account type.",
      };
    }

    setUser({
      name: found.name,
      email: found.email,
      role: found.role,
    });

    setPage(found.role === "admin" ? "overview" : "discover");

    toast.success(`Welcome back, ${found.name.split(" ")[0]}!`);

    return {};
  };

  const register = ({ name, email, password, role }) => {
    if (
      users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return {
        error: "An account with this email already exists.",
      };
    }

    const next = { name, email, password, role };

    setUsers((old) => [...old, next]);
    setUser({ name, email, role });

    setPage(role === "admin" ? "overview" : "discover");

    toast.success("Your RoomSync account has been created.");

    return {};
  };

  const logout = () => {
    setUser(null);
    setFeedback([]);
    setPage("discover");
    toast("You have signed out.");
  };

  // Create a booking
  const createBooking = async (room, filters) => {
    if (!user) {
      toast.error("Please sign in to book a room.");
      return;
    }

    const { start, end, date } = filters;

    if (!date || !start || !end || start >= end) {
      toast.error("Please choose a valid date and time.");
      return;
    }

    try {
      const result = await api.createBooking({
        room_id: room.id,
        date,
        start,
        end,
        purpose: filters.purpose,
        group_size: Number(filters.group),
        student: user.name,
      });

      setBookings((old) => [result.booking, ...old]);

      toast.success("Booking request submitted!", {
        description: `${room.name} · ${date} · ${start}–${end}`,
      });
    } catch (error) {
      toast.error("Booking unsuccessful", {
        description: error.message,
      });
    }
  };

  // Submit room feedback
  const submitFeedback = async (booking, rating, comment) => {
    if (!user || user.role !== "student") {
      toast.error("Please sign in as a student to submit feedback.");
      return false;
    }

    try {
      const result = await api.submitFeedback({
        booking_id: booking.id,
        student: user.name,
        rating,
        comment,
      });

      setFeedback((old) => [...old, result.feedback]);

      toast.success("Feedback submitted successfully!", {
        description: `Thank you for reviewing ${booking.room}.`,
      });

      return true;
    } catch (error) {
      toast.error("Could not submit feedback", {
        description: error.message,
      });

      return false;
    }
  };

  // Approve or reject a booking
  const updateStatus = async (id, status) => {
    try {
      const result = await api.updateBookingStatus(id, status);

      setBookings((oldBookings) =>
        oldBookings.map((booking) =>
          booking.id === id ? result.booking : booking
        )
      );

      toast.success(`Reservation ${status.toLowerCase()}.`);
    } catch (error) {
      toast.error("Could not update reservation", {
        description: error.message,
      });
    }
  };

  // Add a room
  const addRoom = async (room) => {
    try {
      const newRoom = await api.addRoom(room);

      setRooms((old) => [...old, newRoom]);

      toast.success("Room added successfully!", {
        description: `${newRoom.name} · ${newRoom.code}`,
      });
    } catch (error) {
      toast.error("Could not add room", {
        description: error.message,
      });
    }
  };

  // Show authentication page
  if (!user) {
    return (
      <>
        <AuthPage onLogin={login} onRegister={register} />
        <Toaster position="top-right" richColors closeButton />
      </>
    );
  }

  // Show loading screen
  if (dataLoading) {
    return (
      <div className="page-content">
        <h2>Loading RoomSync...</h2>
        <p>Connecting to campus database.</p>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Page content
  let content;

  if (user.role === "student" && page === "discover") {
    content = (
      <StudentDashboard
        rooms={rooms}
        bookings={bookings}
        onBook={createBooking}
        user={user}
      />
    );
  } else if (
    user.role === "admin" &&
    (page === "overview" || page === "analytics")
  ) {
    content = (
        <AdminDashboard
        rooms={rooms}
        bookings={bookings}
        feedback={feedback}
        onStatusChange={updateStatus}
        setPage={setPage}
      />
    );
  } else if (page === "rooms") {
    content = (
      <RoomsPage
        rooms={rooms}
        onBook={(room) =>
          createBooking(room, {
            date: new Date().toISOString().slice(0, 10),
            start: "14:00",
            end: "16:00",
            group: "2",
            purpose: room.allowed_purposes[0],
            facilities: [],
          })
        }
        onAddRoom={addRoom}
      />
    );
  } else if (page === "settings") {
    content = (
      <div className="page-content">
        <div className="page-title-row">
          <div>
            <span className="eyebrow">PREFERENCES</span>
            <h1>Settings</h1>
            <p>Manage your local demo profile and workspace.</p>
          </div>
        </div>

        <section className="panel settings-panel">
          <div className="settings-profile">
            <div className="avatar">
              {user.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>Account type</span>
              <strong>
                {user.role === "admin" ? "Administrator" : "Student"}
              </strong>
            </div>

            <div>
              <span>Data storage</span>
              <strong>This browser (local demo)</strong>
            </div>

            <div>
              <span>Prototype version</span>
              <strong>RoomSync MVP</strong>
            </div>
          </div>

          <button className="button button-secondary" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </section>
      </div>
    );
  } else {
    content = (
      <BookingsPage
        bookings={bookings}
        onStatusChange={updateStatus}
        role={user.role}
        user={user}
        feedback={feedback}
        onSubmitFeedback={submitFeedback}
      />
    );
  }

  // Main application layout
  return (
    <div className="app-shell">
      <Sidebar
        role={user.role}
        user={user}
        onOpenAssistant={() => setAssistantOpen(true)}
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
      />

      <main className="main-area">
        <Topbar
          role={user.role}
          setMobileOpen={setMobileOpen}
          user={user}
          onLogout={logout}
        />

        <div className="demo-strip">
          <ShieldCheck size={14} />
          <span>Interactive prototype ·</span>
          <button
            onClick={() =>
              setPage(user.role === "admin" ? "overview" : "discover")
            }
          >
            Go to dashboard ↗
          </button>
        </div>

        {content}

        <footer className="app-footer">
          <span>© 2026 RoomSync. Built for better campus collaboration.</span>
          <span>
            <i /> Demo workspace active
          </span>
        </footer>
      </main>

      <AssistantWidget
        open={assistantOpen}
        setOpen={setAssistantOpen}
        role={user.role}
        rooms={rooms}
        bookings={bookings}
        user={user}
      />

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
