
from sqlalchemy import Boolean, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import mapped_column

from .database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = mapped_column(Integer, primary_key=True, index=True)
    name = mapped_column(String(100), nullable=False)
    code = mapped_column(String(20), unique=True, nullable=False)
    building = mapped_column(String(100), nullable=False)
    capacity = mapped_column(Integer, nullable=False)
    type = mapped_column(String(50), nullable=False)
    floor = mapped_column(String(50), nullable=False)

    facilities = mapped_column(JSON, default=list)
    allowed_purposes = mapped_column(JSON, default=list)

    image = mapped_column(String(500), nullable=True)
    available = mapped_column(Boolean, default=True)
    score = mapped_column(Integer, default=0)

    # Existing timetable entries for this room
    schedule = mapped_column(JSON, default=list)


class Booking(Base):
    __tablename__ = "bookings"

    id = mapped_column(String(30), primary_key=True)

    room_id = mapped_column(
        Integer,
        ForeignKey("rooms.id"),
        nullable=False,
        index=True
    )

    # Snapshot fields used by the existing frontend
    room = mapped_column(String(100), nullable=False)
    code = mapped_column(String(20), nullable=False)

    date = mapped_column(String(10), nullable=False, index=True)
    start = mapped_column(String(5), nullable=False)
    end = mapped_column(String(5), nullable=False)

    purpose = mapped_column(String(100), nullable=False)

    # Database column is named "group" to match the frontend
    group_size = mapped_column("group", Integer, nullable=False)

    status = mapped_column(String(20), default="Pending")
    student = mapped_column(String(100), nullable=False)
