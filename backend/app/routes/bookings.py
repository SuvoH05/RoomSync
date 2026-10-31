
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import BookingStatusUpdate
from app.database import get_db
from app.models import Booking, Room
from app.schemas import BookingCreate
from app.services.availability import check_room_availability

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


@router.get("")
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()


@router.post("")
def create_booking(
    request: BookingCreate,
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(
        Room.id == request.room_id
    ).first()

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    result = check_room_availability(
        room=room,
        db=db,
        requested_date=request.date,
        requested_start=request.start,
        requested_end=request.end,
        group_size=request.group_size,
        purpose=request.purpose,
        required_facilities=[]
    )

    if not result["available"]:
        raise HTTPException(
            status_code=409,
            detail=result["reasons"]
        )

    booking = Booking(
        id=f"RS-{uuid4().hex[:6].upper()}",
        room_id=room.id,
        room=room.name,
        code=room.code,
        date=request.date,
        start=request.start,
        end=request.end,
        purpose=request.purpose,
        group_size=request.group_size,
        status="Pending",
        student=request.student
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking created successfully",
        "booking": {
            "id": booking.id,
            "roomId": booking.room_id,
            "room": booking.room,
            "code": booking.code,
            "date": booking.date,
            "start": booking.start,
            "end": booking.end,
            "purpose": booking.purpose,
            "group": booking.group_size,
            "status": booking.status,
            "student": booking.student
        }
    }

@router.patch("/{booking_id}/status")
def update_booking_status(
    booking_id: str,
    request: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    if request.status not in ["Confirmed", "Cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid booking status."
        )

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).with_for_update().first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    if booking.status != "Pending":
        raise HTTPException(
            status_code=409,
            detail="Only pending bookings can be updated."
        )

    if request.status == "Confirmed":
        other_confirmed = db.query(Booking).filter(
            Booking.room_id == booking.room_id,
            Booking.date == booking.date,
            Booking.status == "Confirmed",
            Booking.id != booking.id
        ).all()

        for other in other_confirmed:
            if (
                booking.start < other.end
                and other.start < booking.end
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Cannot approve: another confirmed booking overlaps."
                )

    booking.status = request.status
    db.commit()
    db.refresh(booking)

    return {
        "message": f"Booking {request.status.lower()} successfully.",
        "booking": {
            "id": booking.id,
            "roomId": booking.room_id,
            "room": booking.room,
            "code": booking.code,
            "date": booking.date,
            "start": booking.start,
            "end": booking.end,
            "purpose": booking.purpose,
            "group": booking.group_size,
            "status": booking.status,
            "student": booking.student
        }
    }