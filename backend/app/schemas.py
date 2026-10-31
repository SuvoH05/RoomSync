
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

class FeedbackCreate(BaseModel):
    booking_id: str
    student: str
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=5, max_length=1000)

class FeedbackResponse(BaseModel):
    id: int
    booking_id: str
    room_id: int
    student: str
    rating: int
    comment: str
    created_at: Optional[str] = None


