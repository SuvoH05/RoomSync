
import { useMemo } from "react";
import {
  DoorOpen,
  CalendarCheck,
  Clock3,
  Activity,
  ArrowUpRight,
  Download,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import StatCard from "../components/StatCard.jsx";
import BookingTable from "../components/BookingTable.jsx";

const pieColors = ["#635BFF", "#28B987", "#E9A23B"];

export default function AdminDashboard({
  rooms,
  bookings,
  onStatusChange,
  setPage,
}) {
  // Booking statistics
  const pending = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  const confirmed = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;

  // Weekly booking activity (Monday to Sunday)
  const weeklyBookings = useMemo(() => {
    const today = new Date();

    const monday = new Date(today);
    monday.setDate(
      today.getDate() - ((today.getDay() + 6) % 7)
    );

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + index);

      const dateKey = [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, "0"),
        String(day.getDate()).padStart(2, "0"),
      ].join("-");

      return {
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count: bookings.filter(
          (booking) => booking.date === dateKey
        ).length,
      };
    });
  }, [bookings]);

  // Actual booking status distribution
  const pieData = useMemo(() => {
    return [
      {
        name: "Confirmed",
        value: confirmed,
      },
      {
        name: "Pending",
        value: pending,
      },
      {
        name: "Cancelled",
        value: bookings.filter(
          (b) => b.status === "Cancelled"
        ).length,
      },
    ];
  }, [bookings, confirmed, pending]);

  // Most-booked rooms (excluding cancelled bookings)
  const topRooms = useMemo(() => {
    const roomCounts = rooms.map((room) => {
      const count = bookings.filter(
        (booking) =>
          Number(booking.roomId ?? booking.room_id) ===
            Number(room.id) &&
          booking.status !== "Cancelled"
      ).length;

      return {
        name: room.name,
        count,
      };
    });

    return roomCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [rooms, bookings]);

  const maxRoomBookings = Math.max(
    1,
    ...topRooms.map((room) => room.count)
  );

  return (
    <div className="page-content admin-content">

      {/* Page heading */}
      <div className="page-title-row">
        <div>
          <span className="eyebrow">CAMPUS OPERATIONS</span>
          <h1>
            Good morning, Admin <span className="wave">✦</span>
          </h1>
          <p>
            Here's what's happening across your campus spaces today.
          </p>
        </div>

        <button className="button button-secondary">
          <Download size={16} /> Export report
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <StatCard
          label="Total spaces"
          value={rooms.length}
          change="Live database"
          note="Across campus"
          icon={DoorOpen}
          tone="purple"
        />

        <StatCard
          label="Total bookings"
          value={bookings.length}
          change="All-time records"
          note="Booking requests"
          icon={CalendarCheck}
          tone="blue"
        />

        <StatCard
          label="Pending requests"
          value={pending}
          change="Needs attention"
          note="Awaiting review"
          icon={Clock3}
          tone="orange"
        />

        <StatCard
          label="Confirmed bookings"
          value={confirmed}
          change="Approved reservations"
          note="From the database"
          icon={Activity}
          tone="green"
        />
      </div>

      {/* Charts */}
      <div className="analytics-grid">

        {/* Weekly booking activity */}
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Weekly booking activity</h2>
              <p>Booking requests across the current week</p>
            </div>
            <span className="mini-select">This week</span>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyBookings} barSize={25}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#EEF0F5"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8A91A3", fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8A91A3", fontSize: 12 }}
                />

                <Tooltip cursor={{ fill: "#F5F4FF" }} />

                <Bar
                  dataKey="count"
                  name="Bookings"
                  fill="#635BFF"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot purple-dot" />
              Booking requests
            </span>
            <span className="legend-note">Live database data</span>
          </div>
        </section>

        {/* Booking status distribution */}
        <section className="panel availability-panel">
          <div className="panel-heading">
            <div>
              <h2>Booking distribution</h2>
              <p>Current reservation statuses</p>
            </div>

            <button
              className="icon-button"
              onClick={() => setPage("reservations")}
            >
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={66}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{bookings.length}</strong>
              <span>Bookings</span>
            </div>
          </div>

          <div className="donut-legend">
            {pieData.map((item, index) => (
              <span key={item.name}>
                <i
                  className="legend-dot"
                  style={{ background: pieColors[index] }}
                />
                {item.name} <b>{item.value}</b>
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Most booked rooms */}
      <section className="panel room-usage-panel">
        <div className="panel-heading">
          <div>
            <h2>Most booked spaces</h2>
            <p>Rooms ranked by active booking requests</p>
          </div>

          <button
            className="subtle-link"
            onClick={() => setPage("rooms")}
          >
            Manage rooms <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="usage-list">
          {topRooms.length === 0 ? (
            <p>No rooms available yet.</p>
          ) : (
            topRooms.map((room, index) => (
              <div className="usage-row" key={room.name}>
                <span className="usage-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{room.name}</strong>

                <div className="usage-track">
                  <i
                    style={{
                      width: `${(room.count / maxRoomBookings) * 100}%`,
                    }}
                  />
                </div>

                <b>
                  {room.count}{" "}
                  {room.count === 1 ? "booking" : "bookings"}
                </b>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent reservations */}
      <section className="panel bookings-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent reservations</h2>
            <p>Latest activity from students</p>
          </div>

          <button
            className="subtle-link"
            onClick={() => setPage("reservations")}
          >
            View all <ArrowUpRight size={15} />
          </button>
        </div>

        <BookingTable
          bookings={bookings}
          onStatusChange={onStatusChange}
          compact
        />
      </section>

    </div>
  );
}
