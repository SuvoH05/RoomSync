from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import rooms, bookings

app = FastAPI(
    title="RoomSync API",
    description="Smart Campus Room Booking System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(bookings.router)


@app.get("/")
def home():
    return {"message": "Welcome to RoomSync API!"}