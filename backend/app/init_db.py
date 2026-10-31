
from app.database import Base, engine, SessionLocal
from app.models import Room, Booking
from app.models import Room as RoomModel

from datetime import date


def initialize_database():
    # Create all database tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Avoid inserting duplicate sample data
        if db.query(Room).first():
            print("Database already contains rooms. Skipping seed.")
            return

        rooms = [
            RoomModel(
                id=1,
                name="Innovation Studio",
                code="A-204",
                building="Academic Block A",
                capacity=24,
                type="Collaboration",
                floor="2nd Floor",
                facilities=["Projector", "Whiteboard", "AC"],
                allowed_purposes=[
                    "Project work", "Group study",
                    "Team meeting", "Presentation"
                ],
                image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
                available=True,
                score=98,
                schedule=[
                    {"date": "2026-10-31", "start": "10:00", "end": "12:00"}
                ]
            ),
            RoomModel(
                id=2,
                name="Seminar Room",
                code="B-108",
                building="Academic Block B",
                capacity=40,
                type="Seminar",
                floor="1st Floor",
                facilities=["Projector", "Audio", "AC"],
                allowed_purposes=[
                    "Presentation", "Team meeting", "Project work"
                ],
                image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=85",
                available=True,
                score=94,
                schedule=[]
            ),
            RoomModel(
                id=3,
                name="Focus Room",
                code="C-301",
                building="Library Wing",
                capacity=10,
                type="Study",
                floor="3rd Floor",
                facilities=["Whiteboard", "AC"],
                allowed_purposes=["Group study", "Project work"],
                image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85",
                available=True,
                score=91,
                schedule=[]
            ),
            RoomModel(
                id=4,
                name="Project Lab",
                code="A-110",
                building="Academic Block A",
                capacity=18,
                type="Lab",
                floor="1st Floor",
                facilities=["Projector", "Computers", "AC"],
                allowed_purposes=["Project work", "Presentation"],
                image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
                available=True,
                score=86,
                schedule=[
                    {"date": "2026-10-31", "start": "14:00", "end": "16:00"}
                ]
            )
        ]

        bookings = [
            Booking(
                id="RS-1042",
                room_id=1,
                room="Innovation Studio",
                code="A-204",
                date="2026-10-31",
                start="14:00",
                end="16:00",
                purpose="Project work",
                group_size=8,
                status="Confirmed",
                student="Aarav Sharma"
            ),
            Booking(
                id="RS-1041",
                room_id=2,
                room="Seminar Room",
                code="B-108",
                date="2026-10-31",
                start="10:00",
                end="11:30",
                purpose="Team meeting",
                group_size=12,
                status="Pending",
                student="Diya Patel"
            ),
            Booking(
                id="RS-1039",
                room_id=3,
                room="Focus Room",
                code="C-301",
                date="2026-11-01",
                start="12:00",
                end="13:00",
                purpose="Group study",
                group_size=5,
                status="Confirmed",
                student="Kabir Das"
            ),
            Booking(
                id="RS-1038",
                room_id=4,
                room="Project Lab",
                code="A-110",
                date="2026-10-30",
                start="15:00",
                end="17:00",
                purpose="Project work",
                group_size=10,
                status="Cancelled",
                student="Mira Sen"
            )
        ]

        db.add_all(rooms)
        db.add_all(bookings)
        db.commit()

        print("Database initialized successfully!")
        print(f"Inserted {len(rooms)} rooms and {len(bookings)} bookings.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    initialize_database()
