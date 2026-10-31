import { Users, MapPin, Snowflake, Presentation, Clipboard, ArrowUpRight, CheckCircle2 } from "lucide-react";

const iconFor = (name) => name.toLowerCase().includes("projector") ? Presentation : name.toLowerCase().includes("whiteboard") ? Clipboard : Snowflake;

export default function RoomCard({ room, onBook }) {
  return (
    <article className="room-card">
      <div className="room-image-wrap">
        <img src={room.image} alt={room.name}/>
        <span className={`availability-pill ${room.available ? "is-available" : "is-busy"}`}><i/>{room.available ? "Available" : "Currently booked"}</span>
        <button className="image-action" aria-label="View room"><ArrowUpRight size={17}/></button>
      </div>
      <div className="room-card-body">
        <div className="room-title-line"><div><span className="eyebrow">{room.type} SPACE · {room.code}</span><h3>{room.name}</h3></div><span className="match-score">{room.score}% <small>match</small></span></div>
        <div className="room-location"><MapPin size={14}/>{room.building} <span>·</span> {room.floor}</div>
        <div className="room-meta"><span><Users size={15}/>{room.capacity} seats</span>{room.facilities.slice(0, 2).map((f) => { const Icon = iconFor(f); return <span key={f}><Icon size={14}/>{f}</span>; })}</div>
        <div className="room-card-footer"><span className="room-fit"><CheckCircle2 size={15}/> Great fit for your group</span><button className="button button-primary button-small" disabled={!room.available} onClick={() => onBook(room)}>{room.available ? "Book room" : "Unavailable"}</button></div>
      </div>
    </article>
  );
}