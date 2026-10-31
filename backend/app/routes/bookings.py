
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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
