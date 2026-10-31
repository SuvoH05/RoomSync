import { useMemo, useState } from "react";
import { Sparkles, ArrowRight, CalendarCheck, Clock3, Users, MapPin } from "lucide-react";
import SearchPanel from "../components/SearchPanel.jsx";
import RoomCard from "../components/RoomCard.jsx";

export default function StudentDashboard({ rooms, bookings, onBook }) {
  const [filters, setFilters] = useState({ date: "2026-10-31", start: "14:00", duration: "2", group: "8", purpose: "Project work", facilities: ["Projector", "Whiteboard"] });
  const [searched, setSearched] = useState(false);
  const endHour = Number(filters.start.slice(0, 2)) + Number(filters.duration);
  const endTime = `${String(endHour).padStart(2, "0")}:${filters.start.slice(3)}`;
  const results = useMemo(() => rooms.filter(r => r.capacity >= Number(filters.group || 1) && filters.facilities.every(f => r.facilities.includes(f))), [rooms, filters]);
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  return (
    <div className="page-content">
      <section className="welcome-row"><div><div className="welcome-kicker"><Sparkles size={14}/> YOUR CAMPUS, CONNECTED</div><h1>Find your space.<br/><span>Make it happen.</span></h1><p>Great ideas need the right space. Discover and book rooms across your campus.</p></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-building"><div/><div/><div/><div/><div/><div/></div><span className="art-spark spark-a">✦</span><span className="art-spark spark-b">✧</span></div></section>
      <div className="quick-stats"><div><span className="quick-icon purple-bg"><CalendarCheck size={18}/></span><div><strong>{confirmed}</strong><small>Active bookings</small></div></div><div><span className="quick-icon blue-bg"><Clock3 size={18}/></span><div><strong>12</strong><small>Rooms available now</small></div></div><div><span className="quick-icon green-bg"><Users size={18}/></span><div><strong>4.8/5</strong><small>Average room rating</small></div></div></div>
      <SearchPanel filters={filters} setFilters={setFilters} onSearch={() => setSearched(true)}/>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">{searched ? "MATCHES YOUR SEARCH" : "CURATED FOR YOU"}</span><h2>{searched ? `${results.length} spaces found` : "Recommended spaces"}</h2><p>{searched ? `For ${filters.group} people · ${filters.purpose} · ${filters.start}–${endTime}` : "Spaces picked to help your team do its best work."}</p></div><button className="subtle-link" onClick={() => setSearched(true)}>View all rooms <ArrowRight size={16}/></button></div>
        <div className="room-grid">{results.map(room => <RoomCard key={room.id} room={room} onBook={() => onBook(room, { ...filters, end: endTime })}/>)}</div>
      </section>
      <section className="tip-banner"><div className="tip-icon"><Sparkles size={20}/></div><div><strong>A little planning goes a long way.</strong><p>Book ahead to get your preferred space and time slot for team sessions.</p></div><span className="tip-decoration">✳</span></section>
    </div>
  );
}