import { LayoutDashboard, Search, CalendarDays, DoorOpen, ChartNoAxesCombined, Settings, LogOut, X } from "lucide-react";

const studentLinks = [
  { id: "discover", label: "Discover rooms", icon: Search },
  { id: "my-bookings", label: "My bookings", icon: CalendarDays }
];
const adminLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "rooms", label: "Room management", icon: DoorOpen },
  { id: "reservations", label: "Reservations", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined }
];

export default function Sidebar({ role, page, setPage, mobileOpen, setMobileOpen, setRole }) {
  const links = role === "admin" ? adminLinks : studentLinks;
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><DoorOpen size={21} /></div>
          <div><strong>RoomSync</strong><span>SPACE, SIMPLIFIED</span></div>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)}><X size={18}/></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="nav-list">
          {links.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setMobileOpen(false); }}>
              <Icon size={18} strokeWidth={1.9}/><span>{label}</span>
              {id === "reservations" && <i className="nav-count">4</i>}
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon">✦</div><strong>Need a hand?</strong><p>Find the right space for your next big idea.</p><button onClick={() => setPage("discover")}>Explore rooms <span>↗</span></button></div>
          <button className="nav-item muted-nav"><Settings size={18}/><span>Settings</span></button>
          <button className="nav-item muted-nav" onClick={() => setRole(role === "admin" ? "student" : "admin")}><LogOut size={18}/><span>Switch to {role === "admin" ? "student" : "admin"}</span></button>
          <div className="profile-row"><div className="avatar">AS</div><div className="profile-copy"><strong>{role === "admin" ? "Campus Admin" : "Aarav Sharma"}</strong><span>{role === "admin" ? "Administrator" : "Student account"}</span></div><span className="more-dots">···</span></div>
        </div>
      </aside>
    </>
  );
}