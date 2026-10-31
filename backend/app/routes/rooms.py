from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Room
from app.schemas import RoomSearchRequest
from app.services.availability import check_room_availability

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


@router.get("")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()


@router.post("/search")
def search_rooms(
    request: RoomSearchRequest,
    db: Session = Depends(get_db)
):
    rooms = db.query(Room).all()
    results = []

    for room in rooms:
        result = check_room_availability(
            room=room,
            db=db,
            requested_date=request.date,
            requested_start=request.start,
            requested_end=request.end,
            group_size=request.group_size,
            purpose=request.purpose,
            required_facilities=request.required_facilities
        )

        if result["available"]:
            results.append(room)

    return results