import BookingTable from "../components/BookingTable.jsx";

export default function BookingsPage({ bookings, onStatusChange, role, user }) {
  return <div className="page-content"><div className="page-title-row"><div><span className="eyebrow">{role === "admin" ? "CAMPUS OPERATIONS" : "YOUR ACTIVITY"}</span><h1>{role === "admin" ? "Reservations" : "My bookings"}</h1><p>{role === "admin" ? "Review and manage room reservation requests." : "Keep track of your upcoming and previous room reservations."}</p></div></div><section className="panel bookings-panel full-bookings"><BookingTable bookings={role === "admin" ? bookings : bookings.filter(b => b.student === user?.name)} onStatusChange={role === "admin" ? onStatusChange : undefined}/></section></div>;
}