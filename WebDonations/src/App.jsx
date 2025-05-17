import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import GuestRouter from "./routers/GuestRouter";
import UserRouter from "./routers/UserRouter";
import AdminRouter from "./routers/AdminRouter";
import "./App.css";

const App = () => {
  const [role, setRole] = useState("guest"); // Change to 'user' or 'admin' for testing

  if (role === "guest") {
    return <GuestRouter />;
  }
  if (role === "user") {
    return <UserRouter />;
  }
  if (role === "admin") {
    return <AdminRouter />;
  }
  return null;
};

export default App;
