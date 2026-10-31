
from pydantic import BaseModel, Field
from typing import Optional


class RoomSearchRequest(BaseModel):
    date: str
    start: str
    end: str
    group_size: int = Field(gt=0)
    purpose: str
    required_facilities: list[str] = []


class BookingCreate(BaseModel):
    room_id: int
    date: str
    start: str
    end: str
    purpose: str
    group_size: int = Field(gt=0)
    student: str


class BookingResponse(BaseModel):
    id: str
    roomId: int
    room: str
    code: str
    date: str
    start: str
    end: str
    purpose: str
    group: int
    status: str
    student: str

class BookingStatusUpdate(BaseModel):
    status: str


class RoomCreate(BaseModel):
    name: str
    code: str
    building: str
    capacity: int = Field(gt=0)
    type: str = "General"
    floor: str = "Campus"
    facilities: list[str] = []
    allowed_purposes: list[str] = []
    image: Optional[str] = None

        