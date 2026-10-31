
from datetime import datetime


def is_time_overlap(start1, end1, start2, end2):
    """
    Returns True if two time intervals overlap.
    Adjacent bookings are allowed.
    """
    return start1 < end2 and start2 < end1


def check_room_availability(
    room,
    db,
    requested_date,
    requested_start,
    requested_end,
    group_size,
    purpose,
    required_facilities
):
    reasons = []

    # 1. Capacity check
    if room.capacity < group_size:
        reasons.append("Room capacity is insufficient.")

    # 2. Purpose check
    if purpose not in room.allowed_purposes:
        reasons.append("This room does not allow the requested purpose.")

    # 3. Facilities check
    missing_facilities = [
        facility for facility in required_facilities
        if facility not in room.facilities
    ]

    if missing_facilities:
        reasons.append(
            f"Missing facilities: {', '.join(missing_facilities)}"
        )

    # 4. Timetable conflict check
    for slot in room.schedule or []:
        if slot["date"] != requested_date:
            continue

        if is_time_overlap(
            requested_start,
            requested_end,
            slot["start"],
            slot["end"]
        ):
            reasons.append("Room is occupied in the timetable.")
            break

    # 5. Existing booking conflict check
    from app.models import Booking

    existing_bookings = db.query(Booking).filter(
        Booking.room_id == room.id,
        Booking.date == requested_date,
        Booking.status.in_(["Pending", "Confirmed"])
    ).all()

    for booking in existing_bookings:
        if is_time_overlap(
            requested_start,
            requested_end,
            booking.start,
            booking.end
        ):
            reasons.append("Room has an existing booking conflict.")
            break

    return {
        "available": len(reasons) == 0,
        "reasons": reasons
    }
