import { LayoutDashboard, Search, CalendarDays, DoorOpen, ChartNoAxesCombined, Settings, LogOut, X, Bot, MessageCircle } from "lucide-react";
const studentLinks = [{ id: "discover", label: "Discover rooms", icon: Search }, { id: "my-bookings", label: "My bookings", icon: CalendarDays }];
const adminLinks = [{ id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "rooms", label: "Room management", icon: DoorOpen }, { id: "reservations", label: "Reservations", icon: CalendarDays }, { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined }];
export default function Sidebar({ role, page, setPage, mobileOpen, setMobileOpen, onLogout, user, onOpenAssistant }) {
    const links = role === "admin" ? adminLinks : studentLinks;
    return <>{mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}<aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}><div className="brand"><div className="brand-mark"><DoorOpen size={21} /></div><div><strong>RoomSync</strong><span>SPACE, SIMPLIFIED</span></div><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div><div className="workspace-label">WORKSPACE</div><div className="nav-list">{links.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setMobileOpen(false); }}><Icon size={18} /><span>{label}</span></button>)}</div><div className="sidebar-bottom"><div className="help-card assistant-promo"><div className="assistant-promo-top"><div className="help-icon"><Bot size={20} /></div><span className="assistant-live"><i /> ONLINE</span></div><strong>Meet your RoomSync AI</strong><p>Need a room, booking help or campus info? Ask your assistant.</p><button onClick={onOpenAssistant}>Chat with AI <MessageCircle size={13} /></button></div><button className={`nav-item muted-nav ${page === "settings" ? "active" : ""}`} onClick={() => setPage("settings")}><Settings size={18} /><span>Settings</span></button><button className="nav-item muted-nav" onClick={onLogout}><LogOut size={18} /><span>Sign out</span></button><div className="profile-row">
    <div className="avatar">
      {(user?.name || "User")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join("")}
    </div>
  
    <div className="profile-copy">
      <strong>{user?.name || "User"}</strong>
      <span>{role === "admin" ? "Administrator" : "Student account"}</span>
    </div>
  </div></div></aside></>;
}   