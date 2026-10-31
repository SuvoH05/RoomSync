from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Room
from app.schemas import RoomSearchRequest
from app.services.availability import check_room_availability
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Room
from app.schemas import RoomSearchRequest, RoomCreate
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

    results.sort(
        key=lambda room: abs(room.capacity - request.group_size)
)

    return results


@router.post("")
def create_room(request: RoomCreate, db: Session = Depends(get_db)):
    existing_room = db.query(Room).filter(
        Room.code == request.code
    ).first()

    if existing_room:
        raise HTTPException(
            status_code=409,
            detail="A room with this code already exists."
        )

    new_room = Room(
        name=request.name,
        code=request.code,
        building=request.building,
        capacity=request.capacity,
        type=request.type,
        floor=request.floor,
        facilities=request.facilities,
        allowed_purposes=request.allowed_purposes,
        image=request.image,
        available=True,
        score=0,
        schedule=[]
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room