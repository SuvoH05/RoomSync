import { useMemo, useState } from "react";
import { Sparkles, ArrowRight, CalendarCheck, Clock3, Users } from "lucide-react";
import SearchPanel, { defaultFilters } from "../components/SearchPanel.jsx";
import RoomCard from "../components/RoomCard.jsx";

const overlaps = (start,end,bStart,bEnd) => start < bEnd && end > bStart;
export default function StudentDashboard({ rooms, bookings, onBook, user }) {
  const [filters,setFilters]=useState(defaultFilters());
  const [searched,setSearched]=useState(false);
  const [error,setError]=useState("");
  const endHour=Number(filters.start.slice(0,2))+Number(filters.duration);
  const endTime=`${String(endHour).padStart(2,"0")}:${filters.start.slice(3)}`;
  const results=useMemo(()=>{
    if(!searched)return rooms;
    return rooms.filter(room=>{
      if(room.capacity<Number(filters.group||1))return false;
      if(!room.allowed_purposes.includes(filters.purpose))return false;
      if(!filters.facilities.every(f=>room.facilities.includes(f)))return false;
      if(bookings.some(b=>b.roomId===room.id&&b.date===filters.date&&["Confirmed","Pending"].includes(b.status)&&overlaps(filters.start,endTime,b.start,b.end)))return false;
      if(room.schedule?.some(s=>s.date===filters.date&&overlaps(filters.start,endTime,s.start,s.end)))return false;
      return room.available;
    }).sort((a,b)=>Math.abs(a.capacity-Number(filters.group))-Math.abs(b.capacity-Number(filters.group)));
  },[rooms,bookings,filters,searched,endTime]);
  const confirmed=bookings.filter(b=>b.status==="Confirmed"&&b.student===user?.name).length;
  const runSearch=()=>{
    if(!filters.date||!filters.group||Number(filters.group)<1){setError("Choose a date and enter a valid group size.");return;}
    if(endHour>20||endHour<=Number(filters.start.slice(0,2))){setError("Choose a time and duration within campus operating hours (8 AM–8 PM).");return;}
    setError("");setSearched(true);
  };
  const reset=()=>{setFilters(defaultFilters());setSearched(false);setError("");};
  return <div className="page-content">
    <section className="welcome-row"><div><div className="welcome-kicker"><Sparkles size={14}/> YOUR CAMPUS, CONNECTED</div><h1>Find your space.<br/><span>Make it happen.</span></h1><p>Great ideas need the right space. Discover and book rooms across your campus.</p></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-building"><div/><div/><div/><div/><div/><div/></div><span className="art-spark spark-a">✦</span><span className="art-spark spark-b">✧</span></div></section>
    <div className="quick-stats"><div><span className="quick-icon purple-bg"><CalendarCheck size={18}/></span><div><strong>{confirmed}</strong><small>My active bookings</small></div></div><div><span className="quick-icon blue-bg"><Clock3 size={18}/></span><div><strong>{rooms.filter(r=>r.available).length}</strong><small>Spaces in directory</small></div></div><div><span className="quick-icon green-bg"><Users size={18}/></span><div><strong>{rooms.reduce((n,r)=>n+r.capacity,0)}</strong><small>Total room seats</small></div></div></div>
    <SearchPanel filters={filters} setFilters={setFilters} onSearch={runSearch} onReset={reset}/>
    {error&&<div className="inline-error">{error}</div>}
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">{searched?"MATCHES YOUR SEARCH":"CAMPUS DIRECTORY"}</span><h2>{searched?`${results.length} suitable spaces found`:"Explore available spaces"}</h2><p>{searched?`For ${filters.group} people · ${filters.purpose} · ${filters.start}–${endTime}`:"Explore spaces and find the right setting for your next session."}</p></div><button className="subtle-link" onClick={reset}>Clear search <ArrowRight size={16}/></button></div>
      {results.length?<div className="room-grid">{results.map(room=><RoomCard key={room.id} room={room} onBook={()=>onBook(room,{...filters,end:endTime})}/>)}</div>:<div className="empty-results"><div className="empty-results-icon"><Search size={22}/></div><h3>No matching rooms found</h3><p>Try another time, reduce your group size or remove a facility filter.</p><button className="button button-secondary" onClick={reset}>Reset filters</button></div>}
    </section>
    <section className="tip-banner"><div className="tip-icon"><Sparkles size={20}/></div><div><strong>A little planning goes a long way.</strong><p>Book ahead to get your preferred space and time slot for team sessions.</p></div><span className="tip-decoration">✳</span></section>
  </div>;
}