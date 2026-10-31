
const API_BASE_URL = "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.join(", ")
      : data.detail || "Something went wrong";

    throw new Error(message);
  }

  return data;
}

const normalizeBooking = (booking) => ({
  ...booking,
  roomId: booking.roomId ?? booking.room_id,
  group: booking.group ?? booking.group_size,
});

export const api = {
  async getRooms() {
    return request("/rooms");
  },

  async searchRooms(filters) {
    return request("/rooms/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  },

  async addRoom(room) {
    return request("/rooms", {
      method: "POST",
      body: JSON.stringify(room),
    });
  },

  async getBookings() {
    const bookings = await request("/bookings");
    return bookings.map(normalizeBooking);
  },

  async createBooking(booking) {
    const result = await request("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    });

    return {
      ...result,
      booking: normalizeBooking(result.booking),
    };
  },

  async updateBookingStatus(id, status) {
    const result = await request(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    return {
      ...result,
      booking: normalizeBooking(result.booking),
    };
  },
};
