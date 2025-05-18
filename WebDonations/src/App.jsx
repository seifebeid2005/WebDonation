import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import GuestRouter from "./routers/GuestRouter";
import UserRouter from "./routers/UserRouter";
import AdminRouter from "./routers/AdminRouter";
import "./App.css";
import { useEffect } from "react";
import { getUserId } from "./functions/user/auth";
const App = () => {
  const [role, setRole] = useState("guest"); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await getUserId();
      if (response.status) {
        const userId = response.user_id;
        setUserId(userId);
        setRole(userId ? "user" : role);
        setIsLoggedIn(true);
      } else {
        setRole("guest");
        setIsLoggedIn(false);
      }
    };
    fetchUserId();
  }, []);

  if (role === "guest") {
    return <GuestRouter />;
  }
  if (role === "user") {
    console.log("user is loged in", userId);
    return <UserRouter />;
  }
  if (role === "admin") {
    return <AdminRouter />;
  }
  return null;
};

export default App;
