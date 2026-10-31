import { useMemo } from "react";
import { DoorOpen, CalendarCheck, Clock3, Activity, ArrowUpRight, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "../components/StatCard.jsx";
import BookingTable from "../components/BookingTable.jsx";
import { weeklyUsage, roomUsage } from "../data/mockData.jsx";

const pieData = [{ name: "Booked", value: 68 }, { name: "Available", value: 32 }];
const pieColors = ["#635BFF", "#E9EAF2"];

export default function AdminDashboard({ rooms, bookings, onStatusChange, setPage }) {
  const pending = bookings.filter(b => b.status === "Pending").length;
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const utilization = useMemo(() => Math.round((confirmed / Math.max(rooms.length * 2, 1)) * 100), [confirmed, rooms.length]);
  return (
    <div className="page-content admin-content">
      <div className="page-title-row"><div><span className="eyebrow">CAMPUS OPERATIONS</span><h1>Good morning, Admin <span className="wave">✦</span></h1><p>Here's what's happening across your campus spaces today.</p></div><button className="button button-secondary"><Download size={16}/> Export report</button></div>
      <div className="stats-grid">
        <StatCard label="Total spaces" value={rooms.length} change="+2 this month" note="Across campus" icon={DoorOpen} tone="purple"/>
        <StatCard label="Total bookings" value={bookings.length} change="+12.8%" note="vs. last month" icon={CalendarCheck} tone="blue"/>
        <StatCard label="Pending requests" value={pending} change="Needs attention" note="Awaiting review" icon={Clock3} tone="orange"/>
        <StatCard label="Room utilization" value={`${utilization}%`} change="+6.4%" note="vs. last month" icon={Activity} tone="green"/>
      </div>
      <div className="analytics-grid">
        <section className="panel chart-panel"><div className="panel-heading"><div><h2>Space utilization</h2><p>Weekly room occupancy across campus</p></div><select className="mini-select"><option>This week</option><option>Last week</option></select></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyUsage} barSize={25}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8A91A3", fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8A91A3", fontSize: 12 }} unit="%" domain={[0,100]}/><Tooltip cursor={{ fill: "#F5F4FF" }}/><Bar dataKey="usage" fill="#635BFF" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-dot purple-dot"/>Room occupancy</span><span className="legend-note">Updated just now</span></div></section>
        <section className="panel availability-panel"><div className="panel-heading"><div><h2>Campus availability</h2><p>Current space distribution</p></div><button className="icon-button"><ArrowUpRight size={17}/></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} innerRadius={66} outerRadius={88} paddingAngle={3} dataKey="value" stroke="none"><Cell fill={pieColors[0]}/><Cell fill={pieColors[1]}/></Pie></PieChart></ResponsiveContainer><div className="donut-center"><strong>68%</strong><span>Occupied</span></div></div><div className="donut-legend"><span><i className="legend-dot purple-dot"/>Booked <b>68%</b></span><span><i className="legend-dot grey-dot"/>Available <b>32%</b></span></div></section>
      </div>
      <section className="panel room-usage-panel"><div className="panel-heading"><div><h2>Top performing spaces</h2><p>Rooms with the highest utilization this week</p></div><button className="subtle-link" onClick={() => setPage("rooms")}>Manage rooms <ArrowUpRight size={15}/></button></div><div className="usage-list">{roomUsage.map((r,i)=><div className="usage-row" key={r.name}><span className="usage-rank">0{i+1}</span><strong>{r.name}</strong><div className="usage-track"><i style={{width:`${r.usage}%`}}/></div><b>{r.usage}%</b></div>)}</div></section>
      <section className="panel bookings-panel"><div className="panel-heading"><div><h2>Recent reservations</h2><p>Latest activity from students</p></div><button className="subtle-link" onClick={() => setPage("reservations")}>View all <ArrowUpRight size={15}/></button></div><BookingTable bookings={bookings} onStatusChange={onStatusChange} compact/></section>
    </div>
  );
}