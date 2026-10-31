import { MoreHorizontal, CalendarDays } from "lucide-react";

function Status({ status }) {
  return <span className={`status status-${status.toLowerCase()}`}><i/>{status}</span>;
}
export default function BookingTable({ bookings, onStatusChange, compact = false }) {
  const rows = compact ? bookings.slice(0, 4) : bookings;
  return (
    <div className="table-wrap"><table className="data-table"><thead><tr><th>ROOM / BOOKING</th><th>REQUESTED BY</th><th>DATE & TIME</th><th>STATUS</th><th></th></tr></thead>
      <tbody>{rows.map((b) => <tr key={b.id}><td><div className="table-room"><div className="table-room-icon"><CalendarDays size={16}/></div><div><strong>{b.room}</strong><span>{b.id} · {b.code}</span></div></div></td><td><strong className="table-person">{b.student}</strong><span className="table-sub">{b.group} people · {b.purpose}</span></td><td><strong>{b.date}</strong><span className="table-sub">{b.start} – {b.end}</span></td><td><Status status={b.status}/></td><td><div className="table-actions">{b.status === "Pending" && onStatusChange ? <><button className="text-action" onClick={() => onStatusChange(b.id, "Confirmed")}>Approve</button><button className="text-action danger-text" onClick={() => onStatusChange(b.id, "Cancelled")}>Reject</button></> : <button className="icon-button tiny"><MoreHorizontal size={18}/></button>}</div></td></tr>)}</tbody>
    </table>{rows.length === 0 && <div className="empty-state">No bookings to display yet.</div>}</div>
  );
}