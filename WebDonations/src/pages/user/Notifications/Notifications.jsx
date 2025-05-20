import React, { useEffect, useState } from "react";
import "./Notifications.css"; // Assuming you have a CSS file for styling

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const data = [
      {
        id: 1,
        type: "success",
        message: "✅ Your donation has been approved!",
        created_at: "2 mins ago",
        read: false,
      },
      {
        id: 2,
        type: "info",
        message: "📢 New campaign added for Gaza 🇵🇸",
        created_at: "15 mins ago",
        read: false,
      },
      {
        id: 3,
        type: "error",
        message: "❗ Payment failed. Please try again.",
        created_at: "1 hour ago",
        read: true,
      },
    ];
    setNotifications(data);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="notifications">
      <div className="container">
        <div className="header">
          <h2>🔔 Notifications</h2>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("success")}>✅ Success</button>
          <button onClick={() => setFilter("info")}>📢 Info</button>
          <button onClick={() => setFilter("error")}>❗ Error</button>
        </div>

        {filteredNotifications.length === 0 ? (
          <p className="empty">No notifications to show!</p>
        ) : (
          filteredNotifications.map((note) => (
            <div
              key={note.id}
              className={`notification ${note.type} ${note.read ? "read" : ""}`}
            >
              <p className="message">{note.message}</p>
              <p className="date">🕒 {note.created_at}</p>
              <div className="actions">
                <button onClick={() => handleMarkRead(note.id)}>
                  {note.read ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button onClick={() => handleDelete(note.id)}>🗑</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
