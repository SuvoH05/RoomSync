import { Bell, Menu, Search, ChevronDown } from "lucide-react";

export default function Topbar({ role, setMobileOpen }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={21}/></button>
      <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{role === "admin" ? "Administration" : "Student portal"}</strong></div>
      <div className="topbar-actions">
        <button className="top-search"><Search size={16}/><span>Quick search</span><kbd>⌘ K</kbd></button>
        <button className="icon-button notification-button"><Bell size={19}/><i/></button>
        <div className="top-user"><div className="avatar small-avatar">{role === "admin" ? "CA" : "AS"}</div><ChevronDown size={15}/></div>
      </div>
    </header>
  );
}