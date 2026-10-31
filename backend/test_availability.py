
from app.database import SessionLocal
from app.models import Room
from app.services.availability import check_room_availability


db = SessionLocal()

room = db.query(Room).filter(Room.id == 1).first()

result = check_room_availability(
    room=room,
    db=db,
    requested_date="2026-10-31",
    requested_start="12:00",
    requested_end="13:00",
    group_size=8,
    purpose="Project work",
    required_facilities=["Projector", "AC"]
)

print(result)

db.close()
