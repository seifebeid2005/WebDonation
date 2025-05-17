import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import GuestRouter from "./routers/GuestRouter";
import UserRouter from "./routers/UserRouter";
import AdminRouter from "./routers/AdminRouter";

const App = () => {
  const [role, setRole] = useState("guest");
  
  // Check for admin login in localStorage
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      setRole("admin");
    }
    // You can add similar checks for user role if needed
  }, []);

  return (
    <BrowserRouter>
      {role === "guest" && <GuestRouter />}
      {role === "user" && <UserRouter />}
      {role === "admin" && <AdminRouter />}
    </BrowserRouter>
  );
};

export default App;
