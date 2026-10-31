
import { useState } from "react";
import { MoreHorizontal, CalendarDays, X, Eye, Star, MessageSquare } from "lucide-react";

function Status({ status }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}

function isBookingCompleted(booking) {
  if (booking.status !== "Confirmed") return false;

  const endTime = new Date(`${booking.date}T${booking.end}:00`);

  return !Number.isNaN(endTime.getTime()) && endTime <= new Date();
}

export default function BookingTable({
  bookings,
  onStatusChange,
  compact = false,
  feedback = [],
  onSubmitFeedback,
}) {
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rows = compact ? bookings.slice(0, 4) : bookings;

  const reviewedBookingIds = new Set(
    feedback.map((item) => item.booking_id)
  );

  async function handleFeedbackSubmit(booking) {
    if (rating < 1 || rating > 5 || comment.trim().length < 5) {
      return;
    }

    setSubmitting(true);

    try {
      const success = await onSubmitFeedback(
        booking,
        rating,
        comment.trim()
      );

      if (success) {
        setSelected(null);
        setRating(5);
        setComment("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ROOM / BOOKING</th>
            <th>REQUESTED BY</th>
            <th>DATE & TIME</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((b) => {
            const reviewed = reviewedBookingIds.has(b.id);
            const completed = isBookingCompleted(b);

            return (
              <tr key={b.id}>
                <td>
                  <div className="table-room">
                    <div className="table-room-icon">
                      <CalendarDays size={16} />
                    </div>
                    <div>
                      <strong>{b.room}</strong>
                      <span>{b.id} · {b.code}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <strong className="table-person">{b.student}</strong>
                  <span className="table-sub">
                    {b.group} people · {b.purpose}
                  </span>
                </td>

                <td>
                  <strong>{b.date}</strong>
                  <span className="table-sub">
                    {b.start} – {b.end}
                  </span>
                </td>

                <td>
                  <Status status={b.status} />
                </td>

                <td>
                  <div className="table-actions">
                    {b.status === "Pending" && onStatusChange && (
                      <>
                        <button
                          className="text-action"
                          onClick={() => onStatusChange(b.id, "Confirmed")}
                        >
                          Approve
                        </button>

                        <button
                          className="text-action danger-text"
                          onClick={() => onStatusChange(b.id, "Cancelled")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {onSubmitFeedback && completed && (
                      reviewed ? (
                        <span className="text-action">
                          <Star size={13} /> Reviewed
                        </span>
                      ) : (
                        <button
                          className="text-action"
                          onClick={() => {
                            setSelected(b);
                            setRating(5);
                            setComment("");
                          }}
                        >
                          <MessageSquare size={13} />
                          Feedback
                        </button>
                      )
                    )}

                    <button
                      className="icon-button tiny"
                      title="View booking details"
                      onClick={() => setSelected(b)}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="empty-state">
          No bookings to display yet.
        </div>
      )}

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!submitting) setSelected(null);
          }}
        >
          <div
            className="modal-card detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">RESERVATION DETAILS</span>
                <h2>{selected.room}</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                disabled={submitting}
              >
                <X size={19} />
              </button>
            </div>

            <div className="detail-list">
              {[
                ["Booking ID", selected.id],
                ["Requested by", selected.student],
                ["Date", selected.date],
                ["Time", `${selected.start} – ${selected.end}`],
                ["Group size", `${selected.group} people`],
                ["Purpose", selected.purpose],
                ["Status", selected.status],
              ].map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            {onSubmitFeedback && isBookingCompleted(selected) && (
              <div className="feedback-form">
                <h3>
                  {reviewedBookingIds.has(selected.id)
                    ? "Feedback already submitted"
                    : "How was your experience?"}
                </h3>

                {reviewedBookingIds.has(selected.id) ? (
                  <p>Thank you for sharing your experience!</p>
                ) : (
                  <>
                    <div className="feedback-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          disabled={submitting}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={28}
                            fill={star <= rating ? "#E9A23B" : "none"}
                            color="#E9A23B"
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the room, facilities and your experience..."
                      rows={4}
                      maxLength={1000}
                      disabled={submitting}
                    />

                    <button
                      className="button button-primary modal-full"
                      disabled={submitting || comment.trim().length < 5}
                      onClick={() => handleFeedbackSubmit(selected)}
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              className="button button-secondary modal-full"
              onClick={() => setSelected(null)}
              disabled={submitting}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
