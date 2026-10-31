import { useState } from "react";
import { Plus, Search } from "lucide-react";
import RoomCard from "../components/RoomCard.jsx";

export default function RoomsPage({ rooms, onBook }) {
  const [query, setQuery] = useState("");
  const filtered = rooms.filter(r => `${r.name} ${r.code} ${r.building}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-content"><div className="page-title-row"><div><span className="eyebrow">CAMPUS DIRECTORY</span><h1>Room management</h1><p>Explore and manage the spaces available across your campus.</p></div><button className="button button-primary"><Plus size={17}/> Add a room</button></div><div className="toolbar-search"><Search size={17}/><input placeholder="Search rooms, buildings or room codes..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="room-grid">{filtered.map(room=><RoomCard key={room.id} room={room} onBook={onBook}/>)}</div></div>;
}