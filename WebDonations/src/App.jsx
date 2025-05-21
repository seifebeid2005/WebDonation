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

        // Admin is logged in (even with error status)
        if (response.role === "admin") {
          setRole("admin");
          console.log("Admin authenticated");
          return;
        }

        // Regular user is logged in
        if (response.status === "success" && response.user_id) {
          setUserId(response.user_id);
          setRole("user");
          console.log("User authenticated with ID:", response.user_id);
          return;
        }

        // No valid session
        setRole("guest");
        console.log("No active session, setting as guest");
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

  // Render appropriate router based on role
  switch (role) {
    case "guest":
      return <GuestRouter />;
    case "user":
      console.log("User router loaded with ID:", userId);
      return <UserRouter user={userId} />;
    case "admin":
      console.log("Admin router loaded with ID:", userId);
      return <AdminRouter />;
    default:
      return <GuestRouter />;
  }
};

export default App;
