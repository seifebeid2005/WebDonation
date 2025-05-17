import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import GuestRouter from "./routers/GuestRouter";
import UserRouter from "./routers/UserRouter";
import AdminRouter from "./routers/AdminRouter";

function App() {
  const [role, setRole] = useState("guest"); // Change to 'user' or 'admin' for testing

  let RouterComponent;
  if (role === "admin") RouterComponent = AdminRouter;
  else if (role === "user") RouterComponent = UserRouter;
  else RouterComponent = GuestRouter;

  return (
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  );
}

export default App;
