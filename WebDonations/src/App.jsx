import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import GuestRouter from "./routers/GuestRouter";
import UserRouter from "./routers/UserRouter";
import AdminRouter from "./routers/AdminRouter";
import "./App.css";
import { getUserId } from "./functions/user/auth";
import Loader from "./pages/shared/Loader/Loader";

const App = () => {
  const [role, setRole] = useState("guest");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await getUserId();
        console.log("User session response:", response);
        if (response.status === "success") {
          setUserId(response.user_id);
          setRole(response.role);
          setRole("user");
        } else {
          setRole("guest");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (role === "guest") {
    return <GuestRouter />;
  }
  if (role === "user") {
    console.log("user is logged in", userId);
    return <UserRouter user={userId} />;
  }
  if (role === "admin") {
    console.log("admin is logged in", userId);
    return <AdminRouter />;
  }
  return null;
};

export default App;
