import React from "react";

const Home = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to WebDonations</h1>
      <p>
        Your platform to make a difference. Donate, support, and help those in
        need.
      </p>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
        alt="Helping hands"
        style={{ width: "300px", borderRadius: "8px", margin: "2rem 0" }}
      />
      <div>
        <a
          href="/donate"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Donate Now
        </a>
      </div>
    </div>
  );
};

export default Home;
