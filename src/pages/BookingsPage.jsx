
import BookingTable from "../components/BookingTable.jsx";

export default function BookingsPage({
  bookings,
  onStatusChange,
  role,
  user,
  feedback = [],
  onSubmitFeedback,
}) {
  const visibleBookings =
    role === "admin"
      ? bookings
      : bookings.filter(
          (booking) => booking.student.trim() === user?.name?.trim()
        );

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">
            {role === "admin" ? "CAMPUS OPERATIONS" : "YOUR ACTIVITY"}
          </span>

          <h1>
            {role === "admin" ? "Reservations" : "My bookings"}
          </h1>

          <p>
            {role === "admin"
              ? "Review and manage room reservation requests."
              : "Keep track of your reservations and share your room experience."}
          </p>
        </div>
      </div>

      <section className="panel bookings-panel full-bookings">
        <BookingTable
          bookings={visibleBookings}
          onStatusChange={role === "admin" ? onStatusChange : undefined}
          feedback={feedback}
          onSubmitFeedback={role === "student" ? onSubmitFeedback : undefined}
        />
      </section>
    </div>
  );
}
