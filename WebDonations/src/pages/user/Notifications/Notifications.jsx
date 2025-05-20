import React, { useEffect, useState } from "react";
import "./Notifications.css"; // Import your CSS file for styling

export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fake data (replace with API later)
    const data = [
      {
        id: 1,
        type: "success",
        message: "✅ Your donation has been approved!",
        created_at: "2 mins ago",
      },
      {
        id: 2,
        type: "info",
        message: "📢 New campaign added for Gaza 🇵🇸",
        created_at: "15 mins ago",
      },
      {
        id: 3,
        type: "error",
        message: "❗ Payment failed. Please try again.",
        created_at: "1 hour ago",
      },
    ];
    setNotifications(data);
  }, []);

  return (
    <div className="container">
      <h2 className="title">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="empty">No notifications yet!</p>
      ) : (
        notifications.map((note) => (
          <div key={note.id} className={`notification ${note.type}`}>
            <p className="message">{note.message}</p>
            <p className="date">🕒 {note.created_at}</p>
          </div>
        ))
      )}
    </div>
  );
}
