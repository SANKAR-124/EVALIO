import { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (loggedIn) {
      setCurrentPage("dashboard");
    }
  }, []);

  // Landing → Login
  const handleContinue = () => {
    setCurrentPage("login");
  };

  // Login → Dashboard
  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setCurrentPage("dashboard");
  };

  // Dashboard → Login (for future logout)
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("workspace_id");
    setCurrentPage("login");
  };

  switch (currentPage) {
    case "landing":
      return <Landing onContinue={handleContinue} />;

    case "login":
      return <Login onLogin={handleLogin} />;

    case "dashboard":
      return <Dashboard onLogout={handleLogout} />;

    default:
      return <Landing onContinue={handleContinue} />;
  }
}

export default App;