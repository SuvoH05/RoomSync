
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models import Booking, Feedback, Room
from app.schemas import FeedbackCreate

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


def format_feedback(feedback):
    return {
        "id": feedback.id,
        "booking_id": feedback.booking_id,
        "room_id": feedback.room_id,
        "room": feedback.room_name if hasattr(feedback, "room_name") else None,
        "student": feedback.student,
        "rating": feedback.rating,
        "comment": feedback.comment,
        "created_at": (
            feedback.created_at.isoformat()
            if feedback.created_at else None
        ),
    }


@router.post("")
def submit_feedback(
    request: FeedbackCreate,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == request.booking_id
    ).first()

    if not booking:
        raise HTTPException(404, "Booking not found.")

    if booking.student.strip().casefold() != request.student.strip().casefold():
        raise HTTPException(403, "You cannot review another student's booking.")

    if booking.status != "Confirmed":
        raise HTTPException(
            400,
            "Only confirmed bookings can be reviewed."
        )

    try:
        booking_end = datetime.strptime(
            f"{booking.date} {booking.end}",
            "%Y-%m-%d %H:%M"
        )
    except ValueError:
        raise HTTPException(400, "The booking has an invalid date or time.")

    if datetime.now() < booking_end:
        raise HTTPException(
            400,
            "You can submit feedback after your booking has ended."
        )

    existing = db.query(Feedback).filter(
        Feedback.booking_id == booking.id
    ).first()

    if existing:
        raise HTTPException(
            409,
            "Feedback has already been submitted for this booking."
        )

    feedback = Feedback(
        booking_id=booking.id,
        room_id=booking.room_id,
        student=booking.student,
        rating=request.rating,
        comment=request.comment.strip()
    )

    db.add(feedback)

    try:
        db.commit()
        db.refresh(feedback)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            409,
            "Feedback has already been submitted for this booking."
        )

    result = format_feedback(feedback)
    result["room"] = booking.room

    return {
        "message": "Feedback submitted successfully.",
        "feedback": result
    }


@router.get("")
def get_all_feedback(db: Session = Depends(get_db)):
    feedback_items = (
        db.query(Feedback)
        .order_by(Feedback.created_at.desc())
        .all()
    )

    results = []

    for item in feedback_items:
        result = format_feedback(item)
        room = db.query(Room).filter(Room.id == item.room_id).first()
        result["room"] = room.name if room else "Unknown room"
        results.append(result)

    return results


@router.get("/my")
def get_my_feedback(
    student: str,
    db: Session = Depends(get_db)
):
    feedback_items = (
        db.query(Feedback)
        .filter(Feedback.student == student)
        .order_by(Feedback.created_at.desc())
        .all()
    )

    results = []

    for item in feedback_items:
        result = format_feedback(item)
        room = db.query(Room).filter(Room.id == item.room_id).first()
        result["room"] = room.name if room else "Unknown room"
        results.append(result)

    return results


@router.get("/room/{room_id}")
def get_room_feedback(
    room_id: int,
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(404, "Room not found.")

    feedback_items = (
        db.query(Feedback)
        .filter(Feedback.room_id == room_id)
        .order_by(Feedback.created_at.desc())
        .all()
    )

    results = []

    for item in feedback_items:
        result = format_feedback(item)
        result["room"] = room.name
        results.append(result)

    average = (
        round(sum(item.rating for item in feedback_items) / len(feedback_items), 1)
        if feedback_items else 0
    )

    return {
        "room_id": room_id,
        "room": room.name,
        "average_rating": average,
        "total_reviews": len(feedback_items),
        "feedback": results
    }
